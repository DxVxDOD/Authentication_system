import { TCredentials } from "../../types/credentials";

export function isCredentials(obj: Partial<TCredentials>) {
	if (!obj || typeof obj !== "object") {
		throw new Error("Error object doesn't exist" + obj);
	}

	const schema: Record<keyof TCredentials, string> = {
		username: "string",
		password: "string",
	};

	const missingProperties = Object.keys(schema)
		.filter((key) => obj[key as keyof Partial<TCredentials>] === undefined)
		.map((key) => key as keyof TCredentials)
		.map((key) => {
			throw new Error(`Object is missing ${key} ${schema[key]}`);
		});

	return missingProperties.length === 0;
}
