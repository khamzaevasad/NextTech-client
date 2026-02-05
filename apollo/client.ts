// lib/apollo-client.ts
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  split,
  from,
  NormalizedCacheObject,
} from "@apollo/client";
import createUploadLink from "apollo-upload-client/public/createUploadLink.js";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { onError } from "@apollo/client/link/error";
import { getJwtToken } from "@/lib/auth";

function getHeaders() {
  const headers = {} as HeadersInit;
  const token = getJwtToken();
  if (token) {
    // @ts-expect-error HeadersInit
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// Client-ni yaratuvchi asosiy funksiya
export const createApolloClient = () => {
  const authLink = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }) => ({
      headers: { ...headers, ...getHeaders() },
    }));
    return forward(operation);
  });

  // @ts-expect-error upload link types
  const httpLink = new createUploadLink({
    uri: process.env.NEXT_PUBLIC_API_GRAPHQL_URL,
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message }) =>
        console.log(`[GraphQL error]: ${message}`),
      );
    }
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

  // WebSocket faqat brauzerda ishlaydi
  const splitLink =
    typeof window !== "undefined"
      ? split(
          ({ query }) => {
            const definition = getMainDefinition(query);
            return (
              definition.kind === "OperationDefinition" &&
              definition.operation === "subscription"
            );
          },
          new WebSocketLink({
            uri: process.env.NEXT_PUBLIC_API_WS || "ws://127.0.0.1:3007",
            options: {
              reconnect: true,
              connectionParams: () => ({ headers: getHeaders() }),
            },
          }),
          authLink.concat(httpLink),
        )
      : httpLink;

  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: from([errorLink, splitLink]),
    cache: new InMemoryCache(),
  });
};
