import { ApolloServer } from "@apollo/server";
import fastifyApollo, { fastifyApolloDrainPlugin } from "@as-integrations/fastify";
import compress from "@fastify/compress";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import Fastify from "fastify";

import { MyContext, myContextFunction } from "./context";
import resolvers from "./resolvers";
import typeDefs from "./type-defs";

const fastify = await Fastify();

const apollo = new ApolloServer<MyContext>({
	typeDefs,
	resolvers,
	plugins: [fastifyApolloDrainPlugin(fastify)],
});

await apollo.start();

await fastify.register(rateLimit);
await fastify.register(helmet);
await fastify.register(cors);
await fastify.register(compress);

await fastify.register(fastifyApollo(apollo), {
	context: myContextFunction,
});

// OR

// fastify.post("/graphql", fastifyApolloHandler(apollo, {
// 	context: myContextFunction,
// }))

await fastify.listen({
	port: 8080,
});
