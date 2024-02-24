import User from "../models/user_model";
import { TLoginUser, TUser } from "../types/user";
import { SECRET } from "../utils/config";
import { userParser } from "../utils/parsers/user_parser";
import { wrapInPromise } from "../utils/wrap_in_promise";
import jwt from "jsonwebtoken";
import * as argon2 from "argon2";
import { credentialsParser } from "../utils/parsers/credentials_parser";

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

	return savedNewUser;
}

export async function loginService(data: Partial<TUser>) {
	const { data: userClient, error: userClientError } = await wrapInPromise(
		credentialsParser(data)
	);

	if (!userClient || userClientError) {
		throw new Error("Wrong credentials: " + userClientError.message);
	}

	const { data: userDB, error: userDBError } = await wrapInPromise(
		User.findOne({ username: userClient.username })
	);

	if (!userDB || userDBError) {
		throw new Error(
			"Cannot find user based on provided fields: " + userDBError
		);
	}

	const { error: passwordError } = await wrapInPromise(
		argon2.verify(userDB.password, userClient.password)
	);

	if (passwordError) {
		throw new Error("Wrong password provided: " + passwordError.message);
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
