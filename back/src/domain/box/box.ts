import { CustomError } from "../_core/error";
import { BoxErrorCodes } from "./error-codes";

export interface BoxModel {
    index: number;
    value: string;
}

export class Box {
    constructor(private data: BoxModel) {}

    get index() {
        return this.data.index;
    }

    set index(index: number) {
        if (this.isWithinRange(index)) {
            this.data.index = index;
        }

        throw new CustomError(
            BoxErrorCodes.InvalidIndex,
            `${index} is out of range`,
        );
    }

    get value() {
        return this.data.value;
    }

    set value(value: string) {
        if (this.isValidValue(value)) {
            this.data.value = value;
        }

        throw new CustomError(
            BoxErrorCodes.InvalidValue,
            `${value} is invalid`,
        );
    }

    public isWithinRange(index: number) {
        return index < 1_000_000;
    }

    public isValidValue(value: string) {
        return value.length === 1;
    }
}
