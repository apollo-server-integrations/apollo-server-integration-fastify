import type {
	ContextConfigDefault,
	FastifyBaseLogger,
	FastifySchema,
	FastifyTypeProvider,
	FastifyTypeProviderDefault,
	RawReplyDefaultExpression,
	RawRequestDefaultExpression,
	RawServerBase,
	RawServerDefault,
	RouteGenericInterface,
	RouteHandlerMethod,
} from "fastify";

import type { WithRequired } from "@apollo/utils.withrequired";
import type { ApolloServer, BaseContext } from "@apollo/server";

import { fastifyRequestToGraphQL, mapToHttpHeaders } from "./helpers";
import { ApolloFastifyHandlerOptions, ApolloFastifyContextFunction } from "./types";

interface RouteInterface extends RouteGenericInterface {
	Reply: string;
}

export function fastifyApolloHandler<
	RawServer extends RawServerBase = RawServerDefault,
	RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
	RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
	ContextConfig = ContextConfigDefault,
	SchemaCompiler extends FastifySchema = FastifySchema,
	TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
	Logger extends FastifyBaseLogger = FastifyBaseLogger,
>(
	apollo: ApolloServer<BaseContext>,
): RouteHandlerMethod<
	RawServer,
	RawRequest,
	RawReply,
	RouteInterface,
	ContextConfig,
	SchemaCompiler,
	TypeProvider,
	Logger
>;

export function fastifyApolloHandler<
	Context extends BaseContext,
	RawServer extends RawServerBase = RawServerDefault,
	RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
	RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
	ContextConfig = ContextConfigDefault,
	SchemaCompiler extends FastifySchema = FastifySchema,
	TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
	Logger extends FastifyBaseLogger = FastifyBaseLogger,
>(
	apollo: ApolloServer<Context>,
	options: WithRequired<ApolloFastifyHandlerOptions<Context, RawServer>, "context">,
): RouteHandlerMethod<
	RawServer,
	RawRequest,
	RawReply,
	RouteInterface,
	ContextConfig,
	SchemaCompiler,
	TypeProvider,
	Logger
>;

export function fastifyApolloHandler<
	Context extends BaseContext,
	RawServer extends RawServerBase = RawServerDefault,
	RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
	RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
	ContextConfig = ContextConfigDefault,
	SchemaCompiler extends FastifySchema = FastifySchema,
	TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
	Logger extends FastifyBaseLogger = FastifyBaseLogger,
>(
	apollo: ApolloServer<Context>,
	options?: ApolloFastifyHandlerOptions<Context, RawServer>,
): RouteHandlerMethod<
	RawServer,
	RawRequest,
	RawReply,
	RouteInterface,
	ContextConfig,
	SchemaCompiler,
	TypeProvider,
	Logger
> {
	apollo.assertStarted("fastifyApolloHandler()");

	const defaultContext: ApolloFastifyContextFunction<Context, RawServer> = () =>
		Promise.resolve({} as Context);

	const contextFunction = options?.context ?? defaultContext;

	return async (request, reply) => {
		const httpGraphQLResponse = await apollo.executeHTTPGraphQLRequest({
			httpGraphQLRequest: fastifyRequestToGraphQL<RawServer>(request),
			context: () => contextFunction(request, reply),
		});

		void reply.headers(mapToHttpHeaders(httpGraphQLResponse.headers));
		void reply.code(httpGraphQLResponse.status || 200);

		if (httpGraphQLResponse.body.kind === "complete") {
			return httpGraphQLResponse.body.string;
		} else {
			throw new Error("Incremental delivery not implemented yet.");
		}
	};
}
