/// <reference path="../GameConstants.d.ts"/>
/// <reference path="../pokemons/PokemonNameType.d.ts"/>
declare class PartyHelper {
    static calculateOnePokemonAttack(pokemon: any, region?: GameConstants.Region, ignoreRegionMultiplier?: boolean, useBaseAttack?: boolean): number;
    static getRegionAttackMultiplier(highestRegion?: any): number;
    static calcNativeRegion(pokemonName: PokemonNameType): number;
    static calculateRegionMultiplier(pokemon: any, region?: any): number;
}
