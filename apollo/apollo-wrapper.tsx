"use client";

import { ApolloProvider } from "@apollo/client";
import { ReactNode, useState } from "react";
import { createApolloClient } from "./client";

export const ApolloWrapper = ({ children }: { children: ReactNode }) => {
  // Client-ni faqat bir marta yaratish uchun useState ishlatamiz
  const [client] = useState(() => createApolloClient());

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
