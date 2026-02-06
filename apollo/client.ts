// lib/apollo-client.ts
import {
  ApolloClient,
  InMemoryCache,
  split,
  HttpLink,
  from,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { onError } from "@apollo/client/link/error";
import createUploadLink from "apollo-upload-client/public/createUploadLink.js";
import { getJwtToken } from "@/lib/auth";

function getHeaders() {
  const headers: Record<string, string> = {};
  const token = getJwtToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export const createApolloClient = () => {
  const httpLink = createUploadLink({
    uri: process.env.NEXT_PUBLIC_API_GRAPHQL_URL,
    headers: getHeaders(),
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message }) =>
        console.error("[GraphQL error]:", message),
      );
    }
    if (networkError) {
      console.error("[Network error]:", networkError);
    }
  });

  const wsLink =
    typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_WS
      ? new GraphQLWsLink(
          createClient({
            url: process.env.NEXT_PUBLIC_API_WS, // 🔒 fallback YO‘Q
            connectionParams: () => ({
              headers: getHeaders(),
            }),
            retryAttempts: 3, // 🔥 CHEKSIZ EMAS
          }),
        )
      : null;

  const splitLink =
    typeof window !== "undefined" && wsLink
      ? split(
          ({ query }) => {
            const definition = getMainDefinition(query);
            return (
              definition.kind === "OperationDefinition" &&
              definition.operation === "subscription"
            );
          },
          wsLink,
          httpLink,
        )
      : httpLink;

  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: from([errorLink, splitLink]),
    cache: new InMemoryCache(),
  });
};
