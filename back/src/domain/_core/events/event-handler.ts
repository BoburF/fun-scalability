export interface DomainEventHandler<T = unknown> {
    readonly event: string;
    handler(data: T): Promise<void>;
}
