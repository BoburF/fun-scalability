export const ApiDependenciySymbols = {
    app: {
        server: Symbol.for("server"),
        eventHandler: {
            boxChangeValueBroadcast: Symbol.for("app.eventHandler.boxChangeValueBroadcast"),
            boxChangeValueReceive: Symbol.for("app.eventHandler.boxChangeValueReceive"),
            all: Symbol.for("app.eventHandler.all")
        },
        usecases: {
            box: {
                getAll: Symbol.for("box.getAll"),
                changeValue: Symbol.for("box.changeValue"),
            },
        },
    },
    domain: {
        box: {
            repository: Symbol.for("box.repository"),
        },
    },
    infra: {
        logger: Symbol.for("logger"),
        config: {
            websocket: Symbol.for("websocket"),
        },
        requestHandlers: {
            box: {
                getAll: Symbol.for("box.getAll.handler"),
                changeValue: Symbol.for("box.changeValue.handler"),
            },
            all: Symbol.for("all"),
        },
        controller: Symbol.for("controller"),
        database: {
            db: Symbol.for("db"),
        },
        eventEmitter: Symbol.for("eventEmitter"),
        broker: Symbol.for("broker"),
        events: {
            publisher: {
                boxChangeValue: Symbol.for("events.publisher.boxChangeValue"),
            },
        },
    },
};
