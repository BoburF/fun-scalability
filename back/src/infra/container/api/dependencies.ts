import { Container } from "inversify";
import { LoggerImpl } from "../../logger";
import { ApiDependenciySymbols } from "./symbols";
import {
    RequestControllerImpl,
    type RequestHandler,
    type RequestHandlers,
} from "../../request-controller";
import { WebsocketConfigImpl } from "../../config";
import { WebsocketServer } from "../../websocket/server";

export const ApiContainer = new Container();

ApiContainer.bind(ApiDependenciySymbols.infra.logger).to(LoggerImpl);

// configs
ApiContainer.bind(ApiDependenciySymbols.infra.config.websocket).to(
    WebsocketConfigImpl,
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
ApiContainer.bind(ApiDependenciySymbols.app.server).to(WebsocketServer);
