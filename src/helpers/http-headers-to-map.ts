import type { IncomingHttpHeaders } from "http"

export const httpHeadersToMap =
	(headers: IncomingHttpHeaders) => {
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