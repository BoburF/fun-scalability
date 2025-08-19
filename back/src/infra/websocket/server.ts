import type { Logger } from "../../domain/logger";
import type { WebsocketServerConfig } from "./config";
import { WebSocket, type WebSocketEventMap } from "undici-types";
import type { RequestController } from "../request-controller";

export class WebsocketServer {
    private server!: WebSocket;

    constructor(
        private readonly logger: Logger,
        private readonly config: WebsocketServerConfig,
        private readonly controller: RequestController,
    ) {}

    public init() {
        this.server = new WebSocket(
            `ws://${this.config.host}:${this.config.port}`,
        );
        this.logger.info(
            `Server started on ${this.config.host}:${this.config.port}`,
        );
        this.server.addEventListener("error", this.handleError);
        this.server.addEventListener("open", this.handleOpen);
        this.server.addEventListener("message", this.handleMessage);
        this.server.addEventListener("close", this.handleClose);
    }

    private handleOpen(_event: WebSocketEventMap["open"]) {
        this.logger.info(
            `Connected to ${this.config.host}:${this.config.port}`,
        );
    }

    private async handleMessage(event: WebSocketEventMap["message"]) {
        try {
            if (!(event.data instanceof Buffer)) {
                throw new Error("data is not valid");
            }

            const result = await this.controller.handler(event.data);

            this.server.send(result);
        } catch (error) {
            this.logger.error("WebsocketServer", error);
        }
    }

    private handleClose(event: WebSocketEventMap["close"]) {
        this.logger.warn(`Connection closed: code=${event.code}`);
    }

    private handleError(error: WebSocketEventMap["error"]) {
        this.logger.error("WebsocketServer", error.error);
    }
}
