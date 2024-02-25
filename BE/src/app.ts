import http from "http";
import { stringParser } from "./utils/parsers/general_parsers";
import { createHandler } from "graphql-http/lib/use/http";
import user from "./schemas/user_schema";

const app = http.createServer((request, response) => {
	const url = stringParser(request.url);
	if (url === "/graphql") {
		const handler = createHandler({
			schema: user,
			context: { request, response },
		});
		handler(request, response);
	} else {
		response.writeHead(404, { "Content-Type": "application/json" });
		response.end(JSON.stringify({ error: "Unknown endpoint" }));
	}
});

export default app;
