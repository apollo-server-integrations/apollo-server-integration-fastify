// import fp, { PluginMetadata } from "fastify-plugin"
import type { FastifyPluginAsync, RawServerBase, RawServerDefault } from "fastify"
import type { ApolloServer, BaseContext } from "@apollo/server"

import { fastifyApolloHandler } from "./handler"
import { ApolloFastifyPluginOptions } from "./types"

// const pluginMetadata: PluginMetadata = {
// 	fastify: "4.x",
// 	name: "apollo-server-fastify",
// }

export const fastifyApollo = <Context extends BaseContext = BaseContext, RawServer extends RawServerBase = RawServerDefault>(
	apollo: ApolloServer<Context>,
): FastifyPluginAsync<ApolloFastifyPluginOptions<Context, RawServer>, RawServer> =>
	// eslint-disable-next-line @typescript-eslint/require-await
	async (fastify, options) => {
		const {
			path = "/graphql",
			method = ["GET", "POST"],
			...handlerOptions
		} = options

		fastify.route({
			method,
			url: path,
			handler: fastifyApolloHandler<Context, RawServer>(apollo, handlerOptions),
		})
	}