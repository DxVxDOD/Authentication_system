import { isNumber, isString } from "../type_guards/general_guards";

export function stringParser(obj: unknown): string {
	if (!obj || !isString(obj)) {
		throw new Error("Provided parameter is not a string");
	}
	return obj;
}

export function numberParser(obj: unknown): number {
	if (obj || !isNumber(obj)) {
		throw new Error("Provided parameter is not a number");
	}
	return obj;
}
