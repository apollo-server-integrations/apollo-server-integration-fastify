import type {
	HTTPMethods,
	FastifyReply,
	FastifyRequest,
	RouteShorthandOptions,
} from "fastify"

import type {
	BaseContext,
	ContextFunction,
} from "@apollo/server"

type ValueOrArray<T> = T | T[]

export interface ApolloFastifyContext {
	request: FastifyRequest,
	reply: FastifyReply,
}

export interface ApolloFastifyHandlerOptions<Context extends BaseContext = BaseContext> {
	context?: ContextFunction<[ApolloFastifyContext], Context>,
}

export interface ApolloFastifyPluginOptions<Context extends BaseContext = BaseContext>
	extends
	ApolloFastifyHandlerOptions<Context>,
	Pick<RouteShorthandOptions, "prefixTrailingSlash"> {
	path?: string,
	method?: ValueOrArray<Extract<HTTPMethods, "GET" | "POST">>,
}