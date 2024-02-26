import Access from "../models/access_model";
import User from "../models/user_model";
import { TCredentials } from "../types/credentials";
import { SECRET } from "../utils/config";
import { credentialsParser } from "../utils/parsers/credentials_parser";
import { stringParser } from "../utils/parsers/general_parsers";
import { wrapInPromise } from "../utils/wrap_in_promise";
import jwt from "jsonwebtoken";
import * as argon2 from "argon2";
import { TLoginUser } from "../types/user";

async function createAccess(remoteAddress: string) {
	console.log(remoteAddress);

	const attempts = new Access({
		attempts: 0,
		remoteAddress,
		access: true,
	});

	const { data: accessData, error: accessError } = await wrapInPromise(
		attempts.save()
	);

	if (!accessData || accessError) {
		throw new Error("Field to save attempt details " + accessError.message);
	}

	return accessData;
}

async function checkAttempt(remoteAddress: string | undefined) {
	const remoteAddressString = stringParser(remoteAddress);

	const { data: attemptArray, error: attemptArrayError } =
		await wrapInPromise(Access.find({}));

	if (!attemptArray || attemptArrayError) {
		throw new Error("Error while fetching attempts" + attemptArrayError);
	}

	const attempt = attemptArray.find(
		(at) => at.remoteAddress === remoteAddress
	);

	if (!attempt) {
		console.log("triggered");
		const { data, error } = await wrapInPromise(
			createAccess(remoteAddressString)
		);

		if (!data || error) {
			console.log("error", error);
			throw new Error("Filed to log attempts: " + error.message);
		}

		return data;
	} else {
		if (attempt.attempts > 3) {
			attempt.access = false;
			throw new Error("Block further attempts");
		}
		return attempt;
	}
}

export async function loginService(data: TCredentials, remoteAddress: string) {
	const { data: userClient, error: userClientError } = await wrapInPromise(
		credentialsParser(data)
	);

	if (!userClient || userClientError) {
		throw new Error(
			"Wrongly formatted credentials: " + userClientError.message
		);
	}

	const { data: attempt, error: attemptError } = await wrapInPromise(
		checkAttempt(remoteAddress)
	);

	if (!attempt || attemptError) {
		throw new Error("Failed to log attempts: " + attemptError.message);
	}

	const { data: userDB, error: userDBError } = await wrapInPromise(
		User.findOne({ username: userClient.username })
	);

	if (!userDB || userDBError) {
		attempt.attempts = attempt.attempts + 1;

		const { data, error } = await wrapInPromise(attempt.save());

		if (!data || error) {
			throw new Error("Failed saving new failed attempt: " + error);
		}

		throw new Error(
			`${attempt.attempts}: Cannot find user based on username: ` +
				userDBError
		);
	}

	const { data: password, error: passwordError } = await wrapInPromise(
		argon2.verify(userDB.password, userClient.password)
	);

	if (!password || passwordError) {
		attempt.attempts = attempt.attempts + 1;

		const { data, error } = await wrapInPromise(attempt.save());

		if (!data || error) {
			throw new Error(
				`${attempt.attempts}:Failed saving new failed attempt: ` + error
			);
		}

		throw new Error("Wrong password provided: " + userClient.password);
	}

	attempt.attempts = 0;
	attempt.access = false;
	const { error: successfulLoginError } = await wrapInPromise(attempt.save());

	if (successfulLoginError) {
		throw new Error(
			"Failed saving new failed attempt: " + successfulLoginError
		);
	}

	const token = jwt.sign(
		{
			username: userDB.username,
			id: userDB.id,
		},
		SECRET
	);
	const user: TLoginUser = {
		username: userDB.username,
		email: userDB.email,
		fullName: userDB.fullName,
		token,
		id: userDB.id,
	};

	return user;
}
