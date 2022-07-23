import url from "node:url"
import type { FastifyRequest } from "fastify"
import type { HTTPGraphQLRequest } from "@apollo/server"

import { httpHeadersToMap } from "./http-headers-to-map"

export const fastifyRequestToGraphQL =
	(request: FastifyRequest): HTTPGraphQLRequest => ({
		body: request.body,
		method: request.method.toUpperCase(),
		headers: httpHeadersToMap(request.headers),
		search: url.parse(request.url).search ?? "",
	})