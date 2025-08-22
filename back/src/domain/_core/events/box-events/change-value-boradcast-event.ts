import { DomainEvent } from "../domain-event";

export const BoxChangeValueBroadcastEvent = "BoxChangeValueBroadcastEvent";

export type BoxChangeValueBroadcastEventData = {
    index: number;
    value: string;
};

export class BoxChangeValueBroadcastEventImpl implements DomainEvent<BoxChangeValueBroadcastEventData> {
    public readonly event: string = BoxChangeValueBroadcastEvent;

    constructor(public readonly data: BoxChangeValueBroadcastEventData) {}
}
