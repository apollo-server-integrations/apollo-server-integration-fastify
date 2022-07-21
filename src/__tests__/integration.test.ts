import { createServer } from "http"
import { urlForHttpServer } from "@apollo/server/src/utils/urlForHttpServer"
import { ApolloServer, ApolloServerOptions, BaseContext } from "@apollo/server"
import {
	defineIntegrationTestSuite,
	CreateServerForIntegrationTestsOptions,
} from "@apollo/server-integration-testsuite"

import { apolloFastifyHandler } from ".."
import { createMockServer as createAPIGatewayMockServer } from "./mock-api-gateway-server"

describe("Fastify integration", () => {
	defineIntegrationTestSuite(
		async (options: ApolloServerOptions<BaseContext>, testOptions?: CreateServerForIntegrationTestsOptions) => {
			const server = new ApolloServer({
				...options,
				plugins: [
					...(options.plugins ?? []),
				],
			})

			await server.start()

			const handler = apolloFastifyHandler(server, {
				context: testOptions?.context,
			})

			const httpServerHandler = createAPIGatewayMockServer(handler)
			const httpServer = createServer(httpServerHandler)

			httpServer.listen(0)

			return {
				server,
				url: urlForHttpServer(httpServer),
			}
		},
		{
			serverIsStartedInBackground: true,
		},
	)
})