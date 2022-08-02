import type { HTTPGraphQLRequest } from "@apollo/server"
import type { RouteGenericInterface } from "fastify/types/route"
import type { FastifyRequest, RawServerBase, RawServerDefault } from "fastify"

import { httpHeadersToMap } from "./http-headers-to-map"

export const fastifyRequestToGraphQL =
	<RawServer extends RawServerBase = RawServerDefault>(request: FastifyRequest<RouteGenericInterface, RawServer>): HTTPGraphQLRequest => ({
		body: request.body,
		method: request.method.toUpperCase(),
		headers: httpHeadersToMap(request.headers),
		search: new URL(request.url).search ?? "",
	})