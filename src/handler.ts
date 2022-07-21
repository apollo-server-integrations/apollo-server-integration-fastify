import type { RouteHandlerMethod } from "fastify"
import type { ApolloServer, HTTPGraphQLRequest } from "@apollo/server"

import {
	ApolloFastifyHandlerOptions,
	ApolloFastifyContextFunction,
} from "./types"

import { httpHeadersToMap } from "./helpers/http-headers-to-map"
import { mapToHttpHeaders } from "./helpers/map-to-http-headers"

export const apolloFastifyHandler = <Context>(
	apollo: ApolloServer<Context>,
	options?: ApolloFastifyHandlerOptions<Context>,
): RouteHandlerMethod =>
	async (request, reply) => {
		const defaultContext: ApolloFastifyContextFunction<Context> =
			() => Promise.resolve({} as Context)

		const context =
			options?.context ?? defaultContext

		const body =
			request.method === "POST" ?
				request.body : request.query

		const httpGraphQLRequest: HTTPGraphQLRequest = {
			body,
			searchParams: request.query,
			method: request.method.toUpperCase(),
			headers: httpHeadersToMap(request.headers),
		}

		const httpGraphQLResponse =
			await apollo.executeHTTPGraphQLRequest({
				httpGraphQLRequest,
				context: () => context(request, reply),
			})

		if (httpGraphQLResponse.completeBody === null) {
			throw Error("Incremental delivery not implemented")
		}

		void reply.code(httpGraphQLResponse.statusCode || 200)
		void reply.headers(mapToHttpHeaders(httpGraphQLResponse.headers))

		return httpGraphQLResponse.completeBody
	}