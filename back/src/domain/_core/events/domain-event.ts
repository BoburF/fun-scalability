export interface DomainEvent<T = unknown> {
    readonly event: string;
    data: T;
}

export class BaseDomainEvent {
    private events: DomainEvent[] = [];

    public addEvent(event: DomainEvent) {
        this.events.push(event);
    }

    public pullAll() {
        const eventsCopy = [...this.events];
        this.events = [];
        return eventsCopy;
    }
}
