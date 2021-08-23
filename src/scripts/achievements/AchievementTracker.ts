class AchievementTracker implements Feature {
    name = 'AchievementTracker';
    saveKey = 'achievementTracker';
    trackedAchievement: KnockoutObservable<Achievement>;

    defaults = {
        'trackedAchievement': null,
    };

    constructor() {
        this.trackedAchievement = ko.observable(this.defaults.trackedAchievement);
    }

    initialize(): void {

    }

    canAccess(): boolean {
        return App.game.party.caughtPokemon.length >= 110;
    }

    update(delta: number): void {
    }

    fromJSON(json: Record<string, any>): void {
        if (json == null) {
            return;
        }

        if (!!json.trackedAchievementName) {
            const achievement: Achievement = AchievementHandler.findByName(json.trackedAchievementName);
            if (!!achievement) {
                this.trackedAchievement(achievement);
            }
        }
    }

    toJSON(): Record<string, any> {
        return {
            trackedAchievementName: this.hasTrackedAchievement() ? this.trackedAchievement().name : null,
        };
    }

    trackAchievement(achievement: Achievement): void {
        this.trackedAchievement(achievement);
    }

    hasTrackedAchievement(): boolean {
        return this.trackedAchievement() !== null;
    }
}
