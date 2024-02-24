import { isJwtPayload } from "../type_guards/jwt_guard";

export function jwtPayloadParser(param: unknown) {
	if (isJwtPayload(param)) {
		return param;
	}
	throw new Error("While parsing provided token: " + param);
}
