import type { Model } from "mongoose";
import { Box, type BoxModel, type BoxRepository } from "../../../../domain/box";
import type EventEmitter from "events";

export class BoxRepositoryImpl implements BoxRepository {
    constructor(
        private model: Model<BoxModel>,
        private eventEmitter: EventEmitter,
    ) {}

    async create(box: BoxModel): Promise<Box> {
        return new Box(await this.model.create(box));
    }

    async getByIndex(index: number): Promise<Box | null> {
        const box = await this.model.findOne({ index });

        return box ? new Box(box) : null;
    }

    async getAll(skip: number, limit: number): Promise<Box[]> {
        const boxes = await this.model.find({}, {}, { skip, limit });

        return boxes.map((box) => new Box(box));
    }

    async update(box: Box): Promise<Box> {
        await this.model.updateOne(
            {
                index: box.index,
            },
            {
                index: box.index,
                value: box.value,
            },
        );

        const events = box.pullAll();

        events.forEach((event) => this.eventEmitter.emit(event.event, event.data));

        return box;
    }
}
