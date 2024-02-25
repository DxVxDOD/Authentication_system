import { stringParser } from "../parsers/general_parsers";
import jwt from "jsonwebtoken";
import { SECRET } from "../config";
import { jwtPayloadParser } from "../parsers/jwt_parser";
import { wrapInPromise } from "../wrap_in_promise";

export async function tokenExtractor(rawToken: string) {
	if (!stringParser(rawToken)) {
		throw new Error("Token is missing");
	}
	if (!rawToken.startsWith("Bearer ")) {
		throw new Error("Authorization header is formatted incorrectly.");
	}

	rawToken = rawToken.replace("Bearer ", "");

	const { data: decodedToken, error: decodedTokenError } =
		await wrapInPromise(jwt.verify(rawToken, SECRET));

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

	return payload;
}
