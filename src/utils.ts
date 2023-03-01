import { ApolloServer } from "@apollo/server";

export function isApolloServerLike(maybeServer: unknown): maybeServer is ApolloServer {
	return !!(maybeServer && typeof maybeServer === "object" && "assertStarted" in maybeServer);
}
