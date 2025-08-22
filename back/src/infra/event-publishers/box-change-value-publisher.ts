import { BoxChangeValueBroadcastEvent, BoxChangeValueBroadcastEventData, Publisher } from "../../domain/_core/events";
import { buildData, InferSchema, SchemaBuilder } from "protocol";
import { Broker } from "../broker";

export const BoxChangeValueEventHandlerDataSchema = SchemaBuilder.schemaDefinition({
    index: SchemaBuilder.number32(),
    value: SchemaBuilder.string(),
});
export type BoxChangeValueEventHandlerDataSchemaType = InferSchema<typeof BoxChangeValueEventHandlerDataSchema>;

export class BoxChangeValuePublisher implements Publisher<BoxChangeValueBroadcastEventData> {
    public readonly event: string = BoxChangeValueBroadcastEvent;

    constructor(private broker: Broker) {}

    async publish(data: BoxChangeValueBroadcastEventData): Promise<void> {
        const builtData = buildData(data, BoxChangeValueEventHandlerDataSchema);

        this.broker.publish(this.event, builtData);
    }
}
