import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = "";

const themeSlice = createSlice({
	name: "theme",
	initialState,
	reducers: {
		setTheme(state, { payload }: PayloadAction<string>) {
			state = payload;
			return state;
		},
	},
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
