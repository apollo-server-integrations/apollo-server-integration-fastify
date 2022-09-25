import { FastifyListenOptions } from "fastify";
import { FastifySerializerCompiler } from "fastify/types/schema";

import { ApolloFastifyPluginOptions } from "../src";

// Something's wrong with serializing to JSON in the tests.
// I've tried this and few others including using fast-json-stringify but
// it didn't change it.
export const serializerLikeBodyParser: FastifySerializerCompiler<unknown> =
	() => (payload: unknown) =>
		JSON.stringify(payload);

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
