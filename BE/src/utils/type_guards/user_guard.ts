import { TNewUser } from "../../types/user";

export function isNewUser(obj: Partial<TNewUser>) {
	if (!obj || typeof obj !== "object") {
		throw new Error("Error object doesn't exist" + obj);
	}

	const schema: Record<keyof TNewUser, string> = {
		username: "string",
		password: "string",
	};

	const missingProperties = Object.keys(schema)
		.filter((key) => obj[key as keyof Partial<TNewUser>] === undefined)
		.map((key) => key as keyof TNewUser)
		.map((key) => {
			throw new Error(`Object is missing ${key} ${schema[key]}`);
		});

	return missingProperties.length === 0;
}
