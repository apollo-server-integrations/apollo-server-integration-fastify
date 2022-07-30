import type { HTTPGraphQLRequest } from "@apollo/server"

export const mapToHttpHeaders =
	(map: HTTPGraphQLRequest["headers"]) => {
		const headers: Record<string, unknown> = {}

		for (const [key, value] of map) {
			headers[key] = value
		}

		return headers
	}