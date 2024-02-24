import { TCredentials } from "../../types/credentials";
import { isCredentials } from "../type_guards/credentials_guard";
import { stringParser } from "./general_parsers";

export function credentialsParser(obj: Partial<TCredentials>): TCredentials {
	if (!isCredentials(obj)) {
		throw new Error("Missing fields or incorrectly formatted data");
	}

	return {
		username: stringParser(obj.username),
		password: stringParser(obj.password),
	};
}
