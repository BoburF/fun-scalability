export interface BaseUsecase<Param, Result> {
    execute(param: Param): Promise<Result>;
}
