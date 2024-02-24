export function isString(obj: unknown): obj is string {
	return typeof obj === "string" || obj instanceof String;
}
