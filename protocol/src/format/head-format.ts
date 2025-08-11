export class HeadFormat {
    public readonly version: number;
    public readonly api: number;
    public readonly dataLength: number;

    constructor(version: number, api: number, dataLength: number) {
        this.version = version;
        this.api = api;
        this.dataLength = dataLength;
    }
}
