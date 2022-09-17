import Fastify from "fastify"
import { ApolloServer, ApolloServerOptions, BaseContext } from "@apollo/server"
import { CreateServerForIntegrationTestsOptions, defineIntegrationTestSuite } from "@apollo/server-integration-testsuite"

import { fastifyDrainPlugin } from "../src"
import { fastifyApolloHandler } from "../src/handler"

defineIntegrationTestSuite(async (
	serverOptions: ApolloServerOptions<BaseContext>,
	testOptions?: CreateServerForIntegrationTestsOptions,
) => {
	const fastify = Fastify()

	const apollo = new ApolloServer({
		...serverOptions,
		plugins: [
			...(serverOptions.plugins ?? []),
			fastifyDrainPlugin(fastify),
		],
	})

	await apollo.start()

	fastify.route({
		// Note: we register for HEAD mostly because the integration test suite
		// ensures that our middleware appropriate rejects such requests. In your
		// app, you would only want to register for GET and POST.
		method: ["GET", "POST", "HEAD"],
		url: "/",
		// @ts-ignore TODO: something up with the context typings
		handler: fastifyApolloHandler(
			apollo,
			{ context: testOptions?.context },
		),
	})

	const url = await fastify.listen({ port: 0 })

	return {
		server: apollo,
		url,
	}
})