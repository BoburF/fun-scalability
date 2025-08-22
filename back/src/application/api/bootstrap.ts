import { ApiContainer } from "../../infra/container/api/dependencies";
import { ApiDependenciySymbols } from "../../infra/container/api/symbols";
import type { DB } from "../../infra/database";
import type { WebsocketServerImpl } from "../../infra/websocket/server";
import type { Broker } from "../../infra/broker";

export async function bootstrap() {
    ApiContainer.load();

    const db = ApiContainer.get<DB>(ApiDependenciySymbols.infra.database.db);

    await db.connect();

    const server = ApiContainer.get<WebsocketServerImpl>(ApiDependenciySymbols.app.server);

    await server.init();

    const broker = ApiContainer.get<Broker>(ApiDependenciySymbols.infra.broker);

    await broker.init();

    // initializing
    ApiContainer.getAll(ApiDependenciySymbols.app.eventHandler.all);
}
