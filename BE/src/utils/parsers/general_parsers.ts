import { isString } from "../type_guards/general_guards";

export function stringParser(obj: unknown): string {
	if (!obj || !isString(obj)) {
		throw new Error("Provided parameter is not a string");
	}
	return obj;
}
