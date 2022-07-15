import type {
	FastifyReply,
	FastifyRequest,
} from "fastify"

import type {
	BaseContext,
	ApolloServer,
	ContextFunction,
} from "@apollo/server"

export interface FastifyContextFunctionArgument {
	request: FastifyRequest,
	reply: FastifyReply,
}

export interface FastifyHandlerOptions<Context extends BaseContext = BaseContext> {
	apollo: ApolloServer<Context>,
	context?: ContextFunction<[FastifyContextFunctionArgument], Context>,
}

export interface FastifyPluginOptions<Context extends BaseContext = BaseContext>
	extends FastifyHandlerOptions<Context> {
	path?: string,
}