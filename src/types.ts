import type {
	FastifyReply,
	FastifyRequest,
} from "fastify"

import type {
	ApolloServer,
	BaseContext,
	ContextFunction,
} from "@apollo/server"

export interface FastifyContextFunctionArgument {
	request: FastifyRequest,
	reply: FastifyReply,
}

export interface FastifyPluginOptions<Context extends BaseContext = BaseContext> {
	apollo: ApolloServer<Context>,
	context?: ContextFunction<[FastifyContextFunctionArgument], Context>,
}