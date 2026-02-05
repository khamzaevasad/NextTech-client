import { LOGIN } from "@/apollo/user/user-mutation";
import { loginSchema } from "@/app/schemas/auth";
import { ApolloClient } from "@apollo/client";
import z from "zod";
import { updateStorage, updateUserInfo } from ".";

export async function loginService<TCache>(
  client: ApolloClient<TCache>,
  input: z.infer<typeof loginSchema>,
) {
  const { data } = await client.mutate({
    mutation: LOGIN,
    variables: { input },
    fetchPolicy: "network-only",
  });

  if (!data?.login?.accessToken) {
    throw new Error("Signup failed: no access token");
  }

  const jwtToken = data.login.accessToken;

  updateStorage({ jwtToken });
  updateUserInfo(jwtToken);

  return true;
}
