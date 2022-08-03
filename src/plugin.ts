/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable max-len */
import fpBase, { PluginMetadata } from "fastify-plugin"
import type { WithRequired } from "@apollo/utils.withrequired"
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
	<Options, RawServer extends RawServerBase = RawServerDefault>(handler: FastifyPluginAsync<Options, RawServer>, metadata: PluginMetadata): FastifyPluginAsync<Options, RawServer> =>
		// @ts-ignore
		fpBase<Options>(handler, metadata)

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