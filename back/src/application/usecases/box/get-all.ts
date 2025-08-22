import { BaseUsecase } from "../../../domain/_core/base-usecase";
import type { Box, BoxRepository } from "../../../domain/box";

export type GetAllBoxesParam = {
    skip: number;
    limit: number;
};

export type GetAllBoxesResult = Box[];

export class GetAllBoxesUsecase implements BaseUsecase<GetAllBoxesParam, GetAllBoxesResult> {
    constructor(private readonly boxRepository: BoxRepository) {}

    async execute(param: GetAllBoxesParam): Promise<GetAllBoxesResult> {
        return this.boxRepository.getAll(param.skip, param.limit);
    }
}
