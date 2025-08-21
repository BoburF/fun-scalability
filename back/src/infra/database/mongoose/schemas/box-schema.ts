import { Schema } from "mongoose";
import { BoxModel } from "../../../../domain/box";

export const BoxCollectionName = "boxes";

export const BoxSchema = new Schema<BoxModel>(
    {
        index: {
            type: Number,
            required: true,
        },
        value: {
            type: String,
            required: true,
        },
    },
    {
        collection: BoxCollectionName,
    },
);
