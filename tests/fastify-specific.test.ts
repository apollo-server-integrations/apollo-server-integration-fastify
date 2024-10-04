import { ApolloServer } from "@apollo/server";
import fastifyApollo, { fastifyApolloHandler } from "../src/index.js";

describe("fastify specific tests", () => {
	it("not passing in a correct instance throws", async () => {
		const errorString = "You must pass in an instance of `ApolloServer`.";

		// @ts-expect-error
		expect(() => fastifyApollo(undefined)).toThrowError(errorString);
		// @ts-expect-error
		expect(() => fastifyApolloHandler(undefined)).toThrowError(errorString);
		// @ts-expect-error
		expect(() => fastifyApollo(null)).toThrowError(errorString);
		// @ts-expect-error
		expect(() => fastifyApolloHandler(null)).toThrowError(errorString);
		// @ts-expect-error
		// eslint-disable-next-line no-new-object
		expect(() => fastifyApollo(new Object())).toThrowError(errorString);
		// @ts-expect-error
		// eslint-disable-next-line no-new-object
		expect(() => fastifyApolloHandler(new Object())).toThrowError(errorString);
	});

	it("not calling start causes a clear error", async () => {
		const apollo = new ApolloServer({ typeDefs: "type Query {f: ID}" });

		expect(() => fastifyApollo(apollo)).toThrowError(
			"You must `await server.start()` before calling `fastifyApollo()`",
		);

		expect(() => fastifyApolloHandler(apollo)).toThrowError(
			"You must `await server.start()` before calling `fastifyApolloHandler()`",
		);
	});
});
