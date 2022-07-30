import type { IncomingHttpHeaders } from "node:http"
import type { HTTPGraphQLRequest } from "@apollo/server"

export const mapToHttpHeaders =
	(map: HTTPGraphQLRequest["headers"]) => {
		const headers: IncomingHttpHeaders = {}

		for (const [key, value] of map) {
			headers[key] = value
		}

		return headers
	}