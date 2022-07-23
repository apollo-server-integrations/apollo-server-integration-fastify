import type {
	HTTPMethods,
	FastifyReply,
	FastifyRequest,
	RouteShorthandOptions,
} from "fastify"

import type { BaseContext, ContextFunction } from "@apollo/server"

type ValueOrArray<T> = T | T[]

export type ApolloFastifyContextFunctionArgument = [
	request: FastifyRequest,
	reply: FastifyReply,
]

export type ApolloFastifyContextFunction<Context> =
	ContextFunction<ApolloFastifyContextFunctionArgument, Context>

export interface ApolloFastifyHandlerOptions<Context extends BaseContext = BaseContext> {
	context?: ApolloFastifyContextFunction<Context>,
}

export interface ApolloFastifyPluginOptions<Context extends BaseContext = BaseContext> extends
	ApolloFastifyHandlerOptions<Context>,
	Pick<RouteShorthandOptions, "prefixTrailingSlash"> {
	path?: string,
	method?: ValueOrArray<Extract<HTTPMethods, "GET" | "POST">>,
}