<a href='https://www.apollographql.com/'><img src='https://avatars.githubusercontent.com/u/17189275?s=200' style="border-radius: 6px; margin-right: 6px" height='100' alt='Apollo Server'></a>
<a href='https://www.fastify.io/'><img src='https://avatars.githubusercontent.com/u/24939410?s=200' style="border-radius: 6px" height='100' alt='Fastify'></a>

[![NPM version](https://badge.fury.io/js/@as-integrations%2Ffastify.svg)](https://www.npmjs.com/package/@as-integrations/fastify)
[![NPM downloads](https://img.shields.io/npm/dm/@as-integrations/fastify.svg?style=flat)](https://www.npmjs.com/package/@as-integrations/fastify)

# Apollo Server Integration for Fastify

## **Introduction**

**An Apollo Server integration for use with Fastify.**

This is a simple package that easily allows you to connect your own Fastify server implementation to an Apollo Server instance.

## **Requirements**

- **[Node.js v16](https://nodejs.org/)** or later
- **[Fastify v4.4](https://www.fastify.io/)** or later
- **[GraphQL.js v16](https://graphql.org/graphql-js/)** or later
- **[Apollo Server v4](https://www.apollographql.com/docs/apollo-server/)** or later

## **Installation**

```bash
npm install @as-integrations/fastify @apollo/server graphql fastify
```

## **Usage**

Setup [Fastify](https://www.fastify.io/) & [Apollo Server](https://www.apollographql.com/docs/apollo-server/) like you usually would and then connect the two by using the `fastifyApollo` plugin:

```typescript
import Fastify from "fastify";
import { ApolloServer, BaseContext } from "@apollo/server";
import fastifyApollo, { fastifyApolloDrainPlugin } from "@as-integrations/fastify";
// ...

const fastify = Fastify();

const apollo = new ApolloServer<BaseContext>({
  typeDefs,
  resolvers,
  plugins: [fastifyApolloDrainPlugin(fastify)],
});

await apollo.start();

// ...

await fastify.register(fastifyApollo(apollo));
```

Note: **You must call and await `apollo.start()` before using the integration.**

Alternatively you can use the exported function `fastifyApolloHandler` which can be passed into any [Fastify route handler](https://www.fastify.io/docs/latest/Reference/Routes/).
This allows you to explicitly set all routing options like the URL path and accepted methods.

Examples shown below:

```typescript
import { fastifyApolloHandler } from "@as-integrations/fastify";

// ... setup Fastify & Apollo

fastify.post("/graphql", fastifyApolloHandler(apollo));
// OR
fastify.get("/api", fastifyApolloHandler(apollo));
// OR
fastify.route({
  url: "/graphql",
  method: ["POST", "OPTIONS"],
  handler: fastifyApolloHandler(apollo),
});
```

Please see the [example](https://github.com/apollo-server-integrations/apollo-server-integration-fastify/tree/main/example).

## **Context**

Apollo Server v4 has moved context setup outside of the `ApolloServer` constructor.

Define your own context function and pass it in to the `context` option. The function accepts two arguments - request and reply. They are of type `FastifyRequest` and `FastifyReply` respectively. Whatever is returned from the function will be passed to the `context` argument in your resolvers.

For example:

```typescript
import { ApolloServer } from "@apollo/server";

import fastifyApollo, {
  fastifyApolloHandler,
  ApolloFastifyContextFunction,
} from "@as-integrations/fastify";
// ...

interface MyContext {
  authorization: JWTPayload | false;
}

const apollo = new ApolloServer<MyContext>(...);

const myContextFunction: ApolloFastifyContextFunction<MyContext> = async (request, reply) => ({
  authorization: await isAuthorized(request.headers.authorization),
});

await fastify.register(fastifyApollo(apollo), {
  context: myContextFunction,
});

// OR

await fastify.post("/graphql", fastifyApolloHandler(apollo, {
  context: myContextFunction,
}));
```

```ts
// Access the context in your resolvers
export const resolvers = {
  Query: {
    helloWorld: (parent, args, context, info) => {
      if (!context.authorization) {
        throw new Error("Not authorized");
      }
      
      return "Hello world :)";
    },
  },
};
```

## **API**

All options and generics are optional other than passing in the `ApolloServer` instance.

### `fastifyApollo`

```typescript
function fastifyApollo<Context extends BaseContext = BaseContext>(
  apollo: ApolloServer<Context>,
): FastifyPluginAsync<ApolloFastifyPluginOptions<Context>>;
```

### `fastifyApolloHandler`

```typescript
function fastifyApolloHandler<Context extends BaseContext = BaseContext>(
  apollo: ApolloServer<Context>,
  options?: ApolloFastifyHandlerOptions<Context>,
): RouteHandlerMethod;
```

### `ApolloFastifyContextFunction`

```typescript
type ApolloFastifyContextFunction<Context> = (
  request: FastifyRequest,
  reply: FastifyReply,
) => Promise<Context>;
```

### `ApolloFastifyHandlerOptions`

```typescript
interface ApolloFastifyHandlerOptions<Context extends BaseContext = BaseContext> {
  context?: ApolloFastifyContextFunction<Context>; // default: async () => ({})
}
```

### `ApolloFastifyPluginOptions`

```typescript
interface ApolloFastifyPluginOptions<Context extends BaseContext = BaseContext>
  extends ApolloFastifyHandlerOptions<Context> {
  path?: string; // default: "/graphql"
  method?: HTTPMethod | HTTPMethod[]; // default: ["GET", "POST", "OPTIONS"]
}
```

[`HTTPMethod`](https://www.fastify.io/docs/latest/Reference/TypeScript/#fastifyhttpmethods) is exported from Fastify.

## **HTTPS/HTTP2**

All functions and types optionally allow you to pass in or infer a `Server` type from Fastify.

## **Node.JS v16**

Please pass in `forceCloseConnections: true` to Fastify in combination with `fastifyApolloDrainPlugin` to correctly shutdown you're server on close and not hang incoming requests.

## **Contributors**

- Oliver Plummer ([olyop](https://github.com/olyop))
- Trevor Scheer ([trevor-scheer](https://github.com/trevor-scheer))
