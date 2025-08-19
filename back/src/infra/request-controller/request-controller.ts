import {
    buildData,
    parseData,
    SchemaBuilder,
    SchemaDefinition,
} from "protocol";

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
        const headDataSchema = SchemaBuilder.schemaDefinition({
            apiKey: SchemaBuilder.number16(),
        });

        const headerBuffer = data.buffer.slice(
            0,
            this.headerSize,
        ) as ArrayBuffer;

        const header = parseData(headerBuffer, headDataSchema);

        const handler = this.handlers[header.apiKey];

        if (!handler) {
            throw new Error(`Handler for apiKey=${header.apiKey} is not found`);
        }

        const paramsBuffer = data.buffer.slice(
            this.headerSize,
            this.headerSize + data.byteLength,
        ) as ArrayBuffer;

        const params = parseData(paramsBuffer, handler.paramSchema);

        const result = handler.handle(params);

        return new Buffer(buildData(result, handler.resultSchema));
    }
}
