/// <reference path="../Quest.ts" />

class BuyPokeballsQuest extends Quest implements QuestInterface {

    private pokeball: GameConstants.Pokeball;

    constructor(amount: number, reward: number, pokeball: GameConstants.Pokeball) {
        super(amount, reward);
        this.pokeball = pokeball;
        this.focus = App.game.statistics.pokeballsBought[this.pokeball];
    }

    get description(): string {
        return `Buy ${this.amount.toLocaleString('en-US')} ${GameConstants.Pokeball[this.pokeball]}s.`;
    }

    toJSON() {
        const json = super.toJSON();
        json['name'] = this.constructor.name;
        json['data'].push(this.pokeball);
        return json;
    }
}
