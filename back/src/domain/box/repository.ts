import type { Box, BoxModel } from "./box";

export interface BoxRepository {
    create(box: BoxModel): Promise<Box>;
    getByIndex(index: number): Promise<Box | null>;
    getAll(skip: number, limit: number): Promise<Box[]>;
    update(box: Box): Promise<Box>;
}
