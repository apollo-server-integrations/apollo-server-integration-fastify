import fpBase, { PluginMetadata } from "fastify-plugin"
import type { ApolloServer, BaseContext } from "@apollo/server"
import type { FastifyPluginAsync, RawServerBase, RawServerDefault } from "fastify"

import { fastifyApolloHandler } from "./handler"
import { ApolloFastifyPluginOptions } from "./types"

const pluginMetadata: PluginMetadata = {
	fastify: "4.x",
	name: "apollo-server-fastify",
}

// Fix Fastify type error, RawServer type can't be passed in to a Plugin
const fp =
	<Options, RawServer extends RawServerBase = RawServerDefault>(handler: FastifyPluginAsync<Options, RawServer>, metadata: PluginMetadata) =>
		// @ts-ignore
		fpBase<Options>(handler, metadata)

export const fastifyApollo = <Context extends BaseContext = BaseContext, RawServer extends RawServerBase = RawServerDefault>(
	apollo: ApolloServer<Context>,
) =>
	fp<ApolloFastifyPluginOptions<Context, RawServer>, RawServer>(
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
		},
		pluginMetadata,
	)