import { Broker, SubscriberHandler } from "./base-broker";
import { BrokerErrorCodes } from "./error-codes";
import { CustomError } from "../../domain/_core/error";
import type { Logger } from "../../domain/_core/logger";
import Redis from "ioredis";

export class RedisBroker implements Broker {
    private readonly subscriber: Redis;
    private readonly publisher: Redis;
    private handlers: Map<string, SubscriberHandler> = new Map();

    constructor(private logger: Logger) {
        const url = this.validateUri();
        this.subscriber = new Redis(Number(url.port), url.host, { lazyConnect: true, autoResubscribe: true });
        this.publisher = new Redis(Number(url.port), url.host, { lazyConnect: true });
    }

    async init(): Promise<void> {
        await this.subscriber.connect();
        this.logger.info("Broker starting...");
        this.subscriber.on("message", (channel, message) => {
            const handler = this.handlers.get(channel);
            if (handler) {
                handler(Buffer.from(message, "hex"));
            } else {
                console.warn(`No handler for channel: ${channel}`);
            }
        });

        this.logger.info("Subscribers initalizing...");
    }

    async publish(event: string, data: Buffer): Promise<void> {
        await this.publisher.publish(event, data.toString("hex"));
    }

    async subscribe(event: string, handler: SubscriberHandler): Promise<void> {
        await this.subscriber.subscribe(event);

        this.handlers.set(event, handler);
    }

    private validateUri() {
        if (process.env["BROKER_URI"]) {
            return new URL(process.env["BROKER_URI"]);
        }

        throw new CustomError(BrokerErrorCodes.InvalidConfig, "BROKER_URI");
    }
}
