import { Connection } from "mongoose";
import type { DB } from "../db";
import { CustomError } from "../../../domain/_core/error";
import { DBErrorCodes } from "../error-codes";
import { Logger } from "../../../domain/_core/logger";

export class MongooseDB implements DB<Connection> {
    public readonly connection: Connection;

    constructor(private readonly logger: Logger) {
        this.connection = new Connection();
    }

    async connect(): Promise<void> {
        await this.connection.openUri(this.validateUri());
        this.logger.info("Database running...");
    }

    async disconnect(): Promise<void> {
        await this.connection.close();
    }

    private validateUri() {
        if (process.env["DB_URI"]) {
            return process.env["DB_URI"];
        }

        throw new CustomError(DBErrorCodes.InvalidUri, `DB_URI is invalid`);
    }
}
