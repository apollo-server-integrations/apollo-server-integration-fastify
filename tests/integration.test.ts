import Fastify from "fastify"
import { ApolloServer, ApolloServerOptions, BaseContext } from "@apollo/server"
import { defineIntegrationTestSuite } from "@apollo/server-integration-testsuite"
import { urlForHttpServer } from "@apollo/server/dist/esm/utils/urlForHttpServer"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"

import { fastifyApollo } from "../src/plugin"
import { ApolloFastifyPluginOptions } from "../src/types"

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
			ApolloServerPluginDrainHttpServer<MyContext>({
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