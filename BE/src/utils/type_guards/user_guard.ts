import { TUser } from "../../types/user";

export function isNewUser(obj: Partial<TUser>) {
	if (!obj || typeof obj !== "object") {
		throw new Error("Error object doesn't exist" + obj);
	}

	const schema: Record<keyof TUser, string> = {
		username: "string",
		email: "string",
		password: "string",
		fullName: "string",
	};

	const missingProperties = Object.keys(schema)
		.filter((key) => obj[key as keyof Partial<TUser>] === undefined)
		.map((key) => key as keyof TUser)
		.map((key) => {
			throw new Error(`Object is missing ${key} ${schema[key]}`);
		});

	return missingProperties.length === 0;
}
