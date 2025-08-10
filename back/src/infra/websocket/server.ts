import { Logger } from "../../domain/logger";
import { WebsocketServerConfig } from "./config";
import { WebSocket, WebSocketEventMap } from "undici-types";

export interface WebsocketController {
    handler(data: Buffer): Buffer;
}

export class WebsocketServer {
    private readonly server: WebSocket;

    constructor(
        private readonly logger: Logger,
        private readonly config: WebsocketServerConfig,
        private readonly controller: WebsocketController,
    ) {
        this.server = new WebSocket(
            `ws://${this.config.Host}:${this.config.Port}`,
        );
        this.init();
    }

    public init() {
        this.server.addEventListener("error", this.handleError);
        this.server.addEventListener("open", this.handleOpen);
        this.server.addEventListener("message", this.handleMessage);
        this.server.addEventListener("close", this.handleClose);
    }

    private handleOpen(_event: WebSocketEventMap["open"]) {
        this.logger.info(
            `Connected to ${this.config.Host}:${this.config.Port}`,
        );
    }

    private handleMessage(event: WebSocketEventMap["message"]) {
        try {
            if (!(event.data instanceof Buffer)) {
                throw new Error("data is not valid");
            }

            const result = this.controller.handler(event.data);
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
