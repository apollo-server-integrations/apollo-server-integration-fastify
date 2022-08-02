import type { HTTPGraphQLRequest } from "@apollo/server"
import type { RouteGenericInterface } from "fastify/types/route"
import type { FastifyRequest, RawServerBase, RawServerDefault } from "fastify"

import { httpHeadersToMap } from "./http-headers-to-map"

export const fastifyRequestToGraphQL =
	<RawServer extends RawServerBase = RawServerDefault>(request: FastifyRequest<RouteGenericInterface, RawServer>): HTTPGraphQLRequest => {
		console.log({
			"request.url": request.url,
			"request.query": request.query,
			"request.params": request.params,
			"new-URL(request.url)-search": new URL(request.url).search,
		})
		return ({
			body: request.body,
			method: request.method.toUpperCase(),
			search: request.query as string ?? "",
			headers: httpHeadersToMap(request.headers),
		})
	}