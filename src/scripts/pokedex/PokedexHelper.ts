import TypeColor = GameConstants.TypeColor;

class PokedexHelper {
    public static toggleStatisticShiny = ko.observable(true);
    public static toggleAllShiny = ko.observable(true);

    public static getBackgroundColors(name: PokemonNameType): string {
        const pokemon = PokemonHelper.getPokemonByName(name);

        if (!this.pokemonSeen(pokemon.id)()) {
            return 'grey';
        }
        if (pokemon.type2 == PokemonType.None) {
            return TypeColor[pokemon.type1];
        }
        return `linear-gradient(90deg,${TypeColor[pokemon.type1]} 50%, ${TypeColor[pokemon.type2]} 50%)`;
    }

    /**
     * Returns true if you have seen the pokemon
     * @param {number} id
     * @returns {boolean}
     */
    public static pokemonSeen(id: number): KnockoutComputed<boolean> {
        return ko.pureComputed(() => {
            try {
                return App.game.statistics.pokemonEncountered[id]() > 0 || App.game.statistics.pokemonDefeated[id]() > 0 || App.game.statistics.pokemonCaptured[id]() > 0 || App.game.party.alreadyCaughtPokemon(id);
            } catch (error) {
                return false;
            }
        });
    }

    public static filteredList: KnockoutObservableArray<Record<string, any>> = ko.observableArray([]);

    public static populateFilters() {
        let options = $('#pokedex-filter-type1');
        $.each(PokemonType, function () {
            if (isNaN(Number(this)) && this != PokemonType.None) {
                options.append($('<option />').val(PokemonType[this]).text(this));
            }
        });

        options = $('#pokedex-filter-type2');
        $.each(PokemonType, function () {
            if (isNaN(Number(this)) && this != PokemonType.None) {
                options.append($('<option />').val(PokemonType[this]).text(this));
            }
        });

        options = $('#pokedex-filter-region');
        for (let i = 0; i <= GameConstants.MAX_AVAILABLE_REGION; i++) {
            options.append($('<option />').val(i).text(GameConstants.camelCaseToString(GameConstants.Region[i])));
        }
    }

    public static updateList() {
        PokedexHelper.filteredList(PokedexHelper.getList());
    }

    public static getList(): Array<Record<string, any>> {
        const filter = PokedexHelper.getFilters();

        const highestEncountered = App.game.statistics.pokemonEncountered.highestID;
        const highestDefeated = App.game.statistics.pokemonDefeated.highestID;
        const highestCaught = App.game.statistics.pokemonCaptured.highestID;
        const highestDex = Math.max(highestEncountered, highestDefeated, highestCaught);

        return pokemonList.filter((pokemon) => {
            // Checks based on caught/shiny status
            const alreadyCaught = App.game.party.alreadyCaughtPokemon(pokemon.id);
            const alreadyCaughtShiny = App.game.party.alreadyCaughtPokemon(pokemon.id, true);

            // If the Pokemon shouldn't be unlocked yet
            const nativeRegion = PokemonHelper.calcNativeRegion(pokemon.name);
            if (nativeRegion > GameConstants.MAX_AVAILABLE_REGION || nativeRegion == GameConstants.Region.none) {
                return false;
            }

            // If not showing this region
            const region: (GameConstants.Region | null) = filter['region'] ? parseInt(filter['region'], 10) : null;
            if (region != null && region != nativeRegion) {
                return false;
            }

            // Event Pokemon
            if (pokemon.id <= 0 && !alreadyCaught) {
                return false;
            }

            // If we haven't seen a pokemon this high yet
            if (pokemon.id > highestDex) {
                return false;
            }

            // Check if the name contains the string
            if (filter['name'] && !pokemon.name.toLowerCase().includes(filter['name'].toLowerCase())) {
                return false;
            }

            // Check if either of the types match
            const type1: (PokemonType | null) = filter['type1'] ? parseInt(filter['type1'], 10) : null;
            const type2: (PokemonType | null) = filter['type2'] ? parseInt(filter['type2'], 10) : null;
            if ([type1, type2].includes(PokemonType.None)) {
                const type = (type1 == PokemonType.None) ? type2 : type1;
                if (!PokedexHelper.isPureType(pokemon, type)) {
                    return false;
                }
            } else if ((type1 != null && !(pokemon as PokemonListData).type.includes(type1)) || (type2 != null && !(pokemon as PokemonListData).type.includes(type2))) {
                return false;
            }

            // Alternate forms that we haven't caught yet
            if (!alreadyCaught && pokemon.id != Math.floor(pokemon.id)) {
                return false;
            }

            // If not caught
            if (filter['caught'] && !alreadyCaught) {
                return false;
            }

            // If not caught shiny variant
            if (filter['shiny'] && !alreadyCaughtShiny) {
                return false;
            }

            // If not caught, or already caught shiny
            if (filter['not-shiny'] && (!alreadyCaught || alreadyCaughtShiny)) {
                return false;
            }

            // If already caught
            if (filter['uncaught'] && alreadyCaught) {
                return false;
            }

            // Only pokemon with a hold item
            if (filter['held-item'] && !BagHandler.displayName((pokemon as PokemonListData).heldItem)) {
                return false;
            }

            return true;
        });
    }

    private static getFilters() {
        const res = {};
        res['name'] = (<HTMLInputElement>document.getElementById('nameFilter')).value;
        const type1 = <HTMLSelectElement>document.getElementById('pokedex-filter-type1');
        res['type1'] = type1.options[type1.selectedIndex].value;
        const type2 = <HTMLSelectElement>document.getElementById('pokedex-filter-type2');
        res['type2'] = type2.options[type2.selectedIndex].value;
        const region = <HTMLSelectElement>document.getElementById('pokedex-filter-region');
        res['region'] = region.options[region.selectedIndex].value;
        res['caught'] = (<HTMLInputElement> document.getElementById('pokedex-filter-caught')).checked;
        res['uncaught'] = (<HTMLInputElement> document.getElementById('pokedex-filter-uncaught')).checked;
        res['shiny'] = (<HTMLInputElement> document.getElementById('pokedex-filter-shiny')).checked;
        res['not-shiny'] = (<HTMLInputElement> document.getElementById('pokedex-filter-not-shiny')).checked;
        res['held-item'] = (<HTMLInputElement> document.getElementById('pokedex-filter-held-item')).checked;
        return res;
    }

    private static getImage(id: number, name: string) {
        let src = 'assets/images/';
        if (App.game.party.alreadyCaughtPokemon(id, true) && this.toggleAllShiny()) {
            src += 'shiny';
        }
        src += `pokemon/${id}.png`;
        return src;
    }

    private static getImageStatistics(id: number) {
        let src = 'assets/images/';
        if (App.game.party.alreadyCaughtPokemon(id, true) && this.toggleStatisticShiny()) {
            src += 'shiny';
        }
        src += `pokemon/${id}.png`;
        return src;
    }

    private static isPureType(pokemon: PokemonListData, type: (PokemonType | null)): boolean {
        return (pokemon.type.length === 1 && (type == null || pokemon.type[0] === type));
    }
}

$(document).ready(() => {
    $('#pokemonStatisticsModal').on('hidden.bs.modal', () => {
        PokedexHelper.toggleStatisticShiny(true);
    });
});
