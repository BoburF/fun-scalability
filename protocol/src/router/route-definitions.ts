import { InferSchemaType, SchemaValidator } from "../format/schema-validator";

export type RouteDefinition<V extends SchemaValidator<any>> = {
    apiKey: number;
    validator: V;
    handler(params: InferSchemaType<V>): Promise<unknown> | unknown;
};

export type RouteDefinitions<T extends SchemaValidator<any>[]> =
    RouteDefinition<T[number]>[];
