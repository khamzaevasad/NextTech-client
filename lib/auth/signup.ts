import { ApolloClient } from "@apollo/client";
import { SIGNUP } from "@/apollo/user/user-mutation";
import { updateStorage, updateUserInfo } from "@/lib/auth";
import { z } from "zod";
import { signUpSchema } from "@/app/schemas/auth";

export async function signUpService<TCache>(
  client: ApolloClient<TCache>,
  input: z.infer<typeof signUpSchema>,
) {
  const { data } = await client.mutate({
    mutation: SIGNUP,
    variables: { input },
    fetchPolicy: "network-only",
  });

  if (!data?.signup?.accessToken) {
    throw new Error("Signup failed: no access token");
  }

  const jwtToken = data.signup.accessToken;

  updateStorage({ jwtToken });
  updateUserInfo(jwtToken);

  return true;
}
