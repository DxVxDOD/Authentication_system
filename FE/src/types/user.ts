export type TLoggedUser = {
	username: string;
	fullName: string;
	token: string;
	email: string;
	id: string;
};

export type TSignUp = {
	username: string;
	fullName: string;
	password: string;
	email: string;
};

export type TUser = Omit<TLoggedUser, "token">;

export type TCredentials = {
	username: string;
	password: string;
};
