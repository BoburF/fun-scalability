import { ApiContainer } from "../../infra/container/api/dependencies";
import { ApiDependenciySymbols } from "../../infra/container/api/symbols";
import type { WebsocketServerImpl } from "../../infra/websocket/server";

export async function bootstrap() {
    ApiContainer.load();

    const server = ApiContainer.get<WebsocketServerImpl>(
        ApiDependenciySymbols.app.server,
    );

    await server.init();
}
