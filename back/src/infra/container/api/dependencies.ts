import { Container } from "inversify";
import { LoggerImpl } from "../../logger";
import { ApiDependenciySymbols } from "./symbols";
import { type RequestController, RequestControllerImpl, type RequestHandler, type RequestHandlers } from "../../request-controller";
import { WebsocketServerImpl } from "../../websocket/server";
import type { Logger } from "../../../domain/_core/logger";
import type { BoxModel, BoxRepository } from "../../../domain/box";
import { MongooseDB, BoxCollectionName, BoxRepositoryImpl, BoxSchema } from "../../database/mongoose";
import { ChangeValueBoxeUsecase, GetAllBoxesUsecase } from "../../../application/usecases/box";
import { GetAllBoxesHandler } from "../../../application/api/handlers";
import { ChangeValueBoxeHandler } from "../../../application/api/handlers/change-value-box-handler";

export const ApiContainer = new Container();

ApiContainer.bind(ApiDependenciySymbols.infra.logger).toDynamicValue(() => {
    return new LoggerImpl();
});

// databse
ApiContainer.bind(ApiDependenciySymbols.infra.database.db).toDynamicValue((ctx) => {
    const logger = ctx.get<Logger>(ApiDependenciySymbols.infra.logger);

    return new MongooseDB(logger);
});

ApiContainer.bind(ApiDependenciySymbols.domain.box.repository).toDynamicValue((ctx) => {
    const db = ctx.get<MongooseDB>(ApiDependenciySymbols.infra.database.db);
    const model = db.connection.model<BoxModel>(BoxCollectionName, BoxSchema);

    return new BoxRepositoryImpl(model);
});

// usecases
ApiContainer.bind(ApiDependenciySymbols.app.usecases.box.getAll).toDynamicValue((ctx) => {
    const boxRepository = ctx.get<BoxRepository>(ApiDependenciySymbols.domain.box.repository);

    return new GetAllBoxesUsecase(boxRepository);
});

ApiContainer.bind(ApiDependenciySymbols.app.usecases.box.changeValue).toDynamicValue((ctx) => {
    const boxRepository = ctx.get<BoxRepository>(ApiDependenciySymbols.domain.box.repository);

    return new ChangeValueBoxeUsecase(boxRepository);
});

// request handlers
ApiContainer.bind(ApiDependenciySymbols.infra.requestHandlers.box.getAll).toDynamicValue((ctx) => {
    const getAllBoxesUsecase = ctx.get<GetAllBoxesUsecase>(ApiDependenciySymbols.app.usecases.box.getAll);

    return new GetAllBoxesHandler(getAllBoxesUsecase);
});
ApiContainer.bind(ApiDependenciySymbols.infra.requestHandlers.all).toService(ApiDependenciySymbols.infra.requestHandlers.box.getAll);

ApiContainer.bind(ApiDependenciySymbols.infra.requestHandlers.box.changeValue).toDynamicValue((ctx) => {
    const changeValueBoxeUsecase = ctx.get<ChangeValueBoxeUsecase>(ApiDependenciySymbols.app.usecases.box.changeValue);

    return new ChangeValueBoxeHandler(changeValueBoxeUsecase);
});
ApiContainer.bind(ApiDependenciySymbols.infra.requestHandlers.all).toService(ApiDependenciySymbols.infra.requestHandlers.box.changeValue);

ApiContainer.bind(ApiDependenciySymbols.infra.controller).toDynamicValue((ctx) => {
    const handlers = ctx.getAll<RequestHandler>(ApiDependenciySymbols.infra.requestHandlers.all);

    const handlersMap: RequestHandlers = {};
    handlers.map((reuestHandler) => {
        handlersMap[reuestHandler.apiKey] = reuestHandler;
    });

    return new RequestControllerImpl(handlersMap);
});

// app deps for last binding
ApiContainer.bind(ApiDependenciySymbols.app.server).toDynamicValue((ctx) => {
    const logger = ctx.get<Logger>(ApiDependenciySymbols.infra.logger);
    const controller = ctx.get<RequestController>(ApiDependenciySymbols.infra.controller);

    return new WebsocketServerImpl(logger, controller);
});
