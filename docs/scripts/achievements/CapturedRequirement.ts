///<reference path="AchievementRequirement.ts"/>

class CapturedRequirement extends AchievementRequirement {
    constructor(value: number, option: GameConstants.AchievementOption = GameConstants.AchievementOption.more) {
        super(value, option, GameConstants.AchievementType['Captured']);
    }

    public getProgress() {
        return Math.min(App.game.statistics.totalPokemonCaptured(), this.requiredValue);
    }

    public hint(): string {
        return `${this.requiredValue} Pokémon need to be captured.`;
    }
}
