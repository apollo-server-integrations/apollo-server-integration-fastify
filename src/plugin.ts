import { ApolloServer, BaseContext } from "@apollo/server";
import type { WithRequired } from "@apollo/utils.withrequired";
import type {
	FastifyBaseLogger,
	FastifyPluginAsync,
	FastifyTypeProvider,
	FastifyTypeProviderDefault,
	RawReplyDefaultExpression,
	RawRequestDefaultExpression,
	RawServerBase,
	RawServerDefault,
} from "fastify";
import { PluginMetadata, fastifyPlugin } from "fastify-plugin";

import { fastifyApolloHandler } from "./handler.js";
import { ApolloFastifyPluginOptions } from "./types.js";
import { isApolloServerLike } from "./utils.js";

const pluginMetadata: PluginMetadata = {
	fastify: "^5.2.2",
	name: "@xzyfer/as-integrations-fastify",
};

export function fastifyApollo<
	RawServer extends RawServerBase = RawServerDefault,
	TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
>(
	apollo: ApolloServer<BaseContext>,
): FastifyPluginAsync<Omit<ApolloFastifyPluginOptions<BaseContext, RawServer>, "context">, RawServer, TypeProvider>;

export function fastifyApollo<
	Context extends BaseContext = BaseContext,
	RawServer extends RawServerBase = RawServerDefault,
	TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
>(
	apollo: ApolloServer<Context>,
): FastifyPluginAsync<WithRequired<ApolloFastifyPluginOptions<Context, RawServer>, "context">, RawServer, TypeProvider>;

export function fastifyApollo<
	Context extends BaseContext = BaseContext,
	RawServer extends RawServerBase = RawServerDefault,
	TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
>(
	apollo: ApolloServer<Context>,
): FastifyPluginAsync<
	WithRequired<ApolloFastifyPluginOptions<Context, RawServer>, "context">,
	RawServer,
	TypeProvider,
	FastifyBaseLogger
> {
	if (apollo === undefined || apollo === null || !isApolloServerLike(apollo)) {
		throw new TypeError("You must pass in an instance of `ApolloServer`.");
	}

	apollo.assertStarted("fastifyApollo()");

	return fastifyPlugin<
		WithRequired<ApolloFastifyPluginOptions<Context, RawServer>, "context">,
		RawServer,
		TypeProvider,
		FastifyBaseLogger,
		FastifyPluginAsync<
			WithRequired<ApolloFastifyPluginOptions<Context, RawServer>, "context">,
			RawServer,
			TypeProvider,
			FastifyBaseLogger
		>
	>(async (fastify, options) => {
		const { path = "/graphql", method = ["GET", "POST", "OPTIONS"], ...handlerOptions } = options;

		fastify.route({
			method,
			url: path,
			handler: fastifyApolloHandler<
				Context,
				RawServer,
				RawRequestDefaultExpression<RawServer>,
				RawReplyDefaultExpression<RawServer>
			>(apollo, handlerOptions),
		});
	}, pluginMetadata);
}
