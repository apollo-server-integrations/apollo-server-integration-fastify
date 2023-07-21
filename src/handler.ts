import { Readable } from "node:stream";

import { ApolloServer, BaseContext } from "@apollo/server";
import type { WithRequired } from "@apollo/utils.withrequired";
import type {
	ContextConfigDefault,
	FastifyBaseLogger,
	FastifySchema,
	FastifyTypeProvider,
	FastifyTypeProviderDefault,
	RawReplyDefaultExpression,
	RawRequestDefaultExpression,
	RawServerBase,
	RawServerDefault,
	RouteGenericInterface,
	RouteHandlerMethod,
} from "fastify";

import { fastifyRequestToGraphQLRequest } from "./fastify-request-to-graphql-request.js";
import { ApolloFastifyContextFunction, ApolloFastifyHandlerOptions } from "./types.js";
import { isApolloServerLike } from "./utils.js";

interface RouteInterface extends RouteGenericInterface {
	Reply: string;
}

export function fastifyApolloHandler<
	RawServer extends RawServerBase = RawServerDefault,
	RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
	RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
	ContextConfig = ContextConfigDefault,
	SchemaCompiler extends FastifySchema = FastifySchema,
	TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
	Logger extends FastifyBaseLogger = FastifyBaseLogger,
>(
	apollo: ApolloServer<BaseContext>,
): RouteHandlerMethod<
	RawServer,
	RawRequest,
	RawReply,
	RouteInterface,
	ContextConfig,
	SchemaCompiler,
	TypeProvider,
	Logger
>;

export function fastifyApolloHandler<
	Context extends BaseContext,
	RawServer extends RawServerBase = RawServerDefault,
	RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
	RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
	ContextConfig = ContextConfigDefault,
	SchemaCompiler extends FastifySchema = FastifySchema,
	TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
	Logger extends FastifyBaseLogger = FastifyBaseLogger,
>(
	apollo: ApolloServer<Context>,
	options: WithRequired<ApolloFastifyHandlerOptions<Context, RawServer>, "context">,
): RouteHandlerMethod<
	RawServer,
	RawRequest,
	RawReply,
	RouteInterface,
	ContextConfig,
	SchemaCompiler,
	TypeProvider,
	Logger
>;

export function fastifyApolloHandler<
	Context extends BaseContext,
	RawServer extends RawServerBase = RawServerDefault,
	RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
	RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
	ContextConfig = ContextConfigDefault,
	SchemaCompiler extends FastifySchema = FastifySchema,
	TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
	Logger extends FastifyBaseLogger = FastifyBaseLogger,
>(
	apollo: ApolloServer<Context>,
	options?: ApolloFastifyHandlerOptions<Context, RawServer>,
): RouteHandlerMethod<
	RawServer,
	RawRequest,
	RawReply,
	RouteInterface,
	ContextConfig,
	SchemaCompiler,
	TypeProvider,
	Logger
> {
	if (apollo === undefined || apollo === null || !isApolloServerLike(apollo)) {
		throw new TypeError("You must pass in an instance of `ApolloServer`.");
	}

	apollo.assertStarted("fastifyApolloHandler()");

	const defaultContext: ApolloFastifyContextFunction<Context, RawServer> = () => Promise.resolve({} as Context);

	const contextFunction = options?.context ?? defaultContext;

	return async (request, reply) => {
		const httpGraphQLResponse = await apollo.executeHTTPGraphQLRequest({
			httpGraphQLRequest: fastifyRequestToGraphQLRequest<RawServer>(request),
			context: () => contextFunction(request, reply),
		});

		const { headers, body, status } = httpGraphQLResponse;

		for (const [headerKey, headerValue] of headers) {
			void reply.header(headerKey, headerValue);
		}

		void reply.code(status === undefined ? 200 : status);

		if (body.kind === "complete") {
			return body.string;
		}

		const readable = Readable.from(body.asyncIterator);
		// @ts-ignore something wrong with the `ReplyType` but not sure what
		return reply.send(readable);
	};
}
