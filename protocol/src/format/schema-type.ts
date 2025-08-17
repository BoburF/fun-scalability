import { SchemaTypes } from "./schema-enums";

export type BaseSchemaType<T> = {
    type: SchemaTypes;
    _type?: T;
};
