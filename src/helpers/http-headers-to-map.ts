import type { IncomingHttpHeaders } from "node:http"
import type { HTTPGraphQLRequest } from "@apollo/server"

export const httpHeadersToMap = (headers: IncomingHttpHeaders): HTTPGraphQLRequest["headers"] => {
	const map = new Map<string, string>()

	for (const [key, value] of Object.entries(headers)) {
		if (value) {
			map.set(key, (Array.isArray(value) ? value.join(", ") : value).toLowerCase())
		}
	}

	return map
}
