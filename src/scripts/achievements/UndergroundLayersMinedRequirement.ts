///<reference path="AchievementRequirement.ts"/>

class UndergroundLayersMinedRequirement extends AchievementRequirement {
    constructor(value: number, option: GameConstants.AchievementOption = GameConstants.AchievementOption.more) {
        super(value, option, GameConstants.AchievementType['Underground Layers Mined']);
    }

    public getProgress() {
        return Math.min(App.game.statistics.undergroundLayersMined(), this.requiredValue);
    }

    public hint(): string {
        const suffix = (this.requiredValue > 1) ? 's' : '';
        return `${this.requiredValue} layer${suffix} need to be mined in the Underground.`;
    }
}
