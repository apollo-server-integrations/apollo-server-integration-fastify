import { MyContext } from "./context";

const resolvers = {
	Query: {
		helloWorld: (parent, args, context: MyContext, info) => context.greeting,
	},
};

export default resolvers;
