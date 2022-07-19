import { IncomingHttpHeaders } from "http"

const mapToHttpHeaders =
	(map: Map<string, string>) => {
		const headers: IncomingHttpHeaders = {}

		for (const [key, value] of map) {
			headers[key] = value
		}

		return headers
	}

export default mapToHttpHeaders