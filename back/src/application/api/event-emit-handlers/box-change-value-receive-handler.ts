import { parseData, SchemaBuilder } from "protocol";
import { BoxChangeValueReceiveEvent, BoxChangeValueReceiveEventData, DomainEventHandler } from "../../../domain/_core/events";
import type { WebsocketServerImpl } from "../../../infra/websocket/server";
import { ChangeValueBoxeUsecase } from "../../usecases/box";

export const ChangeValueParamSchema = SchemaBuilder.schemaDefinition({
    index: SchemaBuilder.number32(),
    value: SchemaBuilder.string(),
});

export class BoxChangeValueReceiveEventHandler implements DomainEventHandler<BoxChangeValueReceiveEventData> {
    public readonly event: string = BoxChangeValueReceiveEvent;

    constructor(
        private readonly wbesocketServer: WebsocketServerImpl,
        private readonly changeValueUsecase: ChangeValueBoxeUsecase,
    ) {}

    async handler(data: BoxChangeValueReceiveEventData): Promise<void> {
        await this.changeValueUsecase.execute(parseData(data, ChangeValueParamSchema));
        this.wbesocketServer.broadcast(data);
    }
}
