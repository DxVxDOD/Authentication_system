import { TUser } from "../../types/user";
import { isNewUser } from "../type_guards/user_guard";
import { stringParser } from "./general_parsers";

export function userParser(obj: Partial<TUser>): TUser {
	if (!isNewUser(obj)) {
		throw new Error("Missing fields or incorrectly formatted data");
	}

	return {
		username: stringParser(obj.username),
		email: stringParser(obj.email),
		password: stringParser(obj.password),
		fullName: stringParser(obj.fullName),
	};
}
