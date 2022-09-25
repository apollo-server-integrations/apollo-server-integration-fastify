import type { OutgoingHttpHeaders } from "node:http";
import type { HTTPGraphQLRequest } from "@apollo/server";

export const mapToHttpHeaders = (map: HTTPGraphQLRequest["headers"]) => {
	const headers: OutgoingHttpHeaders = {};

	for (const [key, value] of map) {
		headers[key] = value;
	}

	return headers;
};
