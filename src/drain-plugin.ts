import type { ApolloServerPlugin, BaseContext } from "@apollo/server";
import type {
	FastifyBaseLogger,
	FastifyInstance,
	FastifyTypeProvider,
	FastifyTypeProviderDefault,
	RawReplyDefaultExpression,
	RawRequestDefaultExpression,
	RawServerBase,
	RawServerDefault,
} from "fastify";

// Add this plugin to your ApolloServer to drain the server during shutdown.
// This works best with Node 18.2.0 or newer with that version, Fastify will
// use the new server.closeIdleConnections() to close idle connections, and the
// plugin will close any other connections 10 seconds later. (With older Node,
// the drain phase will hang until all connections naturally close you can also
// call `fastify({forceCloseConnections: true})` to make all connections immediately
// close without grace.)

export function fastifyApolloDrainPlugin<
	Context extends BaseContext,
	RawServer extends RawServerBase = RawServerDefault,
	RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
	RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
	Logger extends FastifyBaseLogger = FastifyBaseLogger,
	TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
>(fastify: FastifyInstance<RawServer, RawRequest, RawReply, Logger, TypeProvider>): ApolloServerPlugin<Context> {
	return {
		async serverWillStart() {
			return {
				async drainServer() {
					// `closeAllConnections` was added in v18.2 - @types/node are v16.
					if ("closeAllConnections" in fastify.server) {
						const timeout = setTimeout(() => {
							// eslint-disable-next-line
							(fastify.server as any).closeAllConnections();
						}, 10_000);
						await fastify.close();
						clearTimeout(timeout);
					}
				},
			};
		},
	};
}
