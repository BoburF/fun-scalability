import { InferSchema, SchemaBuilder } from "protocol";
import type { RequestHandler } from "../../../infra/request-controller";
import { ApiKeys } from "./api-keys";
import type { GetAllBoxesUsecase } from "../../usecases/box";

export const GetAllBoxesHandlerParamSchema = SchemaBuilder.schemaDefinition({
    skip: SchemaBuilder.number16(),
    limit: SchemaBuilder.number16(),
});
export type GetAllBoxesHandlerParamSchemaType = InferSchema<typeof GetAllBoxesHandlerParamSchema>;

export const GetAllBoxesHandlerResultSchema = SchemaBuilder.schemaDefinition({
    boxes: SchemaBuilder.array({
        index: SchemaBuilder.number32(),
        value: SchemaBuilder.string(),
    }),
});
export type GetAllBoxesHandlerResultSchemaType = InferSchema<typeof GetAllBoxesHandlerResultSchema>;

export class GetAllBoxesHandler implements RequestHandler<GetAllBoxesHandlerParamSchemaType, GetAllBoxesHandlerResultSchemaType> {
    public readonly apiKey = ApiKeys.GetAllBoxes;
    public readonly paramSchema = GetAllBoxesHandlerParamSchema;
    public readonly resultSchema = GetAllBoxesHandlerResultSchema;

    constructor(private readonly getAllBoxesUsecase: GetAllBoxesUsecase) {}

    public async handle(data: GetAllBoxesHandlerParamSchemaType): Promise<GetAllBoxesHandlerResultSchemaType> {
        const boxes = await this.getAllBoxesUsecase.execute(data);

        return {
            boxes,
        };
    }
}
