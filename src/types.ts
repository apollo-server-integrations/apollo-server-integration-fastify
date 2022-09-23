import type { RouteGenericInterface } from "fastify/types/route"
import type { BaseContext, ContextFunction } from "@apollo/server"
import type { HTTPMethods, FastifyReply, FastifyRequest, RawServerBase, RawServerDefault } from "fastify"

type ValueOrArray<T> = T | T[]

export type ApolloFastifyContextFunctionArgument<RawServer extends RawServerBase = RawServerDefault> = [
	request: FastifyRequest<RouteGenericInterface, RawServer>,
	reply: FastifyReply<RawServer>,
]

export type ApolloFastifyContextFunction<
	Context extends BaseContext,
	RawServer extends RawServerBase = RawServerDefault,
> =	ContextFunction<ApolloFastifyContextFunctionArgument<RawServer>, Context>

export interface ApolloFastifyHandlerOptions<
	Context extends BaseContext = BaseContext,
	RawServer extends RawServerBase = RawServerDefault,
> {
	context?: (
		Context |
		ApolloFastifyContextFunction<Context, RawServer> |
		(() => ApolloFastifyContextFunction<Context, RawServer>) |
		Promise<ApolloFastifyContextFunction<Context, RawServer>>
	),
}

export interface ApolloFastifyPluginOptions<
	Context extends BaseContext = BaseContext,
	RawServer extends RawServerBase = RawServerDefault,
> extends ApolloFastifyHandlerOptions<Context, RawServer> {
	path?: string,
	method?: ValueOrArray<Extract<HTTPMethods, "GET" | "POST" | "OPTIONS">>,
}