export const ApiDependenciySymbols = {
    app: {
        server: Symbol.for("server"),
        usecases: {
            box: {
                getAll: Symbol.for("box.getAll"),
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
            },
            all: Symbol.for("all"),
        },
        controller: Symbol.for("controller"),
        database: {
            db: Symbol.for("db"),
        },
    },
};
