import {
	GraphQLBoolean,
	GraphQLError,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
} from "graphql";
import User from "../models/user_model";
import { wrapInPromise } from "../utils/wrap_in_promise";
import { newUserService } from "../service/user_service";
import { TCredentials } from "../types/credentials";
import { userExtractor } from "../utils/middleware/user_extractor";
import { TUser } from "../types/user";
import { loginService } from "../service/login-service";
import { enableFields } from "../service/access_service";

const UserType = new GraphQLObjectType({
	name: "User",
	fields: () => ({
		id: { type: GraphQLString },
		fullName: { type: GraphQLString },
		password: { type: GraphQLString },
		username: { type: GraphQLString },
		email: { type: GraphQLString },
		token: { type: GraphQLString },
	}),
});

const AccessType = new GraphQLObjectType({
	name: "Access",
	fields: () => ({
		attempts: { type: GraphQLInt },
		remoteAddress: { type: GraphQLString },
		access: { type: GraphQLBoolean },
	}),
});

const UserQuery = new GraphQLObjectType({
	name: "UserQueryType",
	fields: {
		users: {
			type: new GraphQLList(UserType),
			args: { token: { type: new GraphQLNonNull(GraphQLString) } },
			async resolve(_parent, args, context) {
				console.log(typeof context.request.socket.remoteAddress);
				const { error } = await wrapInPromise(
					userExtractor(args.token)
				);

				if (error) {
					throw new GraphQLError(
						"You do not have access ! " +
							error.message +
							error.cause
					);
				}
				const users = User.find({});
				return users;
			},
		},
	},
});

const mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		addUser: {
			type: UserType,
			args: {
				username: { type: new GraphQLNonNull(GraphQLString) },
				password: { type: new GraphQLNonNull(GraphQLString) },
				fullName: { type: new GraphQLNonNull(GraphQLString) },
				email: { type: new GraphQLNonNull(GraphQLString) },
			},
			async resolve(_parent, args: Partial<TUser>, context) {
				const { data, error } = await wrapInPromise(
					newUserService(args, context.request.socket.remoteAddress)
				);
				if (!data || error) {
					throw new GraphQLError(error.message);
				}
				return data;
			},
		},
		login: {
			type: UserType,
			args: {
				username: { type: new GraphQLNonNull(GraphQLString) },
				password: { type: new GraphQLNonNull(GraphQLString) },
			},
			async resolve(_parent, args: TCredentials, context) {
				const { data, error } = await wrapInPromise(
					loginService(args, context.request.socket.remoteAddress)
				);

				if (!data || error) {
					throw new GraphQLError(error.message);
				}

				return data;
			},
		},
		enableFields: {
			type: AccessType,
			async resolve(_parent, _args, context) {
				const { data, error } = await wrapInPromise(
					enableFields(context.request.socket.remoteAddress)
				);
				if (!data || error) {
					throw new GraphQLError(error.message);
				}
				return data;
			},
		},
	},
});

const schema = new GraphQLSchema({
	query: UserQuery,
	mutation,
});

export default schema;
