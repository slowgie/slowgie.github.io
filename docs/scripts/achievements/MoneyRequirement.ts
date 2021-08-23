///<reference path="AchievementRequirement.ts"/>

class MoneyRequirement extends AchievementRequirement {
    constructor(requiredValue: number, option: GameConstants.AchievementOption = GameConstants.AchievementOption.more) {
        super(requiredValue, option, GameConstants.AchievementType['Money']);
    }

    public getProgress() {
        return Math.min(App.game.statistics.totalMoney(), this.requiredValue);
    }

    public hint(): string {
        return `${this.requiredValue} Pokédollars need to be obtained.`;
    }
}
