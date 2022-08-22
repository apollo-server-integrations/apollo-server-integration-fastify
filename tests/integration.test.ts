import Fastify from "fastify"
import { ApolloServer, ApolloServerOptions, BaseContext } from "@apollo/server"
import { defineIntegrationTestSuite } from "@apollo/server-integration-testsuite"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"

import { fastifyApollo } from "../src/plugin"
import { ApolloFastifyPluginOptions } from "../src/types"
import { Server } from "http"
import { AddressInfo } from "net"
import { format } from "url"

interface MyContext {
	foo: "bar",
}

defineIntegrationTestSuite(async (
	serverOptionsNoGeneric: ApolloServerOptions<BaseContext>,
	testsOptionsNoGeneric?: ApolloFastifyPluginOptions<BaseContext>,
) => {
	const serverOptions = serverOptionsNoGeneric as ApolloServerOptions<MyContext>
	const testsOptions = testsOptionsNoGeneric as ApolloFastifyPluginOptions<MyContext>

	const fastify = Fastify()

	const apollo = new ApolloServer({
		...serverOptions,
		plugins: [
			...(serverOptions.plugins ?? []),
			ApolloServerPluginDrainHttpServer({
				httpServer: fastify.server,
			}),
		],
	})

	await apollo.start()

	if (testsOptions?.context) {
		await fastify.register(fastifyApollo(apollo), { context: testsOptions.context })
	} else {
		await fastify.register(fastifyApollo(apollo))
	}

	await fastify.listen()

	const apolloNoGeneric = (apollo as unknown) as ApolloServer<BaseContext>

	return {
		server: apolloNoGeneric,
		url: urlForHttpServer(fastify.server),
	}
})

function urlForHttpServer(httpServer: Server): string {
  const { address, port } = httpServer.address() as AddressInfo;

  // Convert IPs which mean "any address" (IPv4 or IPv6) into localhost
  // corresponding loopback ip. Note that the url field we're setting is
  // primarily for consumption by our test suite. If this heuristic is wrong for
  // your use case, explicitly specify a frontend host (in the `host` option
  // when listening).
  const hostname = address === '' || address === '::' ? 'localhost' : address;

  return format({
    protocol: 'http',
    hostname,
    port,
    pathname: '/',
  });
}