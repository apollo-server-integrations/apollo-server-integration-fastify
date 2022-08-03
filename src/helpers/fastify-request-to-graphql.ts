import url from "node:url"
import type { HTTPGraphQLRequest } from "@apollo/server"
import type { RouteGenericInterface } from "fastify/types/route"
import type { FastifyRequest, RawServerBase, RawServerDefault } from "fastify"

import { httpHeadersToMap } from "./http-headers-to-map"

export const fastifyRequestToGraphQL =
	<RawServer extends RawServerBase = RawServerDefault>(request: FastifyRequest<RouteGenericInterface, RawServer>): HTTPGraphQLRequest => {
		console.log(request)
		return ({
			body: request.body,
			method: request.method.toUpperCase(),
			search: url.parse(request.url).search ?? "",
			headers: httpHeadersToMap(request.headers),
		})
	}