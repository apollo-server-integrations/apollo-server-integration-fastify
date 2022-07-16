import {
	ApolloServer,
	BaseContext,
	ContextFunction,
	HTTPGraphQLRequest,
} from "@apollo/server"

import { RouteHandler } from "fastify"
import fp, { PluginMetadata } from "fastify-plugin"

import {
	ApolloFastifyContext,
	ApolloFastifyPluginOptions,
	ApolloFastifyHandlerOptions,
} from "./types"

import httpHeadersToMap from "./http-headers-to-map"

const apolloFastifyHandler = <Context extends BaseContext = BaseContext>(
	apollo: ApolloServer<Context>,
	options?: ApolloFastifyHandlerOptions<Context>,
): RouteHandler =>
	async (request, reply) => {
		const defaultContext: ContextFunction<
			[ApolloFastifyContext],
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			any
		> = () => Promise.resolve({})

		const context: ContextFunction<[ApolloFastifyContext], Context> =
			options?.context ?? defaultContext

		const body =
			request.method === "POST" ?
				request.body : request.query

		console.log({
			body,
			request,
		})

		const httpGraphQLRequest: HTTPGraphQLRequest = {
			body,
			searchParams: request.query,
			method: request.method.toUpperCase(),
			headers: httpHeadersToMap(request.headers),
		}

		const httpGraphQLResponse =
			await apollo.executeHTTPGraphQLRequest({
				httpGraphQLRequest,
				context: () => context({ request, reply }),
			})

		if (httpGraphQLResponse.completeBody === null) {
			throw Error("Incremental delivery not implemented")
		}

		void reply.code(httpGraphQLResponse.statusCode || 200)

		for (const [key, value] of httpGraphQLResponse.headers) {
			void reply.header(key, value)
		}

		return httpGraphQLResponse.completeBody
	}

const pluginMetadata: PluginMetadata = {
	fastify: "4.x",
	name: "apollo-server-fastify",
}

const apolloFastifyPlugin =
	<Context extends BaseContext = BaseContext>(apollo: ApolloServer<Context>) =>
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
	ApolloFastifyContext,
	ApolloFastifyPluginOptions,
	ApolloFastifyHandlerOptions,
}