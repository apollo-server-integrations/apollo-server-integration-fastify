import type { ApolloServer, BaseContext } from "@apollo/server"
import type { FastifyPluginAsync, RawServerBase, RawServerDefault } from "fastify"

import { fastifyApolloHandler } from "./handler"
import { ApolloFastifyPluginOptions } from "./types"

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