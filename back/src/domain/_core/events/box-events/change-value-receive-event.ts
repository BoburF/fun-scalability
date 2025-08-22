import { DomainEvent } from "../domain-event";

export const BoxChangeValueReceiveEvent = "BoxChangeValueReceiveEvent";

export type BoxChangeValueReceiveEventData = Buffer;

export class BoxChangeValueReceiveEventImpl implements DomainEvent<BoxChangeValueReceiveEventData> {
    public readonly event: string = BoxChangeValueReceiveEvent;

    constructor(public readonly data: BoxChangeValueReceiveEventData) {}
}
