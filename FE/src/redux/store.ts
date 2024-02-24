import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/auth";
import { baseApi } from "./gql_endpoint";

export const store = configureStore({
	reducer: {
		auth,
		[baseApi.reducerPath]: baseApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
