import type {
FastifyPluginAsync,
FastifyTypeProvider,
FastifyTypeProviderDefault,
RawServerBase,
RawServerDefault,
} from "fastify";

import { ApolloServer,BaseContext } from "@apollo/server";
import type { WithRequired } from "@apollo/utils.withrequired";
import fp,{ PluginMetadata } from "fastify-plugin";

import { getGraphQLHTTPJsonParser } from "./graphql-http-json-parser.js";
import { fastifyApolloHandler } from "./handler.js";
import { ApolloFastifyPluginOptions } from "./types.js";

const pluginMetadata: PluginMetadata = {
	fastify: "^4.4.0",
	name: "@as-integrations/fastify",
};

export function fastifyApollo<
	RawServer extends RawServerBase = RawServerDefault,
	TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
>(
	apollo: ApolloServer<BaseContext>,
): FastifyPluginAsync<
	Omit<ApolloFastifyPluginOptions<BaseContext, RawServer>, "context">,
	RawServer,
	TypeProvider
>;

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
>;

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
	if (apollo === undefined || apollo === null || !(apollo instanceof ApolloServer<Context>)) {
		throw new TypeError("You must pass in an instance of `ApolloServer`.");
	}

	apollo.assertStarted("fastifyApollo()");

	return fp(async (fastify, options) => {
		const { path = "/graphql", method = ["GET", "POST", "OPTIONS"], ...handlerOptions } = options;

		// Fastify has a default JSON parser that throws a specific error when the body is empty.
		// A GraphQL server which is spec compliant (per the graphql-over-http spec) should respond
		// with a JSON object with an `errors` key when the body is empty.
		fastify.removeContentTypeParser(["application/json"]);
		// @ts-ignore
		// TODO: Something with all the Fastify generics is messing up the types with the `fastify` object
		fastify.addContentTypeParser(
			"application/json",
			{ parseAs: "string" },
			// @ts-ignore
			getGraphQLHTTPJsonParser(fastify),
		);

		fastify.route({
			method,
			url: path,
			handler: fastifyApolloHandler<Context, RawServer>(apollo, handlerOptions),
		});
	}, pluginMetadata);
}
