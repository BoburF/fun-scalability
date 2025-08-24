import { BaseUsecase } from "../../../domain/_core/base-usecase";
import { CustomError } from "../../../domain/_core/error";
import { Box, BoxErrorCodes, type BoxRepository } from "../../../domain/box";

export type ChangeValueBoxeParam = {
    index: number;
    value: string;
};

export type ChangeValueBoxeResult = Box;

export class ChangeValueBoxeUsecase implements BaseUsecase<ChangeValueBoxeParam, ChangeValueBoxeResult> {
    constructor(private readonly boxRepository: BoxRepository) {}

    async execute(param: ChangeValueBoxeParam): Promise<ChangeValueBoxeResult> {
        const box = await this.boxRepository.getByIndex(param.index);

        if (!box) {
            throw new CustomError(BoxErrorCodes.NotFound, `Box with ${param.index} was not found`);
        }

        if (box.value === param.value) {
            return box;
        }

        box.value = param.value;
        return this.boxRepository.update(box);
    }
}
