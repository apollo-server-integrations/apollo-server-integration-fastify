import Fastify from "fastify";
import { ApolloServer, ApolloServerOptions, BaseContext } from "@apollo/server";
import {
	CreateServerForIntegrationTestsOptions,
	defineIntegrationTestSuite,
} from "@apollo/server-integration-testsuite";

import fastifyApollo, { fastifyApolloDrainPlugin } from "../src";
import { FASTIFY_LISTEN_OPTIONS, METHODS, serializerLikeBodyParser } from "./options";

defineIntegrationTestSuite(
	async (
		serverOptions: ApolloServerOptions<BaseContext>,
		testOptions?: CreateServerForIntegrationTestsOptions,
	) => {
		const fastify = Fastify();

		fastify.setSerializerCompiler(serializerLikeBodyParser);

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
