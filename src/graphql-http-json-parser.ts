import { FastifyInstance,FastifyReply,FastifyRequest } from "fastify";
import { ContentTypeParserDoneFunction } from "fastify/types/content-type-parser";

export function getGraphQLHTTPJsonParser<T extends FastifyInstance>(fastify: T) {
	const defaultParser = fastify.getDefaultJsonParser("ignore", "ignore");
	return function jsonParser(
		request: FastifyRequest,
		body: string,
		done: ContentTypeParserDoneFunction,
	) {
		if (body === "" || body == null) {
			const error = new Error("body is empty");
			return done(null, { errors: [error], statusCode: 400 });
		}

		try {
			return defaultParser(request, body, done);
		} catch (error: unknown) {
			(error as FastifyReply).statusCode = 400;
			return done(error as Error);
		}
	};
}
