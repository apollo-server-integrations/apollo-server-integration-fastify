import { ApolloServer } from "@apollo/server";

import fastifyApollo, { fastifyApolloHandler } from "../src";

it("not calling start causes a clear error", async () => {
	const apollo = new ApolloServer({ typeDefs: "type Query {f: ID}" });
	expect(() => fastifyApollo(apollo)).toThrowError(
		"You must `await server.start()` before calling `fastifyApollo()`",
	);
	expect(() => fastifyApolloHandler(apollo)).toThrowError(
		"You must `await server.start()` before calling `fastifyApolloHandler()`",
	);
});
