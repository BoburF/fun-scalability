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

export class SchemBuilder {
    static schemaDefinition<T extends Record<string, BaseSchemaType<any>>>(
        schema: T,
    ): T {
        return schema;
    }

    static number8() {
        return {
            type: SchemaTypes.number8,
            parse: (data, offset) => {
                return [data.getUint8(offset), offset + 1];
            },
        } as BaseSchemaType<number>;
    }

    static number16() {
        return {
            type: SchemaTypes.number16,
            parse: (data, offset) => {
                return [data.getUint16(offset, false), offset + 2];
            },
        } as BaseSchemaType<number>;
    }

    static number32() {
        return {
            type: SchemaTypes.number32,
            parse: (data, offset) => {
                return [data.getUint32(offset, false), offset + 4];
            },
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
        } as BaseSchemaType<string>;
    }

    static boolean() {
        return {
            type: SchemaTypes.boolean,
            parse: (data, offset) => {
                return [data.getUint8(offset) > 0, offset + 1];
            },
        } as BaseSchemaType<boolean>;
    }

    static array<T extends Record<string, BaseSchemaType<any>>>(
        schemaDefinition: T,
    ) {
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
        } as BaseSchemaType<Array<InferSchema<T>>>;
    }
}

export function parseData<T extends Record<string, BaseSchemaType<any>>>(
    data: ArrayBuffer,
    schema: T,
): InferSchema<T> {
    const view = new DataView(data);
    let offset = 0;
    const result: any = {};

    for (const key of Object.keys(schema)) {
        const [value, newOffset] = schema[key]!.parse(view, offset);
        result[key] = value;
        offset = newOffset;
    }

    return result;
}
