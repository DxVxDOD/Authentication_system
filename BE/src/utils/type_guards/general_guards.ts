export function isString(obj: unknown): obj is string {
	return typeof obj === "string" || obj instanceof String;
}

export function isNumber(obj: unknown): obj is number {
	return typeof obj === "number" || obj instanceof Number;
}
