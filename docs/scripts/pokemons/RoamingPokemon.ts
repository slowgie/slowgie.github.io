class RoamingPokemon {
    public pokemon: PokemonListData;

    constructor(
        public pokemonName: PokemonNameType,
        public unlockRequirement?: Requirement
    ) {
        this.pokemon = pokemonMap[pokemonName];
    }

    public isRoaming() {
        return this.unlockRequirement ? this.unlockRequirement.isCompleted() : true;
    }
}


