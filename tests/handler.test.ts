import { ApolloServer, ApolloServerOptions, BaseContext } from "@apollo/server";
import {
	CreateServerForIntegrationTestsOptions,
	defineIntegrationTestSuite,
} from "@apollo/server-integration-testsuite";
import Fastify from "fastify";

import {
	ApolloFastifyContextFunction,
	fastifyApolloDrainPlugin,
	fastifyApolloHandler,
	getGraphQLHTTPJsonParser,
} from "../src/index.js";
import { FASTIFY_LISTEN_OPTIONS, METHODS } from "./options.js";

defineIntegrationTestSuite(
	async (
		serverOptions: ApolloServerOptions<BaseContext>,
		testOptions?: CreateServerForIntegrationTestsOptions,
	) => {
		const fastify = Fastify();

		// Fastify has a default JSON parser that throws a specific error when the body is empty.
		// A GraphQL server which is spec compliant (per the graphql-over-http spec) should respond
		// with a JSON object with an `errors` key when the body is empty.
		fastify.removeContentTypeParser(["application/json"]);
		fastify.addContentTypeParser(
			"application/json",
			{ parseAs: "string" },
			getGraphQLHTTPJsonParser(fastify),
		);

		const apollo = new ApolloServer({
			...serverOptions,
			plugins: [...(serverOptions.plugins ?? []), fastifyApolloDrainPlugin(fastify)],
		});

		await apollo.start();

		fastify.route({
			url: "/",
			method: METHODS,
			handler: fastifyApolloHandler(apollo, {
				context: testOptions?.context as ApolloFastifyContextFunction<BaseContext>,
			}),
		});

		const url = await fastify.listen(FASTIFY_LISTEN_OPTIONS);

		return {
			server: apollo,
			url,
		};
	},
	{
		noIncrementalDelivery: true,
	},
);
