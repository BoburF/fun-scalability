export const ApiDependenciySymbols = {
    app: {
        server: Symbol.for("server"),
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
    },
};
