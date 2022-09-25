import { ApolloFastifyContextFunction } from "../src";

export interface MyContext {
	greeting: string;
}

export const myContextFunction: ApolloFastifyContextFunction<MyContext> = async () => ({
	greeting: "Hello World!!",
});
