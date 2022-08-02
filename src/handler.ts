import type { ApolloServer, BaseContext } from "@apollo/server"
import type { RawServerBase, RawServerDefault, RouteHandlerMethod } from "fastify"

import { mapToHttpHeaders } from "./helpers/map-to-http-headers"
import { fastifyRequestToGraphQL } from "./helpers/fastify-request-to-graphql"
import { ApolloFastifyHandlerOptions, ApolloFastifyContextFunction } from "./types"

export function fastifyApolloHandler<Context extends BaseContext = BaseContext, RawServer extends RawServerBase = RawServerDefault>(
	apollo: ApolloServer<Context>,
	options?: ApolloFastifyHandlerOptions<Context, RawServer>,
): RouteHandlerMethod<RawServer> {
	return async (request, reply) => {
		apollo.assertStarted("fastifyApolloHandler()")

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

		void reply.code(httpGraphQLResponse.statusCode || 200)
		void reply.headers(mapToHttpHeaders(httpGraphQLResponse.headers))

		return httpGraphQLResponse.completeBody
	}
}