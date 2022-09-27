import Fastify from "fastify";
import { ApolloServer, ApolloServerOptions, BaseContext } from "@apollo/server";
import {
	CreateServerForIntegrationTestsOptions,
	defineIntegrationTestSuite,
} from "@apollo/server-integration-testsuite";

import { FASTIFY_LISTEN_OPTIONS, METHODS } from "./options";
import fastifyApollo, { fastifyApolloDrainPlugin } from "../src";

defineIntegrationTestSuite(
	async (
		serverOptions: ApolloServerOptions<BaseContext>,
		testOptions?: CreateServerForIntegrationTestsOptions,
	) => {
		const fastify = Fastify();

		const apollo = new ApolloServer({
			...serverOptions,
			plugins: [...(serverOptions.plugins ?? []), fastifyApolloDrainPlugin(fastify)],
		});

		await apollo.start();

		const options = testOptions?.context ? { context: testOptions?.context } : {};

		await fastify.register(fastifyApollo(apollo), {
			...options,
			path: "/",
			method: METHODS,
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
