import { Box } from "./box";

export interface BoxRepository {
    create(box: Box): Promise<Box>;
    getByIndex(index: number): Promise<Box | null>;
    getAll(skip: number, limit: number): Promise<Box[]>;
    update(box: Box): Promise<Box>;
}
