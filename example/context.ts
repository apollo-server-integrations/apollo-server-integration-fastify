import { ApolloFastifyContextFunction } from "@as-integrations/fastify";

export interface MyContext {
	greeting: string;
}

export const myContextFunction: ApolloFastifyContextFunction<MyContext> = async (
	request,
	reply,
) => ({
	greeting: "Hello World!!",
});
