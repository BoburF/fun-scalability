import type { WebsocketServerConfig } from "../websocket/config";

export class WebsocketConfigImpl implements WebsocketServerConfig {
    public readonly host: string;
    public readonly port: number;

    constructor(host = "localhost", port = 4545) {
        this.host = host;
        this.port = port;
    }
}
