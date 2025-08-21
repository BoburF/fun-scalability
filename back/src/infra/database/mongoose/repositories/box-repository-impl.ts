import { Model } from "mongoose";
import { Box, BoxModel, BoxRepository } from "../../../../domain/box";

export const BoxCollectionName = "boxes";

export class BoxRepositoryImpl implements BoxRepository {
    constructor(private model: Model<BoxModel>) {}

    async create(box: Box): Promise<Box> {
        return new Box(await this.model.create(box));
    }

    async getByIndex(index: number): Promise<Box | null> {
        const box = await this.model.findOne({ index });

        return box ? new Box(box) : null;
    }
}
