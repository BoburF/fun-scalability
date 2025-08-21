import { WebSocketServer } from "ws";
import type { Logger } from "../../domain/_core/logger";
import type { WebsocketServerConfig } from "./config";
import type { RequestController } from "../request-controller";

export class WebsocketServerImpl {
    private server!: WebSocketServer;

    constructor(
        private readonly logger: Logger,
        private readonly config: WebsocketServerConfig,
        private readonly controller: RequestController,
    ) {}

    public async init() {
        this.server = new WebSocketServer({
            host: this.config.host,
            port: this.config.port,
        });

        this.logger.info(
            `Server started on ${this.config.host}:${this.config.port}`,
        );

        this.server.on("connection", (socket) => {
            this.logger.info("New client connected");

            socket.on("message", async (data: Buffer) => {
                try {
                    const result = await this.controller.handler(data);
                    socket.send(result);
                } catch (error) {
                    this.logger.error("WebsocketServer", error);
                }
            });

            socket.on("close", (code) => {
                this.logger.warn(`Connection closed: code=${code}`);
            });

            socket.on("error", (err) => {
                this.logger.error("WebsocketServer", err);
            });
        });
    }
}
