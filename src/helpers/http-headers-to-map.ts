import type { IncomingHttpHeaders } from "node:http";
import { HeaderMap, HTTPGraphQLRequest } from "@apollo/server";

export const httpHeadersToMap = (headers: IncomingHttpHeaders): HTTPGraphQLRequest["headers"] => {
	const map = new HeaderMap();

	for (const [key, value] of Object.entries(headers)) {
		if (value) {
			map.set(key, Array.isArray(value) ? value.join(", ") : value);
		}
	}

	return map;
};
