import { TNewUser } from "../../types/user";
import { isNewUser } from "../type_guards/user_guard";
import { stringParser } from "./general_parsers";

export function newUserParser(obj: Partial<TNewUser>): TNewUser {
	if (!isNewUser(obj)) {
		throw new Error("Missing fields or incorrectly formatted data");
	}

	return {
		username: stringParser(obj.username),
		password: stringParser(obj.password),
	};
}
