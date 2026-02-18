import {
  ApolloClient,
  InMemoryCache,
  split,
  HttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { onError } from "@apollo/client/link/error";
import createUploadLink from "apollo-upload-client/public/createUploadLink.js";
import { getJwtToken } from "@/lib/auth";

/* --------------------------- AUTH LINK (MUHIM) --------------------------- */
const authLink = setContext((_, { headers }) => {
  const token = getJwtToken();

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

/* ------------------------------ HTTP LINK ------------------------------ */
const httpLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_API_GRAPHQL_URL,
  headers: {
    "apollo-require-preflight": "true",
  },
});

/* ------------------------------ ERROR LINK ------------------------------ */
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

/* ------------------------------- WS LINK ------------------------------- */
const wsLink =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_WS
    ? new GraphQLWsLink(
        createClient({
          url: process.env.NEXT_PUBLIC_API_WS,
          connectionParams: () => {
            const token = getJwtToken();
            return {
              Authorization: token ? `Bearer ${token}` : "",
            };
          },
          retryAttempts: 3,
        }),
      )
    : null;

/* ------------------------------- SPLIT ------------------------------- */
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

/* --------------------------- APOLLO CLIENT --------------------------- */
export const createApolloClient = () =>
  new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: from([errorLink, authLink, splitLink]),
    cache: new InMemoryCache(),
  });
