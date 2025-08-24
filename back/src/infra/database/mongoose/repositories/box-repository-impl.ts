import type { Model } from "mongoose";
import { Box, type BoxModel, type BoxRepository } from "../../../../domain/box";
import type EventEmitter from "events";
import type { Cache } from "../../../cache";
import { buildData, InferSchema, parseData, SchemaBuilder } from "protocol";

export const BoxProtocolSchema = SchemaBuilder.schemaDefinition({
    index: SchemaBuilder.number32(),
    value: SchemaBuilder.string(),
});
export type BoxProtocolSchemaType = InferSchema<typeof BoxProtocolSchema>;

export class BoxRepositoryImpl implements BoxRepository {
    constructor(
        private readonly model: Model<BoxModel>,
        private readonly eventEmitter: EventEmitter,
        private readonly cache: Cache,
    ) {}

    async create(box: BoxModel): Promise<Box> {
        return new Box(await this.model.create(box));
    }

    async getByIndex(index: number): Promise<Box | null> {
        const data = await this.cache.get(index.toString());

        if (data) {
            return new Box(parseData(data, BoxProtocolSchema));
        }

        const box = await this.model.findOne({ index });

        if (box) {
            await this.cache.set(box.index.toString(), buildData(box, BoxProtocolSchema));
        }

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

        await this.cache.set(box.index.toString(), buildData(box.toPlain(), BoxProtocolSchema));

        const events = box.pullAll();

        events.forEach((event) => this.eventEmitter.emit(event.event, event.data));

        return box;
    }
}
