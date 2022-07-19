import type { RouteHandlerMethod } from "fastify"
import fp, { PluginMetadata } from "fastify-plugin"
import type { ApolloServer, HTTPGraphQLRequest } from "@apollo/server"

import {
	ApolloFastifyPluginOptions,
	ApolloFastifyHandlerOptions,
	ApolloFastifyContextFunction,
	ApolloFastifyContextFunctionParams,
} from "./types"

import httpHeadersToMap from "./http-headers-to-map"
import mapToHttpHeaders from "./map-to-http-headers"

const apolloFastifyHandler = <Context>(
	apollo: ApolloServer<Context>,
	options?: ApolloFastifyHandlerOptions<Context>,
): RouteHandlerMethod =>
	async (request, reply) => {
		const defaultContext: ApolloFastifyContextFunction<Context> =
			() => Promise.resolve({} as Context)

		const context =
			options?.context ?? defaultContext

		const body =
			request.method === "POST" ?
				request.body : request.query

		const httpGraphQLRequest: HTTPGraphQLRequest = {
			body,
			searchParams: request.query,
			method: request.method.toUpperCase(),
			headers: httpHeadersToMap(request.headers),
		}

		const httpGraphQLResponse =
			await apollo.executeHTTPGraphQLRequest({
				httpGraphQLRequest,
				context: () => context(request, reply),
			})

		if (httpGraphQLResponse.completeBody === null) {
			throw Error("Incremental delivery not implemented")
		}

		void reply.code(httpGraphQLResponse.statusCode || 200)
		void reply.headers(mapToHttpHeaders(httpGraphQLResponse.headers))

		return httpGraphQLResponse.completeBody
	}

const pluginMetadata: PluginMetadata = {
	fastify: "4.x",
	name: "apollo-server-fastify",
}

const apolloFastifyPlugin =
	<Context = unknown>(apollo: ApolloServer<Context>) =>
		fp<ApolloFastifyPluginOptions<Context>>(
			// eslint-disable-next-line @typescript-eslint/require-await
			async (fastify, options) => {
				const {
					path = "/graphql",
					prefixTrailingSlash,
					method = ["GET", "POST"],
					...handlerOptions
				} = options

				fastify.route({
					method,
					url: path,
					prefixTrailingSlash,
					handler: apolloFastifyHandler<Context>(apollo, handlerOptions),
				})
			},
			pluginMetadata,
		)

export {
	apolloFastifyPlugin,
	apolloFastifyHandler,
	ApolloFastifyPluginOptions,
	ApolloFastifyHandlerOptions,
	ApolloFastifyContextFunction,
	ApolloFastifyContextFunctionParams,
}