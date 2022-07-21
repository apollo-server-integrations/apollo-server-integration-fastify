import type { IncomingHttpHeaders } from "node:http"
import type { HTTPGraphQLRequest } from "@apollo/server"

export const httpHeadersToMap =
	(headers: IncomingHttpHeaders): HTTPGraphQLRequest["headers"] => {
		const headersMap = new Map<string, string>()

		for (const [key, value] of Object.entries(headers)) {
			if (value !== undefined) {
				headersMap.set(
					key,
					Array.isArray(value) ? value.join(", ") : value,
				)
			}
		}

		return headersMap
	}