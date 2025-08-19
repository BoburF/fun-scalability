import { ApiContainer } from "../../infra/container/api/dependencies";
import { ApiDependenciySymbols } from "../../infra/container/api/symbols";
import type { WebsocketServer } from "../../infra/websocket/server";

async function bootstrap() {
    ApiContainer.load();

    const server = ApiContainer.get<WebsocketServer>(
        ApiDependenciySymbols.app.server,
    );

    server.init();
}

bootstrap();
