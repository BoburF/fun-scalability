export type SubscriberHandler<T = Buffer> = (data: T) => Promise<void>;

export interface Broker {
    init(): Promise<void>;
    publish(event: string, data: Buffer): Promise<void>;
    subscribe(event: string, handler: SubscriberHandler): Promise<void>;
}
