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
        return { type: SchemaTypes.number8 } as BaseSchemaType<number>;
    }

    static number16() {
        return { type: SchemaTypes.number16 } as BaseSchemaType<number>;
    }

    static number32() {
        return { type: SchemaTypes.number32 } as BaseSchemaType<number>;
    }

    static number64() {
        return { type: SchemaTypes.number64 } as BaseSchemaType<number>;
    }

    static string() {
        return { type: SchemaTypes.string } as BaseSchemaType<string>;
    }

    static boolean() {
        return { type: SchemaTypes.boolean } as BaseSchemaType<boolean>;
    }

    static array<T extends Record<string, unknown>>(_: T) {
        return { type: SchemaTypes.array } as BaseSchemaType<Array<T>>;
    }
}
