import type { FastifyPluginAsync } from "fastify"
import fp, { PluginMetadata } from "fastify-plugin"
import type { ApolloServer, BaseContext } from "@apollo/server"

import { fastifyApolloHandler } from "./handler"
import { ApolloFastifyPluginOptions } from "./types"

const pluginMetadata: PluginMetadata = {
	fastify: "4.x",
	name: "apollo-server-fastify",
}

export function fastifyApollo(
	apollo: ApolloServer<BaseContext>,
): FastifyPluginAsync<ApolloFastifyPluginOptions>

export function fastifyApollo<Context extends BaseContext>(
	apollo: ApolloServer<Context>,
): FastifyPluginAsync<Required<ApolloFastifyPluginOptions<Context>>>

export function fastifyApollo<Context extends BaseContext>(
	apollo: ApolloServer<Context>,
) {
	return fp<Required<ApolloFastifyPluginOptions<Context>>>(
		// eslint-disable-next-line @typescript-eslint/require-await
		async (fastify, options) => {
			const {
				path = "/graphql",
				prefixTrailingSlash,
				method = ["GET", "POST"],
				...handlerOptions
			} = options

			return fastify.route({
				method,
				url: path,
				prefixTrailingSlash,
				handler: fastifyApolloHandler<Context>(apollo, handlerOptions),
			})
		},
		pluginMetadata,
	)
}