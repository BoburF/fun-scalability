export interface Cache {
    open(): Promise<void>;
    close(): Promise<void>;
    set(key: string, data: Buffer): Promise<void>;
    get(key: string): Promise<Buffer | null>;
}
