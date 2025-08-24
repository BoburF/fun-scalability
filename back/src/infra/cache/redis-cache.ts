import Redis from "ioredis";
import { CustomError } from "../../domain/_core/error";
import type { Cache } from "./base-cache";
import { CacheErrorCodes } from "./error-codes";
import type { Logger } from "../../domain/_core/logger";

export class RedisCache implements Cache {
    private readonly redis: Redis;

    constructor(private readonly logger: Logger) {
        const url = this.validateUri();
        this.redis = new Redis(Number(url.port), url.host, { lazyConnect: true });
    }

    public async open(): Promise<void> {
        await this.redis.connect();
        this.logger.info("Cache connecting...");
    }

    public async close(): Promise<void> {
        await this.redis.quit();
        this.logger.info("Cache closing...");
    }

    public async set(key: string, data: Buffer): Promise<void> {
        await this.redis.set(key, data);
    }

    public async get(key: string): Promise<Buffer | null> {
        return this.redis.getBuffer(key);
    }

    private validateUri() {
        if (process.env["CACHE_URI"]) {
            return new URL(process.env["CACHE_URI"]);
        }

        throw new CustomError(CacheErrorCodes.InvalidConfig, "CACHE_URI");
    }
}
