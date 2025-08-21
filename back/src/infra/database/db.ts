export interface DB<DBType = unknown> {
    connection: DBType;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
}
