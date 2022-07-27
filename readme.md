<a href='https://www.apollographql.com/'><img src='https://avatars.githubusercontent.com/u/17189275?s=200' style="border-radius: 6px; margin-right: 6px" height='100' alt='Apollo Server'></a>
<a href='https://www.apollographql.com/'><img src='https://avatars.githubusercontent.com/u/24939410?s=200' style="border-radius: 6px" height='100' alt='Apollo Server'></a>

[![npm version](https://badge.fury.io/js/apollo-server-fastify.svg)](https://badge.fury.io/js/@oly_op%2Fapollo-server-fastify.svg)
[![npm downloads](https://img.shields.io/npm/dm/apollo-server-fastify.svg?style=flat)](https://www.npmjs.com/package/@oly_op/apollo-server-fastify.svg)

# Apollo Server Fastify

## Introduction

**This is a community maintained package used to connect Fastify to Apollo GraphQL server.**

This is a simple package that easily allows you to connect you're own Fastify server implementation to an Apollo Server instance.

## Requirements

- **Node.js v14** or later 
- **Fastify v4** or later
- **GraphQL.js v16** or later
- **Apollo Server v4** or later


## Installation

```bash
npm install apollo-server-fastify
```

## Usage

Setup Fastify & Apollo like you usually would and then connect the two by using the `fastifyApollo` plugin: 

```typescript
import Fastify from "fastify"
import { ApolloServer } from "@apollo/server"
import fastifyApollo from "apollo-server-fastify"
...

const fastify = Fastify()
const apollo = new ApolloServer({ typeDefs, resolvers })

await apollo.start()

...

await fastify.register(fastifyApollo(apollo))
```

Alternate usage is to use the exported function `fastifyApolloHandler` which can be used in any Fastify route handler.
This allows you explicitly set all routing options including the URL path and accepted methods.

Many examples shown below:

```typescript
import { fastifyApolloHandler } from "apollo-server-fastify"

...

fastify.post("/graphql", fastifyApolloHandler(apollo))

fastify.get("/api", fastifyApolloHandler(apollo))

fastify.route({
  url: "/graphql",
  method: ["GET", "POST"],
  handler: fastifyApolloHandler(apollo),
})
```

## Context

Apollo Server 4 (AS4) has moved context setup outside of the `ApolloServer` constructor.


Setup context by defining you're own context function and pass it in to the `context` option. For example:

```typescript
import fastifyApollo, { ApolloFastifyContextFunction } from "apollo-server-fastify"
...

interface MyContext {
  authorization: JWTPayload | false,
}

const myContextFunction: ApolloFastifyContextFunction<MyContext> = async request => ({
  authorization: await isAuthorization(request.headers.authorization),
})

await fastify.register(fastifyApollo(apollo), {
  context: myContextFunction,
})
```

## API

### `fastifyApollo` (default export)

```typescript
function fastifyApollo<Context extends BaseContext = BaseContext>(
  apollo: ApolloServer<Context>,
): FastifyPluginAsync<ApolloFastifyPluginOptions<Context>>;
```

### `ApolloFastifyPluginOptions` (all are optional):

- `path`
  - type: `string | undefined`
  - default: `"/graphql"`
- `method`
  - type: `ValueOrArray<"GET" | "POST">`
  - default: `["GET", "POST"]`
- `context`
  - type: `ApolloFastifyContextFunction`
  - default: `async () => ({})`

Type `HTTPMethod` is a type exported from Fastify.

### `fastifyApolloHandler`

```typescript
function fastifyApolloHandler<Context extends BaseContext = BaseContext>(
  apollo: ApolloServer<Context>,
  options?: ApolloFastifyHandlerOptions<Context>,
): RouteHandlerMethod;
```

### `ApolloFastifyHandlerOptions` (all are optional):

- `context`
  - type: `ApolloFastifyContextFunction`
  - default: `async () => ({})`

### `ApolloFastifyContextFunction`
```typescript
type ApolloFastifyContextFunction<Context> = (request: FastifyRequest, reply: FastifyReply) => Promise<Context>;
```


## Contributors

- Oliver Plummer (olyop)