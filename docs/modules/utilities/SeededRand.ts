import { MINUTE, HOUR } from '../GameConstants';

export default class SeededRand {
    private static state = 12345;
    private static readonly MOD: number = 233280;
    private static readonly OFFSET: number = 49297;
    private static readonly MULTIPLIER: number = 9301;

    public static next(): number {
        this.state = (this.state * this.MULTIPLIER + this.OFFSET) % this.MOD;
        return this.state / this.MOD;
    }

    public static seedWithDate(d: Date): void {
        this.state = Number((d.getFullYear() - 1900) * d.getDate() + 1000 * d.getMonth() + 100000 * d.getDate());
    }

    // hours specifies how many hours the seed should remain the same
    public static seedWithDateHour(d: Date, hours = 1): void {
        // Adjust date for timezone offset and hours rounded
        const time = d.getTime();
        const offset = -(d.getTimezoneOffset() * (MINUTE));
        const offsetTime = time + offset;
        const newDate = new Date(time - (offsetTime % (HOUR * hours)));
        const newHour = newDate.getHours();
        // Set state based on adjusted date
        this.seedWithDate(newDate);
        // Update state based on current hour
        this.state += 1000000 * newHour;
    }

    public static seed(state: number): void {
        this.state = Math.abs(state);
    }

    // get a number between min and max (both inclusive)
    public static intBetween(min: number, max: number): number {
        return Math.floor((max - min + 1) * SeededRand.next() + min);
    }

    public static boolean(): boolean {
        return !!this.intBetween(0, 1);
    }

    public static fromArray<T>(arr: Array<T>): T {
        return arr[SeededRand.intBetween(0, arr.length - 1)];
    }

    public static fromWeightedArray<T>(arr: Array<T>, weights: Array<number>): T {
        const max = weights.reduce((acc, weight) => acc + weight, 0);
        let rand = this.intBetween(1, max);
        return arr.find((_e, i) => (rand -= weights[i]) <= 0) || arr[0];
    }

    public static fromEnum(_enum): number {
        const arr = Object.keys(_enum).map(Number).filter((item) => item >= 0);
        return this.fromArray(arr);
    }
}
