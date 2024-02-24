import http from "http";
import { wrapInPromise } from "../utils/wrap_in_promise";
import { loginService, newUserService } from "../service/user_service";

export async function postNewUser(
	request: http.IncomingMessage,
	response: http.ServerResponse
) {
	let body = "";

	request.on("data", (chunk) => {
		body += chunk.toString();
	});

	request.on("end", async () => {
		const parsedBody = JSON.parse(body);

		const { data, error } = await wrapInPromise(newUserService(parsedBody));

		if (!data || error) {
			response.writeHead(400, { "Content-Type": "application/json" });
			response.end(JSON.stringify({ error: error.message }));
		}

		response.writeHead(201, { "Content-Type": "application/json" });
		response.end(JSON.stringify(data));
	});
}

export async function userLogin(
	request: http.IncomingMessage,
	response: http.ServerResponse
) {
	let body = "";

	request.on("data", (chunk) => {
		body += chunk.toString();
	});

	request.on("end", async () => {
		const parsedBody = JSON.parse(body);

		const { data, error } = await wrapInPromise(loginService(parsedBody));

		if (!data || error) {
			response.writeHead(400, { "Content-Type": "application/json" });
			response.end(JSON.stringify({ error: error.message }));
		}

		response.writeHead(200, { "Content-Type": "application/json" });
		response.end(JSON.stringify(data));
	});
}
