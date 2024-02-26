import User from "../models/user_model";
import { TUser } from "../types/user";
import { userParser } from "../utils/parsers/user_parser";
import { wrapInPromise } from "../utils/wrap_in_promise";
import * as argon2 from "argon2";
import { loginService } from "./login-service";

export async function newUserService(
	data: Partial<TUser>,
	remoteAddress: string
) {
	const { data: newUserData, error: newUserDataError } = await wrapInPromise(
		userParser(data)
	);

	if (!newUserData || newUserDataError) {
		throw new Error(
			"Error while parsing new user data: " + newUserDataError.message
		);
	}

	if (newUserData.username.length < 3) {
		throw new Error("Please provide longer username!", {
			cause: newUserData.username,
		});
	}

	if (newUserData.password.length < 3) {
		throw new Error("Please provide longer password!", {
			cause: newUserData.password,
		});
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
			"Provided username already exist: " + newUserData.username,
			{ cause: newUserData.username }
		);
	}

	const emailExists = allUsers.find(
		(user) => user.email === newUserData.email
	);

	if (emailExists) {
		throw new Error(
			"Provided email already exist: " + newUserData.email,

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
		loginService(
			{
				username: savedNewUser.username,
				password: newUserData.password,
			},
			remoteAddress
		)
	);

	if (!loggedUser || loggedUserError) {
		throw new Error("New user cannot log in: " + loggedUserError.message);
	}

	return loggedUser;
}
