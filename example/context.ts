import { ApolloFastifyContextFunction } from "@as-integrations/fastify";

export interface MyContext {
	greeting: string;
}

export const myContextFunction: ApolloFastifyContextFunction<MyContext> = async () => ({
	greeting: "Hello World!!",
});
