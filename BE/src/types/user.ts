export type TUser = {
	username: string;
	fullName: string;
	password: string;
	email: string;
};

export type TLoginUser = Omit<TUser, "password"> & {
	id: string;
	token: string;
};
