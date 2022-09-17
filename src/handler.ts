import type {
	ContextConfigDefault,
	FastifySchema,
	FastifyTypeProvider,
	FastifyTypeProviderDefault,
	RawReplyDefaultExpression,
	RawRequestDefaultExpression,
	RawServerBase,
	RawServerDefault,
	RouteGenericInterface,
	RouteHandlerMethod,
} from "fastify"

import type { WithRequired } from "@apollo/utils.withrequired"
import type { ApolloServer, BaseContext } from "@apollo/server"

import { mapToHttpHeaders } from "./helpers/map-to-http-headers"
import { fastifyRequestToGraphQL } from "./helpers/fastify-request-to-graphql"
import { ApolloFastifyHandlerOptions, ApolloFastifyContextFunction } from "./types"

export function fastifyApolloHandler<
	RawServer extends RawServerBase = RawServerDefault,
	TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
>(
	apollo: ApolloServer<BaseContext>,
	options?: never,
): RouteHandlerMethod<
	RawServer,
	RawRequestDefaultExpression<RawServer>,
	RawReplyDefaultExpression<RawServer>,
	RouteGenericInterface,
	ContextConfigDefault,
	FastifySchema,
	TypeProvider
>

export function fastifyApolloHandler<
	Context extends BaseContext,
	RawServer extends RawServerBase = RawServerDefault,
	TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
>(
	apollo: ApolloServer<Context>,
	options: WithRequired<ApolloFastifyHandlerOptions<Context, RawServer>, "context">,
): RouteHandlerMethod<
	RawServer,
	RawRequestDefaultExpression<RawServer>,
	RawReplyDefaultExpression<RawServer>,
	RouteGenericInterface,
	ContextConfigDefault,
	FastifySchema,
	TypeProvider
>

export function fastifyApolloHandler<
	Context extends BaseContext,
	RawServer extends RawServerBase = RawServerDefault,
	TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
>(
	apollo: ApolloServer<Context>,
	options?: ApolloFastifyHandlerOptions<Context, RawServer>,
): RouteHandlerMethod<
	RawServer,
	RawRequestDefaultExpression<RawServer>,
	RawReplyDefaultExpression<RawServer>,
	RouteGenericInterface,
	ContextConfigDefault,
	FastifySchema,
	TypeProvider
> {
	apollo.assertStarted("fastifyApolloHandler()")
	return async (request, reply) => {

		const defaultContext: ApolloFastifyContextFunction<Context, RawServer> =
			async () => ({} as Context)

		const contextFunction =
			options?.context ?? defaultContext

		const httpGraphQLResponse =
			await apollo.executeHTTPGraphQLRequest({
				context: () => contextFunction(request, reply),
				httpGraphQLRequest: fastifyRequestToGraphQL<RawServer>(request),
			})

		if (httpGraphQLResponse.completeBody === null) {
			throw Error("Incremental delivery not implemented")
		}

		void reply.code(httpGraphQLResponse.status || 200)
		void reply.headers(mapToHttpHeaders(httpGraphQLResponse.headers))

		return httpGraphQLResponse.completeBody
	}
}