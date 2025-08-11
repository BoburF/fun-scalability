import { SchemaValidator } from "../format";
import { RouteDefinitions } from "./route-definitions";

export class Router<T extends SchemaValidator<any>[]> {
    constructor(private readonly routes: RouteDefinitions<T>) {}

    public handleRoutes(reqeust: Buffer) {

    }
}
