import http from "http";
import { stringParser } from "./utils/parsers/general_parsers";
import { getUser, postNewUser } from "./controller/user_controller";

const app = http.createServer((request, response) => {
	const url = stringParser(request.url);

	if (url === "/api/users" && request.method === "GET") {
		response.writeHead(200, { "Content-Type": "application/json" });
		// response.end(JSON.stringify());
	} else if (url.match(/\/api\/users\/([0-9]+)/)) {
		const id = stringParser(url.split("/")[3]);
		getUser(request, response, id);
	} else if (url === "/api/users" && request.method === "POST") {
		postNewUser(request, response);
	} else {
		response.writeHead(404, { "Content-Type": "application/json" });
		response.end(JSON.stringify({ error: "Unknown endpoint" }));
	}
});

export default app;
