import { ApolloServer, BaseContext } from "@apollo/server";
import type { WithRequired } from "@apollo/utils.withrequired";
import type {
	FastifyPluginAsync,
	FastifyTypeProvider,
	FastifyTypeProviderDefault,
	RawServerBase,
	RawServerDefault,
} from "fastify";
import { PluginMetadata, fastifyPlugin } from "fastify-plugin";

import { fastifyApolloHandler } from "./handler.js";
import { ApolloFastifyPluginOptions } from "./types.js";
import { isApolloServerLike } from "./utils.js";

const pluginMetadata: PluginMetadata = {
	fastify: "^4.4.0",
	name: "@as-integrations/fastify",
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
	TypeProvider
> {
	if (apollo === undefined || apollo === null || !isApolloServerLike(apollo)) {
		throw new TypeError("You must pass in an instance of `ApolloServer`.");
	}

	apollo.assertStarted("fastifyApollo()");

	/* eslint-disable @typescript-eslint/no-explicit-any */
	return fastifyPlugin(async (fastify: any, options: any) => {
		/* eslint-disable @typescript-eslint/no-unsafe-assignment */
		const { path = "/graphql", method = ["GET", "POST", "OPTIONS"], ...handlerOptions } = options;

		/* eslint-disable @typescript-eslint/no-unsafe-member-access */
		/* eslint-disable @typescript-eslint/no-unsafe-call */
		fastify.route({
			/* eslint-disable @typescript-eslint/no-unsafe-member-access */
			method,
			/* eslint-disable @typescript-eslint/no-unsafe-member-access */
			url: path,
			/* eslint-disable @typescript-eslint/no-unsafe-argument */
			handler: fastifyApolloHandler<Context, RawServer>(apollo, handlerOptions),
		});
	}, pluginMetadata);
}
