/**
 * Datalist of all Pokémon that are encountered on the routes
 * No need to ever use this list, use RouteHelper instead
 * If you ever need to use this list, request changes in RouteHelper instead.
 */

class SpecialRoutePokemon {
    constructor (
        public pokemon: PokemonNameType[],
        public req: OneFromManyRequirement | Requirement | MultiRequirement
    ) {}

    isAvailable(): boolean {
        return this.req.isCompleted();
    }
}

class RoutePokemon {
    public land: PokemonNameType[];
    public water: PokemonNameType[];
    public headbutt: PokemonNameType[];
    public special: SpecialRoutePokemon[];

    constructor({
        land = [],
        water = [],
        headbutt = [],
        special = [],
    }: {
        land?: PokemonNameType[],
        water?: PokemonNameType[],
        headbutt?: PokemonNameType[],
        special?: SpecialRoutePokemon[],
    }) {
        this.land = land;
        this.water = water;
        this.headbutt = headbutt;
        this.special = special;
    }
}
