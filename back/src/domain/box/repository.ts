import { Box } from "./box";

export interface BoxRepository {
    create(box: Box): Promise<Box>;
    getByIndex(index: number): Promise<Box | null>;
}
