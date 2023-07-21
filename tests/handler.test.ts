import { ApolloServer, ApolloServerOptions, BaseContext } from "@apollo/server";
import {
	CreateServerForIntegrationTestsOptions,
	defineIntegrationTestSuite,
} from "@apollo/server-integration-testsuite";
import { fastify as Fastify } from "fastify";

import { ApolloFastifyContextFunction, fastifyApolloDrainPlugin, fastifyApolloHandler } from "../src/index.js";
import { FASTIFY_LISTEN_OPTIONS, METHODS } from "./options.js";

defineIntegrationTestSuite(
	async (serverOptions: ApolloServerOptions<BaseContext>, testOptions?: CreateServerForIntegrationTestsOptions) => {
		const fastify = Fastify();

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
);
