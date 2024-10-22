import type { BaseContext, ContextFunction } from "@apollo/server";
import type {
	FastifyReply,
	FastifyRequest,
	HTTPMethods,
	RawServerBase,
	RawServerDefault,
	RouteGenericInterface,
} from "fastify";

type ValueOrArray<T> = T | T[];

export type ApolloFastifyContextFunctionArgument<
	RawServer extends RawServerBase = RawServerDefault,
	RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
> = [request: FastifyRequest<RouteGeneric, RawServer>, reply: FastifyReply<RouteGeneric, RawServer>];

export type ApolloFastifyContextFunction<
	Context extends BaseContext,
	RawServer extends RawServerBase = RawServerDefault,
	RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
> = ContextFunction<ApolloFastifyContextFunctionArgument<RawServer, RouteGeneric>, Context>;

export interface ApolloFastifyHandlerOptions<
	Context extends BaseContext = BaseContext,
	RawServer extends RawServerBase = RawServerDefault,
	RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
> {
	context?: ApolloFastifyContextFunction<Context, RawServer, RouteGeneric>;
}

export interface ApolloFastifyPluginOptions<
	Context extends BaseContext = BaseContext,
	RawServer extends RawServerBase = RawServerDefault,
	RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
> extends ApolloFastifyHandlerOptions<Context, RawServer, RouteGeneric> {
	path?: string;
	method?: ValueOrArray<Extract<HTTPMethods, "GET" | "POST" | "OPTIONS">>;
}
