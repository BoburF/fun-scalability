import { SchemaTypes } from "./schema-enums";

export type BaseSchemaType<T> = {
    type: SchemaTypes;
    parse(data: DataView, offset: number): [T, number];
    _type?: T;
};
