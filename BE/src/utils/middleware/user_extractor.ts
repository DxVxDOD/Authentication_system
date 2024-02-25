import { wrapInPromise } from "../wrap_in_promise";
import { tokenExtractor } from "./token_extractor";
import User from "../../models/user_model";

export async function userExtractor(rawToken: string) {
	const { data: token, error: tokenError } = await wrapInPromise(
		tokenExtractor(rawToken)
	);

	if (!token || tokenError) {
		throw new Error("Error while decoding token: " + tokenError.message);
	}

	const { data: user, error: userError } = await wrapInPromise(
		User.findById(token.id)
	);

	if (!user || userError) {
		throw new Error(
			"Cannot find user in database with provided id: " + userError
		);
	}

	return user;
}
