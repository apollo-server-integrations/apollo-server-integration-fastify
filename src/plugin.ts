import type {
	RawServerBase,
	RawServerDefault,
	FastifyPluginAsync,
	FastifyTypeProvider,
	FastifyTypeProviderDefault,
} from "fastify"

import fp, { PluginMetadata } from "fastify-plugin"
import type { WithRequired } from "@apollo/utils.withrequired"
import type { ApolloServer, BaseContext } from "@apollo/server"

import { fastifyApolloHandler } from "./handler"
import { ApolloFastifyPluginOptions } from "./types"

const pluginMetadata: PluginMetadata = {
	fastify: "4.x",
	name: "apollo-server-fastify",
}

export function fastifyApollo<
	RawServer extends RawServerBase = RawServerDefault,
	TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
>(
	apollo: ApolloServer<BaseContext>,
): FastifyPluginAsync<Omit<ApolloFastifyPluginOptions<BaseContext, RawServer>, "context">, RawServer, TypeProvider>

export function fastifyApollo<
	Context extends BaseContext = BaseContext,
	RawServer extends RawServerBase = RawServerDefault,
	TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
>(
	apollo: ApolloServer<Context>,
): FastifyPluginAsync<WithRequired<ApolloFastifyPluginOptions<Context, RawServer>, "context">, RawServer, TypeProvider>

export function fastifyApollo<
	Context extends BaseContext = BaseContext,
	RawServer extends RawServerBase = RawServerDefault,
	TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
>(
	apollo: ApolloServer<Context>,
): FastifyPluginAsync<WithRequired<ApolloFastifyPluginOptions<Context, RawServer>, "context">, RawServer, TypeProvider> {
	apollo.assertStarted("fastifyApolloHandler()")

	return fp(
		async (fastify, options) => {
			const {
				path = "/graphql",
				method = ["GET", "POST", "OPTIONS"],
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