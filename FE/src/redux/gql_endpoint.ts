import { graphqlRequestBaseQuery } from "@rtk-query/graphql-request-base-query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";
import { TCredentials, TLoggedUser, TSignUp } from "../types/user";
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
		signUp: builder.mutation<TLoggedUser, TSignUp>({
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
							token
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
			transformResponse: (response: { addUser: TLoggedUser }) => {
				console.log(response);
				return response.addUser;
			},
		}),
		login: builder.mutation<TLoggedUser, TCredentials>({
			query: ({ username, password }) => ({
				document: gql`
					mutation login($username: String!, $password: String!) {
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
			transformResponse: (response: { login: TLoggedUser }) =>
				response.login,
			transformErrorResponse: (response: { message: string }) => {
				const message = response.message
					.split(":")
					.slice(0, 2)
					.join(": ");

				console.log(message);

				return message;
			},
		}),
	}),
});

export const { useSignUpMutation, useLoginMutation } = baseApi;
