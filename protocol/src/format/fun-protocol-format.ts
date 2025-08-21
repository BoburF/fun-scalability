import { BaseSchemaType } from "./schema-type";
import { SchemaTypes } from "./schema-enums";

export type InferType<S> =
    S extends BaseSchemaType<infer U>
        ? U extends (infer Item)[]
            ? Item extends Record<string, BaseSchemaType<any>>
                ? { [K in keyof Item]: InferType<Item[K]> }[]
                : Item[]
            : U
        : never;

export type InferSchema<T extends Record<string, BaseSchemaType<any>>> = {
    [K in keyof T]: InferType<T[K]>;
};

export type SchemaDefinition = Record<string, BaseSchemaType<any>>;

export class SchemaBuilder {
    static schemaDefinition<T extends SchemaDefinition>(schema: T): T {
        return schema;
    }

    static number8() {
        return {
            type: SchemaTypes.number8,
            parse: (data, offset) => {
                return [data.getUint8(offset), offset + 1];
            },
            build: (val, data, offset) => {
                data.setUint8(offset, val);

                return offset + 1;
            },
            size: (_) => 1,
        } as BaseSchemaType<number>;
    }

    static number16() {
        return {
            type: SchemaTypes.number16,
            parse: (data, offset) => {
                return [data.getUint16(offset, false), offset + 2];
            },
            build: (val, data, offset) => {
                data.setUint16(offset, val, false);

                return offset + 2;
            },
            size: (_) => 2,
        } as BaseSchemaType<number>;
    }

    static number32() {
        return {
            type: SchemaTypes.number32,
            parse: (data, offset) => {
                return [data.getUint32(offset, false), offset + 4];
            },
            build: (val, data, offset) => {
                data.setUint32(offset, val, false);

                return offset + 4;
            },
            size: (_) => 4,
        } as BaseSchemaType<number>;
    }

    static number64() {
        return {
            type: SchemaTypes.number64,
            parse: (data, offset) => {
                const num = data.getBigUint64(offset, false);

                if (num > BigInt(Number.MAX_SAFE_INTEGER)) {
                    throw new Error("String too large for safe JS number");
                }

                return [Number(num), offset + 8];
            },
            build: (val, data, offset) => {
                data.setBigUint64(offset, BigInt(val), false);

                return offset + 8;
            },
            size: (_) => 8,
        } as BaseSchemaType<number>;
    }

    static string() {
        return {
            type: SchemaTypes.string,
            parse: (data, offset) => {
                const strLength = data.getBigUint64(offset, false);
                offset += 8;
                if (strLength > BigInt(Number.MAX_SAFE_INTEGER)) {
                    throw new Error("String too large for safe JS number");
                }
                const strClearLength = Number(strLength);

                const bytes = new Uint8Array(
                    data.buffer,
                    offset,
                    strClearLength,
                );

                const str = new TextDecoder("utf-8").decode(bytes);

                return [str, offset + strClearLength];
            },
            build: (val, view, offset) => {
                const encoder = new TextEncoder();
                const encoded = encoder.encode(val);

                view.setBigUint64(offset, BigInt(encoded.length), false);
                offset += 8;

                new Uint8Array(view.buffer, offset, encoded.length).set(
                    encoded,
                );

                return offset + encoded.length;
            },
            size: (value) => 8 + new TextEncoder().encode(value).length,
        } as BaseSchemaType<string>;
    }

    static boolean() {
        return {
            type: SchemaTypes.boolean,
            parse: (data, offset) => {
                return [data.getUint8(offset) > 0, offset + 1];
            },
            build: (val, data, offset) => {
                data.setUint8(offset, val ? 1 : 0);

                return offset + 1;
            },
        } as BaseSchemaType<boolean>;
    }

    static array<T extends SchemaDefinition>(schemaDefinition: T) {
        return {
            type: SchemaTypes.array,
            parse: (data, offset) => {
                const length = data.getUint32(offset, false);
                offset += 4;

                const result: InferSchema<T>[] = new Array(length);
                for (let i = 0; i < length; i++) {
                    const obj: Record<string, unknown> = {};

                    for (const [key, parser] of Object.entries(
                        schemaDefinition,
                    )) {
                        let value;
                        [value, offset] = parser.parse(data, offset);
                        obj[key] = value;
                    }

                    result[i] = obj as InferSchema<T>;
                }

                return [result, offset];
            },
            build: (values: any[], view, offset) => {
                view.setUint32(offset, values.length, false);
                offset += 4;

                for (const obj of values) {
                    for (const [key, parser] of Object.entries(
                        schemaDefinition,
                    )) {
                        offset = parser.build(obj[key], view, offset);
                    }
                }
                return offset;
            },
            size: (values) => {
                let total = 4;
                for (const v of values) {
                    for (const key of Object.keys(v)) {
                        total += schemaDefinition[key]!.size(v);
                    }
                }
                return total;
            },
        } as BaseSchemaType<Array<InferSchema<T>>>;
    }
}

export function parseData<T extends SchemaDefinition>(
    data: Buffer,
    schema: T,
): InferSchema<T> {
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    let offset = 0;
    const result: any = {};

    for (const key of Object.keys(schema)) {
        const [value, newOffset] = schema[key]!.parse(view, offset);
        result[key] = value;
        offset = newOffset;
    }

    return result;
}

export function buildData<T extends SchemaDefinition>(
    obj: InferSchema<T>,
    schema: T,
) {
    const size = preCalcSize(obj, schema);
    const buf = Buffer.alloc(size);
    const view = new DataView(
        buf.buffer,
        buf.byteOffset,
        buf.byteLength,
    );
    let offset = 0;

    for (const [key, fieldSchema] of Object.entries(schema)) {
        offset = fieldSchema.build(obj[key], view, offset);
    }

    return buf;
}

export function preCalcSize<T extends SchemaDefinition>(
    obj: InferSchema<T>,
    schema: T,
): number {
    let totalSize = 0;

    for (const [key, fieldSchema] of Object.entries(schema)) {
        totalSize += fieldSchema.size(obj[key]);
    }

    return totalSize;
}
