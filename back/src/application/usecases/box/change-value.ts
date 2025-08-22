import { BaseUsecase } from "../../../domain/_core/base-usecase";
import { Box, type BoxRepository } from "../../../domain/box";

export type ChangeValueBoxeParam = {
    index: number;
    value: string;
};

export type ChangeValueBoxeResult = Box;

export class ChangeValueBoxeUsecase implements BaseUsecase<ChangeValueBoxeParam, ChangeValueBoxeResult> {
    constructor(private readonly boxRepository: BoxRepository) {}

    async execute(param: ChangeValueBoxeParam): Promise<ChangeValueBoxeResult> {
        const box = await this.boxRepository.getByIndex(param.index);

        if (box) {
            box.value = param.value;
            return this.boxRepository.update(box);
        }

        return this.boxRepository.create(new Box(param));
    }
}
