import http from "http";
import { wrapInPromise } from "../utils/wrap_in_promise";
import User from "../models/user_model";
import { newUserParser } from "../utils/parsers/user_parser";
import * as argon2 from "argon2";

export async function getUser(
	_request: http.IncomingMessage,
	response: http.ServerResponse,
	id: string
) {
	const { data, error } = await wrapInPromise(User.findById(id));

	if (!data || error) {
		response.writeHead(400, { "Content-Type": "application/json" });
		response.end(JSON.stringify({ error: error.message }));
	}
	response.writeHead(200, { "Content-Type": "application/json" });
	response.end(JSON.stringify(data));
}

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

		const { data: newUserData, error: newUserDataError } =
			await wrapInPromise(newUserParser(parsedBody));

		if (!newUserData || newUserDataError) {
			throw new Error(
				"Error while parsing new user data: " + newUserDataError.message
			);
		}

		if (newUserData.username.length < 3) {
			throw new Error(
				"Provided username is under 3 characters, please provide longer username!"
			);
		}

		if (newUserData.password.length < 3) {
			throw new Error(
				"Provided password is under 3 characters, please provide longer password!"
			);
		}

		const { data: allUsers, error: allUsersError } = await wrapInPromise(
			User.find({})
		);

		if (!allUsers || allUsersError) {
			throw new Error(
				"Error while fetching all users from database " +
					allUsersError.message
			);
		}

		const usernameExists = allUsers.find(
			(user) => user.username === newUserData.username
		);

		if (usernameExists) {
			throw new Error(
				"Provided username already exist in database: " +
					newUserData.username
			);
		}

		const { data: hash, error: hashError } = await wrapInPromise(
			argon2.hash(newUserData.password)
		);

		if (!hash || hashError) {
			throw new Error(
				" Error while hashing password: " + hashError.message
			);
		}

		const newUser = new User({
			username: newUserData.username,
			password: hash,
		});

		const { data: savedNewUser, error: savedNewUserError } =
			await wrapInPromise(newUser.save());

		if (!savedNewUser || savedNewUserError) {
			throw new Error(
				"Error while saving new user to database: " + savedNewUserError
			);
		}

		response.writeHead(201, { "Content-Type": "application/json" });
		response.end(JSON.stringify(savedNewUser));
	});
}
