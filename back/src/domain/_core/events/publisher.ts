export interface Publisher<T> {
    readonly event: string;
    publish(data: T): Promise<void>;
}
