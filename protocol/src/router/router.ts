import { SchemaTypes, SchemaValidate, SchemaValidator } from "../format";
import { RouteDefinitions } from "./route-definitions";

export class Router<T extends SchemaValidator<any>[]> {
    private headFormatValidator = [
        {
            name: "apiVersion",
            type: SchemaTypes.number32,
        },
        {
            name: "apiKey",
            type: SchemaTypes.number32,
        },
    ];

    constructor(private readonly routes: RouteDefinitions<T>) {}

    public handleRoutes(request: Buffer) {
        const head = SchemaValidate(request, this.headFormatValidator);

        const validatorSchema = this.routes.find(
            (route) => route.apiKey === (head["apiKey"] as unknown as number),
        );

        console.log("sssss", validatorSchema);
    }
}
