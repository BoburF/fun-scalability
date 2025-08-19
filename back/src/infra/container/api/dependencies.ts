import { Container } from "inversify";
import { LoggerImpl } from "../../logger";
import { ApiDependenciySymbols } from "./symbols";
import {
    type RequestController,
    RequestControllerImpl,
    type RequestHandler,
    type RequestHandlers,
} from "../../request-controller";
import { WebsocketConfigImpl } from "../../config";
import { WebsocketServerImpl } from "../../websocket/server";
import type { Logger } from "../../../domain/logger";
import type { WebsocketServerConfig } from "../../websocket/config";

export const ApiContainer = new Container();

ApiContainer.bind(ApiDependenciySymbols.infra.logger).toDynamicValue(() => {
    return new LoggerImpl();
});

// configs
ApiContainer.bind(ApiDependenciySymbols.infra.config.websocket).toDynamicValue(
    () => {
        return new WebsocketConfigImpl();
    },
);

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
    const config = ctx.get<WebsocketServerConfig>(
        ApiDependenciySymbols.infra.config.websocket,
    );
    const controller = ctx.get<RequestController>(
        ApiDependenciySymbols.infra.controller,
    );

    return new WebsocketServerImpl(logger, config, controller);
});
