import { graphqlRequestBaseQuery } from "@rtk-query/graphql-request-base-query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";
import { TCredentials, TLoggedUser, TSignUp, TUser } from "../types/user";
import { gql } from "graphql-request";

export const baseApi = createApi({
	reducerPath: "baseApi",
	baseQuery: graphqlRequestBaseQuery({
		url: "/graphql",
		prepareHeaders: (headers, { getState }) => {
			const value = (getState() as RootState).auth.value;
			if (value) {
				headers.set("authorization", `Bearer ${value.token}`);
			}
			return headers;
		},
	}),
	endpoints: (builder) => ({
		addUser: builder.mutation<TUser, TSignUp>({
			query: ({ username, password, fullName, email }) => ({
				document: gql`
					mutation addUser(
						$username: String!
						$password: String!
						$fullName: String!
						$email: String!
					) {
						addUser(
							username: $username
							password: $password
							fullName: $fullName
							email: $email
						) {
							username
							fullName
							email
							id
						}
					}
				`,
				variables: {
					username,
					password,
					fullName,
					email,
				},
			}),
		}),
		login: builder.query<TLoggedUser, TCredentials>({
			query: ({ username, password }) => ({
				document: gql`
					query login($username: String!, $password: String!) {
						login(username: $username, password: $password) {
							username
							fullName
							email
							token
							id
						}
					}
				`,
				variables: {
					username,
					password,
				},
			}),
		}),
	}),
});

export const { useAddUserMutation } = baseApi;
