import type { RawServerBase } from "fastify"
import type { BaseContext } from "@apollo/server"

import { ApolloFastifyContextFunction } from "../types"

export * from "./map-to-http-headers"
export * from "./http-headers-to-map"
export * from "./fastify-request-to-graphql"

/**
 * Strange functions to fix strict typescript errors...
 */

export const isFunction =
	(value: unknown): value is () => unknown =>
		(value ? {}.toString.call(value) === "[object Function]" : false)

export const isContextFunction =
	<Context extends BaseContext, RawServer extends RawServerBase>(value: unknown): value is ApolloFastifyContextFunction<Context, RawServer> =>
		(value ? {}.toString.call(value) === "[object Function]" : false)

export const isPromise =
	(value: unknown): value is Promise<unknown> => (
		value ?
			Object.prototype.toString.call(value) === "[object Promise]" :
			false
	)