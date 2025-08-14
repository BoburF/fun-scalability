import { FormatBuilder } from "../format";
import { RouteDefinitions, Router } from "../router";

const routes: RouteDefinitions<any> = [
    {
        apiKey: 2,
        validator: [{}],
        handler(_params) {
            return "";
        },
    },
];

const routeHandler = new Router(routes);

const request = new FormatBuilder(1, 2);

routeHandler.handleRoutes(request.build());
