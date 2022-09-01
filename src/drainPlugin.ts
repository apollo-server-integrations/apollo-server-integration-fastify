// Add this plugin to your ApolloServer to drain the server during shutdown.
// This works best with Node 18.2.0 or newer; with that version, Fastify will
// use the new server.closeIdleConnections() to close idle connections, and the
// plugin will close any other connections 10 seconds later. (With older Node,
// the drain phase will hang until all connections naturally close; you can also
// call `fastify({forceCloseConnections: true})` to make all connections immediately
// close without grace.)

import { ApolloServerPlugin, BaseContext } from "@apollo/server";
import { FastifyInstance } from "fastify";

export function fastifyDrainPlugin<TContext extends BaseContext>(
  app: FastifyInstance,
): ApolloServerPlugin<TContext> {
  return {
    async serverWillStart() {
      return {
        async drainServer() {
          let timeout;
          if ("closeAllConnections" in app.server) {
            timeout = setTimeout(
              () => (app.server as any).closeAllConnections(),
              10_000,
            );
          }
          await app.close();
          if (timeout) {
            clearTimeout(timeout);
          }
        },
      };
    },
  };
}