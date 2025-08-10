export class Format {
    public readonly version: number;
    public readonly api: number;

    constructor(version: number, api: number) {
        this.version = version;
        this.api = api;
    }
}
