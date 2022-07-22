import fp, { PluginMetadata } from "fastify-plugin"
import type { ApolloServer } from "@apollo/server"

import { apolloFastifyHandler } from "./handler"
import { ApolloFastifyPluginOptions } from "./types"

const pluginMetadata: PluginMetadata = {
	fastify: "4.x",
	name: "apollo-server-fastify",
}

export const apolloFastifyPlugin =
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

				return fastify.route({
					method,
					url: path,
					prefixTrailingSlash,
					handler: apolloFastifyHandler<Context>(apollo, handlerOptions),
				})
			},
			pluginMetadata,
		)