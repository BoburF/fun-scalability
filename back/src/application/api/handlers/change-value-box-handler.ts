import { InferSchema, SchemaBuilder } from "protocol";
import type { RequestHandler } from "../../../infra/request-controller";
import { ApiKeys } from "./api-keys";
import type { ChangeValueBoxeUsecase } from "../../usecases/box";

export const ChangeValueBoxeHandlerParamSchema = SchemaBuilder.schemaDefinition({
    index: SchemaBuilder.number32(),
    value: SchemaBuilder.string(),
});
export type ChangeValueBoxeHandlerParamSchemaType = InferSchema<typeof ChangeValueBoxeHandlerParamSchema>;

export const ChangeValueBoxeHandlerResultSchema = SchemaBuilder.schemaDefinition({
    index: SchemaBuilder.number32(),
    value: SchemaBuilder.string(),
});
export type ChangeValueBoxeHandlerResultSchemaType = InferSchema<typeof ChangeValueBoxeHandlerResultSchema>;

export class ChangeValueBoxeHandler implements RequestHandler<ChangeValueBoxeHandlerParamSchemaType, ChangeValueBoxeHandlerResultSchemaType> {
    public readonly apiKey = ApiKeys.ChangeValue;
    public readonly paramSchema = ChangeValueBoxeHandlerParamSchema;
    public readonly resultSchema = ChangeValueBoxeHandlerResultSchema;

    constructor(private readonly ChangeValueBoxeUsecase: ChangeValueBoxeUsecase) {}

    public async handle(data: ChangeValueBoxeHandlerParamSchemaType): Promise<ChangeValueBoxeHandlerResultSchemaType> {
        const box = await this.ChangeValueBoxeUsecase.execute(data);

        // presenter
        return box.toPlain();
    }
}
