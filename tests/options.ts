import { FastifyListenOptions } from "fastify";

import { ApolloFastifyPluginOptions } from "../src/index.js";

export const METHODS = [
	"GET",
	"POST",
	"OPTIONS",
	// Note: we register for HEAD mostly because the integration
	// test suite ensuresthat ourmiddleware appropriate rejects
	// such requests. In your app, you would only want to register for GET and POST.
	"HEAD",
] as NonNullable<ApolloFastifyPluginOptions["method"]>;

export const FASTIFY_LISTEN_OPTIONS: FastifyListenOptions = {
	port: 0,
	// fastify defaults to listening on "localhost"
	// This should apparently allow testing both ipv4 and ipv6 on any OS.
	// https://nodejs.org/api/net.html#serverlistenport-host-backlog-callback
	// host: "::",
};
