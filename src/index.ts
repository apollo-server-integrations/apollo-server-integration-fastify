/* eslint-disable @typescript-eslint/require-await */

import type {
	BaseContext,
	ContextFunction,
	HTTPGraphQLRequest,
} from "@apollo/server"

import fp, { PluginMetadata } from "fastify-plugin"

import { httpHeadersToMap } from "./helpers"
import { FastifyPluginOptions, FastifyContextFunctionArgument } from "./types"

const pluginMetadata: PluginMetadata = {
	fastify: "4.x",
	name: "apollo-server-fastify",
}

const fastifyApollo =
	fp<FastifyPluginOptions>(
		async (fastify, options) => {
			const { apollo } = options

			apollo.assertStarted("fastifyApollo()")

			const defaultContext: ContextFunction<
				[FastifyContextFunctionArgument],
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				any
			> = async () => ({})

			const context: ContextFunction<[FastifyContextFunctionArgument], BaseContext> =
				options?.context ?? defaultContext

			fastify.route({
				url: "/",
				method: ["GET", "POST"],
				handler: async (request, reply) => {
					const httpGraphQLRequest: HTTPGraphQLRequest = {
						body: request.body,
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
				},
			})
		},
		pluginMetadata,
	)

export { FastifyPluginOptions, FastifyContextFunctionArgument }

export default fastifyApollo