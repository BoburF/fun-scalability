import { Container } from "inversify";
import { LoggerImpl } from "../../logger";
import { ApiDependenciySymbols } from "./symbols";
import { type RequestController, RequestControllerImpl, type RequestHandler, type RequestHandlers } from "../../request-controller";
import { WebsocketServerImpl } from "../../websocket/server";
import type { Logger } from "../../../domain/_core/logger";
import type { BoxModel, BoxRepository } from "../../../domain/box";
import { MongooseDB, BoxCollectionName, BoxRepositoryImpl, BoxSchema } from "../../database/mongoose";
import { ChangeValueBoxeUsecase, GetAllBoxesUsecase } from "../../../application/usecases/box";
import { ChangeValueBoxeHandler, GetAllBoxesHandler } from "../../../application/api/handlers";
import EventEmitter from "events";
import { Broker, RedisBroker } from "../../broker";
import { BoxChangeValuePublisher } from "../../event-publishers";
import { BoxChangeValueBroadcastEventHandler } from "../../../application/api/event-emit-handlers/box-change-value-broadcast-handler";
import { BoxChangeValueReceiveEventHandler } from "../../../application/api/event-emit-handlers/box-change-value-receive-handler";

export const ApiContainer = new Container({ defaultScope: "Singleton" });

ApiContainer.bind(ApiDependenciySymbols.infra.logger).toDynamicValue(() => {
    return new LoggerImpl();
});

ApiContainer.bind(ApiDependenciySymbols.infra.eventEmitter).toConstantValue(new EventEmitter());

// databse
ApiContainer.bind(ApiDependenciySymbols.infra.database.db).toDynamicValue((ctx) => {
    const logger = ctx.get<Logger>(ApiDependenciySymbols.infra.logger);

    return new MongooseDB(logger);
});

ApiContainer.bind(ApiDependenciySymbols.domain.box.repository).toDynamicValue((ctx) => {
    const db = ctx.get<MongooseDB>(ApiDependenciySymbols.infra.database.db);
    const model = db.connection.model<BoxModel>(BoxCollectionName, BoxSchema);
    const eventEmitter = ctx.get<EventEmitter>(ApiDependenciySymbols.infra.eventEmitter);

    return new BoxRepositoryImpl(model, eventEmitter);
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

// broker
ApiContainer.bind(ApiDependenciySymbols.infra.broker).toDynamicValue((ctx) => {
    const logger = ctx.get<Logger>(ApiDependenciySymbols.infra.logger);

    return new RedisBroker(logger);
});

ApiContainer.bind(ApiDependenciySymbols.infra.events.publisher.boxChangeValue).toDynamicValue((ctx) => {
    const broker = ctx.get<Broker>(ApiDependenciySymbols.infra.broker);

    return new BoxChangeValuePublisher(broker);
});

// events
ApiContainer.bind(ApiDependenciySymbols.app.eventHandler.boxChangeValueBroadcast).toDynamicValue((ctx) => {
    const eventEmitter = ctx.get<EventEmitter>(ApiDependenciySymbols.infra.eventEmitter);
    const publisher = ctx.get<BoxChangeValuePublisher>(ApiDependenciySymbols.infra.events.publisher.boxChangeValue);

    const handler = new BoxChangeValueBroadcastEventHandler(publisher);

    eventEmitter.on(handler.event, (data) => handler.handler(data));

    return handler;
});
ApiContainer.bind(ApiDependenciySymbols.app.eventHandler.all).toService(ApiDependenciySymbols.app.eventHandler.boxChangeValueBroadcast);

ApiContainer.bind(ApiDependenciySymbols.app.eventHandler.boxChangeValueReceive).toDynamicValue((ctx) => {
    const broker = ctx.get<Broker>(ApiDependenciySymbols.infra.broker);

    const websocketServer = ctx.get<WebsocketServerImpl>(ApiDependenciySymbols.app.server);
    const changeValueUsecase = ctx.get<ChangeValueBoxeUsecase>(ApiDependenciySymbols.app.usecases.box.changeValue);

    const handler = new BoxChangeValueReceiveEventHandler(websocketServer, changeValueUsecase);

    broker.subscribe(handler.event, (data) => handler.handler(data));

    return handler;
});
ApiContainer.bind(ApiDependenciySymbols.app.eventHandler.all).toService(ApiDependenciySymbols.app.eventHandler.boxChangeValueReceive);
