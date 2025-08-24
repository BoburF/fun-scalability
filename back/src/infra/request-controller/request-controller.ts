import { buildData, parseData, SchemaBuilder, SchemaDefinition } from "protocol";
import { CustomError } from "../../domain/_core/error";

export interface RequestController {
    handler(data: Buffer): Promise<Buffer>;
}

export interface RequestHandler<Params = any, Result = any> {
    apiKey: number;
    paramSchema: SchemaDefinition;
    resultSchema: SchemaDefinition;
    handle(data: Params): Promise<Result>;
}

export interface RequestHandlers {
    [apiKey: number]: RequestHandler;
}

export class RequestControllerImpl implements RequestController {
    private headerSize = 2;
    constructor(private handlers: RequestHandlers) {}

    async handler(data: Buffer): Promise<Buffer> {
        try {
            const headDataSchema = SchemaBuilder.schemaDefinition({
                apiKey: SchemaBuilder.number16(),
            });

            const header = parseData(data, headDataSchema);

            const handler = this.handlers[header.apiKey];

            if (!handler) {
                throw new Error(`Handler for apiKey=${header.apiKey} is not found`);
            }

            const params = parseData(data.subarray(this.headerSize), handler.paramSchema);

            const result = await handler.handle(params);

            return buildData(result, handler.resultSchema);
        } catch (err) {
            const errorSchema = SchemaBuilder.schemaDefinition({
                errorCode: SchemaBuilder.number32(),
                data: SchemaBuilder.string(),
            });

            if (err instanceof CustomError) {
                return buildData(err.toJSON(), errorSchema);
            }

            return buildData({ errorCode: -100, data: `${err}` }, errorSchema);
        }
    }
}
