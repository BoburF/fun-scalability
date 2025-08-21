export class CustomError extends Error {
    private readonly errorCode: number;
    private readonly data: string;

    constructor(errorCode: number, data: string) {
        super(`${errorCode}:${data}`);

        this.errorCode = errorCode;
        this.data = data;
    }

    public toLog() {
        return {
            name: this.name,
            errorCode: this.errorCode,
            data: this.data,
            cause: this.cause,
            trace: this.stack,
        };
    }

    public toJSON() {
        return {
            errorCode: this.errorCode,
            data: this.data,
        };
    }
}
