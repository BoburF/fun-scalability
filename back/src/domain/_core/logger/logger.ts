export interface Logger {
    info(log: string): void;
    error(log: string, err?: unknown): void;
    warn(log: string): void;
}
