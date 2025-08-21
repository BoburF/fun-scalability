import { Schema } from "mongoose";
import { BoxModel } from "../../../../domain/box";

export const BoxSchema = new Schema<BoxModel>({
    index: {
        type: Number,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
});
