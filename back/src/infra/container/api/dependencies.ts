import { Container } from "inversify";
import { LoggerImpl } from "../../logger";
import { ApiDependenciySymbols } from "./symbols";
import {
    type RequestController,
    RequestControllerImpl,
    type RequestHandler,
    type RequestHandlers,
} from "../../request-controller";
import { WebsocketServerImpl } from "../../websocket/server";
import type { Logger } from "../../../domain/_core/logger";
import {
    BoxCollectionName,
    BoxRepositoryImpl,
    BoxSchema,
    MongooseDB,
} from "../../database/mongoose";

export const ApiContainer = new Container();

ApiContainer.bind(ApiDependenciySymbols.infra.logger).toDynamicValue(() => {
    return new LoggerImpl();
});

// databse
ApiContainer.bind(ApiDependenciySymbols.infra.database.db).toDynamicValue(
    (ctx) => {
        const logger = ctx.get<Logger>(ApiDependenciySymbols.infra.logger);

        return new MongooseDB(logger);
    },
);

ApiContainer.bind(
    ApiDependenciySymbols.infra.database.repositories.box,
).toDynamicValue((ctx) => {
    const db = ctx.get<MongooseDB>(ApiDependenciySymbols.infra.database.db);
    const model = db.connection.model(BoxCollectionName, BoxSchema);

    return new BoxRepositoryImpl(model);
});

ApiContainer.bind(ApiDependenciySymbols.infra.controller).toDynamicValue(
    (ctx) => {
        const handlers = ctx.getAll<RequestHandler>(
            ApiDependenciySymbols.infra.requestHandlers.all,
        );

        const handlersMap: RequestHandlers = {};
        handlers.map((reuestHandler) => {
            handlersMap[reuestHandler.apiKey] = reuestHandler;
        });

        return new RequestControllerImpl(handlersMap);
    },
);

// app deps for last binding
ApiContainer.bind(ApiDependenciySymbols.app.server).toDynamicValue((ctx) => {
    const logger = ctx.get<Logger>(ApiDependenciySymbols.infra.logger);
    const controller = ctx.get<RequestController>(
        ApiDependenciySymbols.infra.controller,
    );

    return new WebsocketServerImpl(logger, controller);
});
