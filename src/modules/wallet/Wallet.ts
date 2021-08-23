/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import { Observable as KnockoutObservable } from 'knockout';
import { Feature } from '../DataStore/common/Feature';
import GameHelper from '../GameHelper';
import { Currency } from '../GameConstants';
import Multiplier from '../multiplier/Multiplier';
import Amount from './Amount';
import { animateCurrency } from '../utilities/UI';

export default class Wallet implements Feature {
    name = 'Wallet';
    saveKey = 'wallet';
    currencies: Array<KnockoutObservable<number>>;

    defaults = {
        currencies: new Array(GameHelper.enumLength(Currency)).fill(0),
    };

    constructor(private multiplier: Multiplier) {
        this.currencies = this.defaults.currencies.map((v) => ko.observable(v));
    }

    public gainMoney(base: number): Amount {
        return this.addAmount(new Amount(base, Currency.money));
    }

    public gainDungeonTokens(base: number): Amount {
        return this.addAmount(new Amount(base, Currency.dungeonToken));
    }

    public gainQuestPoints(base: number): Amount {
        return this.addAmount(new Amount(base, Currency.questPoint));
    }

    public gainDiamonds(base: number): Amount {
        return this.addAmount(new Amount(base, Currency.diamond));
    }

    public gainFarmPoints(base: number): Amount {
        return this.addAmount(new Amount(base, Currency.farmPoint));
    }

    public gainBattlePoints(base: number): Amount {
        return this.addAmount(new Amount(base, Currency.battlePoint));
    }

    public calcBonus(amount: Amount) {
        switch (amount.currency) {
            case Currency.money:
                return this.multiplier.getBonus('money', true);
            case Currency.dungeonToken:
                return this.multiplier.getBonus('dungeonToken', true);
            case Currency.questPoint:
            case Currency.diamond:
            case Currency.farmPoint:
            case Currency.battlePoint:
            default:
                return 1;
        }
    }

    public addAmount(amount: Amount) {
        if (Number.isNaN(amount.amount) || amount.amount <= 0) {
            console.trace('Could not add amount:', amount);
            amount.amount = 1;
        }

        // Calculate the bonuses
        amount.amount = Math.floor(amount.amount * this.calcBonus(amount));

        GameHelper.incrementObservable(this.currencies[amount.currency], amount.amount);
        animateCurrency(amount);

        switch (amount.currency) {
            case Currency.money:
                GameHelper.incrementObservable(App.game.statistics.totalMoney, amount.amount);
                break;
            case Currency.dungeonToken:
                GameHelper.incrementObservable(App.game.statistics.totalDungeonTokens, amount.amount);
                break;
            case Currency.questPoint:
                GameHelper.incrementObservable(App.game.statistics.totalQuestPoints, amount.amount);
                break;
            case Currency.diamond:
                GameHelper.incrementObservable(App.game.statistics.totalDiamonds, amount.amount);
                break;
            case Currency.farmPoint:
                GameHelper.incrementObservable(App.game.statistics.totalFarmPoints, amount.amount);
                break;
            case Currency.battlePoint:
                GameHelper.incrementObservable(App.game.statistics.totalBattlePoints, amount.amount);
                break;
            default:
                break;
        }

        return amount;
    }

    public hasAmount(amount: Amount) {
        return this.currencies[amount.currency]() >= amount.amount;
    }

    public loseAmount(amount: Amount) {
        if (Number.isNaN(amount.amount) || amount.amount <= 0) {
            console.trace('Could not remove amount:', amount);
            amount.amount = 1;
        }

        GameHelper.incrementObservable(this.currencies[amount.currency], -amount.amount);
    }

    initialize(): void {
    }

    canAccess(): boolean {
        return true;
    }

    fromJSON(json: Record<string, any>): void {
        if (json == null) {
            return;
        }

        this.currencies = this.defaults.currencies.map((v) => ko.observable(v));
        if (json.currencies !== null) {
            const currenciesJson = json.currencies;
            currenciesJson.forEach((value, index) => {
                this.currencies[index](value || 0);
            });
        }
    }

    toJSON(): Record<string, any> {
        return {
            currencies: this.currencies.map(ko.unwrap),
        };
    }

    update(): void {
        // This method intentionally left blank
    }
}
