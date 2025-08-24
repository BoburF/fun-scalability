import { WebSocketServer } from "ws";
import type { Logger } from "../../domain/_core/logger";
import type { RequestController } from "../request-controller";
import { CustomError } from "../../domain/_core/error";
import { WebsocketServerErrorCodes } from "./error-codes";

export class WebsocketServerImpl {
    private server!: WebSocketServer;

    constructor(
        private readonly logger: Logger,
        private readonly controller: RequestController,
    ) {}

    public async init() {
        const config = this.validateConfig();
        this.server = new WebSocketServer({
            host: config.host,
            port: config.port,
        });

        this.logger.info(`Server started on ${config.host}:${config.port}`);

        this.server.on("connection", (socket) => {
            this.logger.info("New client connected");

            socket.on("message", async (data: Buffer) => {
                try {
                    const result = await this.controller.handler(data);
                    socket.send(result, { binary: true });
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

    // Should be tested. I don't want to test
    public broadcast(data: Buffer) {
        const clients = Array.from(this.server.clients);
        let i = 0;

        const loop = () => {
            const end = Math.min(i + 500, clients.length); // 500 per tick
            for (; i < end; i++) {
                const client = clients[i]!;
                if (client.readyState === client.OPEN) {
                    client.send(data, { binary: true });
                }
            }
            if (i < clients.length) setImmediate(loop);
        };

        loop();
    }

    private validateConfig() {
        if (process.env["HOST"] && process.env["PORT"]) {
            return {
                host: process.env["HOST"],
                port: Number(process.env["PORT"]),
            };
        }

        throw new CustomError(WebsocketServerErrorCodes.InvalidConfig, `HOST and PORT for wbesocket is invalid`);
    }
}
