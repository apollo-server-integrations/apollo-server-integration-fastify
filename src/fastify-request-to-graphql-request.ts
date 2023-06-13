import type { IncomingHttpHeaders } from "node:http";

import { HTTPGraphQLRequest, HeaderMap } from "@apollo/server";
import type { FastifyRequest, RawServerBase, RawServerDefault, RouteGenericInterface } from "fastify";

const httpHeadersToMap = (headers: IncomingHttpHeaders) => {
	const map = new HeaderMap();

	for (const [key, value] of Object.entries(headers)) {
		if (value) {
			map.set(key, Array.isArray(value) ? value.join(", ") : value);
		}
	}

	return map;
};

export const fastifyRequestToGraphQLRequest = <RawServer extends RawServerBase = RawServerDefault>(
	request: FastifyRequest<RouteGenericInterface, RawServer>,
): HTTPGraphQLRequest => ({
	body: request.body,
	method: request.method.toUpperCase(),
	headers: httpHeadersToMap(request.headers),
	search: new URL(request.url, `${request.protocol}://${request.hostname}/`).search,
});
