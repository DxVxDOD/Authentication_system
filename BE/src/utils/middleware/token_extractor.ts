import { stringParser } from "../parsers/general_parsers";

export function tokenExtractor(rawToken: string) {
	if (!stringParser(rawToken)) {
		throw new Error("Token is missing");
	}
	if (!rawToken.startsWith("Bearer ")) {
		throw new Error("Authorization header is formatted incorrectly.");
	}

	return rawToken.replace("Bearer ", "");
}
