import { wrapInPromise } from "../wrap_in_promise";
import { tokenExtractor } from "./token_extractor";
import jwt from "jsonwebtoken";
import { SECRET } from "../config";
import User from "../../models/user_model";
import { jwtPayloadParser } from "../parsers/jwt_parser";

export async function userExtractor(rawToken: string) {
	const { data: token, error: tokenError } = await wrapInPromise(
		tokenExtractor(rawToken)
	);

	if (!token || tokenError) {
		throw new Error("Error while extracting token: " + tokenError.message);
	}

	const { data: decodedToken, error: decodedTokenError } =
		await wrapInPromise(jwt.verify(token, SECRET));

	if (!decodedToken || decodedTokenError) {
		throw new Error(
			"Error while decoding token: " + decodedTokenError.message
		);
	}

	const { data: payload, error: payloadError } = await wrapInPromise(
		jwtPayloadParser(decodedToken)
	);

	if (!payload || payloadError) {
		throw new Error(
			"Decoded token is missing necessary fields: " + payloadError
		);
	}

	const { data: user, error: userError } = await wrapInPromise(
		User.findById(payload.id)
	);

	if (!user || userError) {
		throw new Error(
			"Cannot find user in database with provided id: " + userError
		);
	}

	return user;
}
