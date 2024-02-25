import {
	GraphQLError,
	GraphQLList,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
} from "graphql";
import User from "../models/user_model";
import { wrapInPromise } from "../utils/wrap_in_promise";
import { loginService, newUserService } from "../service/user_service";
import { TCredentials } from "../types/credentials";
import { userExtractor } from "../utils/middleware/user_extractor";
import { TUser } from "../types/user";

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
			async resolve(_parent, args: Partial<TUser>) {
				const { data, error } = await wrapInPromise(
					newUserService(args)
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
	},
});

const schema = new GraphQLSchema({
	query: UserQuery,
	mutation,
});

export default schema;
