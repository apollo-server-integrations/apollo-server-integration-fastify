import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import compress from "@fastify/compress";
import rateLimit from "@fastify/rate-limit";
import { ApolloServer } from "@apollo/server";

import fastifyApollo, {
	fastifyApolloHandler,
	fastifyApolloDrainPlugin,
} from "@as-integrations/fastify";

import typeDefs from "./type-defs";
import resolvers from "./resolvers";
import { myContextFunction, MyContext } from "./context";

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
