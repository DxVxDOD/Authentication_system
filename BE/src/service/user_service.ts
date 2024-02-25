import User from "../models/user_model";
import { TLoginUser, TUser } from "../types/user";
import { SECRET } from "../utils/config";
import { userParser } from "../utils/parsers/user_parser";
import { wrapInPromise } from "../utils/wrap_in_promise";
import jwt from "jsonwebtoken";
import * as argon2 from "argon2";
import { credentialsParser } from "../utils/parsers/credentials_parser";
import { TCredentials } from "../types/credentials";
import Access from "../models/access_model";
import { stringParser } from "../utils/parsers/general_parsers";

export async function newUserService(data: Partial<TUser>) {
	const { data: newUserData, error: newUserDataError } = await wrapInPromise(
		userParser(data)
	);

	if (!newUserData || newUserDataError) {
		throw new Error(
			"Error while parsing new user data: " + newUserDataError.message
		);
	}

	if (newUserData.username.length < 3) {
		throw new Error(
			"Provided username is under 3 characters, please provide longer username!",
			{ cause: newUserData.username }
		);
	}

	if (newUserData.password.length < 3) {
		throw new Error(
			"Provided password is under 3 characters, please provide longer password!",
			{ cause: newUserData.password }
		);
	}

	const { data: allUsers, error: allUsersError } = await wrapInPromise(
		User.find({})
	);

	if (!allUsers || allUsersError) {
		throw new Error(
			"Error while fetching all users from database " + allUsersError
		);
	}

	const usernameExists = allUsers.find(
		(user) => user.username === newUserData.username
	);

	if (usernameExists) {
		throw new Error(
			"Provided username already exist in database: " +
				newUserData.username,
			{ cause: newUserData.username }
		);
	}

	const emailExists = allUsers.find(
		(user) => user.email === newUserData.email
	);

	if (emailExists) {
		throw new Error(
			"Provided email already exist in database: " + newUserData.email,

			{ cause: newUserData.email }
		);
	}

	const { data: hash, error: hashError } = await wrapInPromise(
		argon2.hash(newUserData.password)
	);

	if (!hash || hashError) {
		throw new Error(" Error while hashing password: " + hashError.message);
	}

	const newUser = new User({
		username: newUserData.username,
		password: hash,
		email: newUserData.email,
		fullName: newUserData.fullName,
	});

	const { data: savedNewUser, error: savedNewUserError } =
		await wrapInPromise(newUser.save());

	if (!savedNewUser || savedNewUserError) {
		throw new Error(
			"Error while saving new user to database: " +
				savedNewUserError.message,
			{ cause: newUser }
		);
	}

	const { data: loggedUser, error: loggedUserError } = await wrapInPromise(
		loginService({
			username: savedNewUser.username,
			password: newUserData.password,
		})
	);

	if (!loggedUser || loggedUserError) {
		throw new Error("New user cannot log in: " + loggedUserError.message);
	}

	return loggedUser;
}

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
		if (attempt.attempts > 4) {
			attempt.access = false;
			throw new Error("Block further attempts");
		}
		return attempt;
	}
}

export async function loginService(data: TCredentials, remoteAddress?: string) {
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
