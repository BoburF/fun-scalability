import type { Logger } from "../../domain/logger";

export class LoggerImpl implements Logger {
    public info(log: string): void {
        this.template("INFO", log);
    }

    public error(log: string, err?: {}): void {
        const logData = `${log}:${JSON.stringify(err)}`;
        this.template("ERROR", logData);
    }

    public warn(log: string): void {
        this.template("WARN", log);
    }

    private template(level: string, log: string) {
        console.log(`[${new Date()}]:[${level}]:${log}`);
    }
}
