import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TLoggedUser, TUser } from "../../types/user";
import { RootState } from "../store";

const initialState = {
	value: null as null | TLoggedUser,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setUser(state, { payload }: PayloadAction<TLoggedUser>) {
			state.value = payload;
			return state;
		},
	},
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;

export function selectCurrentUser({ auth }: RootState) {
	if (auth.value) {
		const user: TUser = {
			username: auth.value.username,
			fullName: auth.value.fullName,
			email: auth.value.email,
			id: auth.value.fullName,
		};
		return user;
	}
	return null;
}
