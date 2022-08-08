import fp, { PluginMetadata } from "fastify-plugin"
import type { WithRequired } from "@apollo/utils.withrequired"
import type { ApolloServer, BaseContext } from "@apollo/server"
import type { FastifyPluginAsync, RawServerBase, RawServerDefault } from "fastify"

import { fastifyApolloHandler } from "./handler"
import { ApolloFastifyPluginOptions } from "./types"

const pluginMetadata: PluginMetadata = {
	fastify: "4.x",
	name: "apollo-server-fastify",
}

// Internal: Utility to fix Fastify type error - RawServer type can't be passed in to a Plugin.
// https://github.com/fastify/fastify-plugin/issues/191
// const fp =
// 	<Options, RawServer extends RawServerBase = RawServerDefault>(plugin: FastifyPluginAsync<Options, RawServer>, metadata: PluginMetadata) =>
// 		// @ts-ignore
// 		fastifyPlugin<Options>(plugin, metadata) as FastifyPluginAsync<Options, RawServer>

export function fastifyApollo<RawServer extends RawServerBase = RawServerDefault>(
	apollo: ApolloServer<BaseContext>,
): FastifyPluginAsync<Omit<ApolloFastifyPluginOptions<BaseContext, RawServer>, "context">, RawServer>

export function fastifyApollo<Context extends BaseContext = BaseContext, RawServer extends RawServerBase = RawServerDefault>(
	apollo: ApolloServer<Context>,
): FastifyPluginAsync<WithRequired<ApolloFastifyPluginOptions<Context, RawServer>, "context">, RawServer>

export function fastifyApollo<Context extends BaseContext = BaseContext, RawServer extends RawServerBase = RawServerDefault>(
	apollo: ApolloServer<Context>,
): FastifyPluginAsync<WithRequired<ApolloFastifyPluginOptions<Context, RawServer>, "context">, RawServer> {
	return fp<WithRequired<ApolloFastifyPluginOptions<Context, RawServer>, "context">, RawServer>(
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
}