/* eslint-disable @typescript-eslint/require-await */

import type {
	BaseContext,
	ContextFunction,
	HTTPGraphQLRequest,
} from "@apollo/server"

import { RouteHandler } from "fastify"
import fp, { PluginMetadata } from "fastify-plugin"

import {
	FastifyPluginOptions,
	FastifyHandlerOptions,
	FastifyContextFunctionArgument,
} from "./types"

import { httpHeadersToMap } from "./helpers"

const fastifyHandler =
	<Context extends BaseContext = BaseContext>(options: FastifyHandlerOptions<Context>): RouteHandler =>
		async (request, reply) => {
			const { apollo } = options

			const defaultContext: ContextFunction<
				[FastifyContextFunctionArgument],
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				any
			> = async () => ({})

			const context: ContextFunction<[FastifyContextFunctionArgument], Context> =
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

const fastifyPlugin =
	fp<FastifyPluginOptions>(
		async (fastify, options) => {
			const { path, ...handlerOptions } = options

			fastify.route({
				method: ["GET", "POST"],
				url: options?.path || "/graphql",
				handler: fastifyHandler(handlerOptions),
			})
		},
		pluginMetadata,
	)

export {
	fastifyPlugin,
	fastifyHandler,
	FastifyPluginOptions,
	FastifyContextFunctionArgument,
}