export const ApiDependenciySymbols = {
    app: {
        server: Symbol.for("server"),
    },
    infra: {
        logger: Symbol.for("logger"),
        config: {
            websocket: Symbol.for("websocket"),
        },
        requestHandlers: {
            1: Symbol.for("1"),
            all: Symbol.for("all"),
        },
        controller: Symbol.for("controller"),
        database: {
            db: Symbol.for("db"),
            repositories: {
                box: Symbol.for("box"),
            },
        },
    },
};
