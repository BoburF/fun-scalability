import { BoxChangeValueBroadcastEvent, BoxChangeValueBroadcastEventData, DomainEventHandler, Publisher } from "../../../domain/_core/events";

export class BoxChangeValueBroadcastEventHandler implements DomainEventHandler<BoxChangeValueBroadcastEventData> {
    public readonly event: string = BoxChangeValueBroadcastEvent;

    constructor(private publisher: Publisher<BoxChangeValueBroadcastEventData>) {}

    async handler(data: BoxChangeValueBroadcastEventData): Promise<void> {
        await this.publisher.publish(data);
    }
}
