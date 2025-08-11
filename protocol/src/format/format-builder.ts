export class FormatBuilder {
    public readonly chunks: Buffer[] = [];

    constructor(apiVersion: number, apiKey: number) {
        this.addInt32(apiVersion);
        this.addInt32(apiKey);
    }

    public addInt8(value: number): this {
        const buf = Buffer.alloc(1);
        buf.writeInt8(value, 0);
        this.chunks.push(buf);
        return this;
    }

    public addInt16(value: number): this {
        const buf = Buffer.alloc(2);
        buf.writeInt16BE(value, 0);
        this.chunks.push(buf);
        return this;
    }

    public addInt32(value: number): this {
        const buf = Buffer.alloc(4);
        buf.writeInt32BE(value, 0);
        this.chunks.push(buf);
        return this;
    }

    public addInt64(value: number): this {
        const buf = Buffer.alloc(8);
        buf.writeBigInt64BE(BigInt(value), 0);
        this.chunks.push(buf);
        return this;
    }

    public addString(value: string): this {
        const strBuf = Buffer.from(value, "utf-8");
        this.addInt64(strBuf.length);
        this.chunks.push(strBuf);
        return this;
    }

    public addNumber(value: number): this {
        return this.addInt32(value);
    }

    public addArray<T>(
        items: T[],
        encodeItem: (builder: FormatBuilder, item: T) => void,
    ): this {
        this.addInt64(items.length);
        for (const item of items) {
            encodeItem(this, item);
        }
        return this;
    }

    public build(): Buffer {
        return Buffer.concat(this.chunks);
    }
}
