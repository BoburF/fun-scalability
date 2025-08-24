import type { SchemaTypes } from "./schema-enums.js";

export type BaseSchemaType<T> = {
    type: SchemaTypes;
    parse(data: DataView, offset: number): [T, number];
    build(val: T, data: DataView, offset: number): number;
    size(value: T): number;
    _type?: T;
};
