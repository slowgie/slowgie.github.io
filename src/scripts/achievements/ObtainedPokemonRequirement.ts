///<reference path="Requirement.ts"/>

class ObtainedPokemonRequirement extends Requirement {
    public pokemonID: number;

    constructor(pokemon: PokemonListData, value = 1, option: GameConstants.AchievementOption = GameConstants.AchievementOption.more) {
        super(value, option);
        this.pokemonID = pokemon.id;
    }

    public getProgress() {
        return Math.min(App.game?.statistics?.pokemonCaptured[this.pokemonID](), this.requiredValue);
    }

    public hint(): string {
        return `${pokemonMap[this.pokemonID].name} needs to be caught.`;
    }
}
