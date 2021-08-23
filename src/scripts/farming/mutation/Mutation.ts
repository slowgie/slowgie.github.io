
interface MutationOptions {
    hint?: string,
    unlockReq?: () => boolean,
    showHint?: boolean,
}

abstract class Mutation implements Saveable {

    saveKey: string;

    defaults: Record<string, any>;

    _mutationChance: number;
    mutatedBerry: BerryType;
    _hint?: string;
    showHint: boolean;
    _unlockReq?: (() => boolean);

    _hintSeen: KnockoutObservable<boolean>;

    constructor(mutationChance: number, mutatedBerry: BerryType, options?: MutationOptions) {
        this._mutationChance = mutationChance;
        this.mutatedBerry = mutatedBerry;
        this._hint = options?.hint;
        this._unlockReq = options?.unlockReq;
        this.showHint = options?.showHint ?? true;

        this._hintSeen = ko.observable(false);
    }

    toJSON(): Record<string, any> {
        return {
            hintSeen: this.hintSeen,
        };
    }

    fromJSON(json: Record<string, any>): void {
        this.hintSeen = json?.hintSeen ?? false;
    }

    /**
     * Determines which plots can mutate
     * @return The plot indices that can mutate
     */
    abstract getMutationPlots(): number[];

    /**
     * Handles updating the farm with the mutation
     * @param index The plot index to mutate
     */
    abstract handleMutation(index: number): void;

    /**
     * Determines whether the player can even cause this mutation
     */
    get unlocked(): boolean {
        if (!this._unlockReq) {
            return true;
        }
        return this._unlockReq();
    }

    /**
     * Handles getting the hint for this mutation for the Kanto Berry Master
     */
    get hint(): string {
        if (!this.showHint) {
            return '';
        }
        if (this._hint) {
            return this._hint;
        }
        return '';
    }

    /**
     * Handles getting the mutation chance
     * @param idx The plot index
     */
    mutationChance(idx: number): number {
        return this._mutationChance;
    }

    /**
     * Update tag for mutations. Returns true if this mutation will occur
     */
    mutate(): boolean {
        if (!this.unlocked) {
            return false;
        }

        const plots = this.getMutationPlots();
        if (!plots.length) {
            return false;
        }

        let mutated = false;

        plots.forEach((idx) => {
            const willMutate =  Math.random() < this.mutationChance(idx) * App.game.farming.getMutationMultiplier() * App.game.farming.plotList[idx].getMutationMultiplier();
            if (!willMutate) {
                return;
            }
            this.handleMutation(idx);
            App.game.oakItems.use(OakItems.OakItem.Squirtbottle);
            mutated = true;
        });

        return mutated;
    }

    get hintSeen() {
        return this._hintSeen();
    }

    set hintSeen(bool: boolean) {
        this._hintSeen(bool);
    }

}
