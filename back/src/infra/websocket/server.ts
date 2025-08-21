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

    private validateConfig() {
        if (process.env["HOST"] && process.env["PORT"]) {
            return {
                host: process.env["HOST"],
                port: Number(process.env["PORT"]),
            };
        }

        throw new CustomError(
            WebsocketServerErrorCodes.InvalidConfig,
            `HOST and PORT for wbesocket is invalid`,
        );
    }
}
