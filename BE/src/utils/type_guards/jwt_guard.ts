import { JwtPayload } from "jsonwebtoken";

export function isJwtPayload(param: unknown): param is JwtPayload {
	return (param as JwtPayload).iat !== undefined;
}
