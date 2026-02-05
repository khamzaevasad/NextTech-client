"use client";
import { userVar } from "@/apollo/store";
import { LOGIN, SIGNUP } from "@/apollo/user/user-mutation";
import { signUpSchema } from "@/app/schemas/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updateStorage, updateUserInfo } from "@/lib/auth";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { StoreIcon, User2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export default function SignupPage() {
  const [signUpMutate, { loading, error }] = useMutation(SIGNUP);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      memberNick: "",
      memberPhone: "",
      memberPassword: "",
      memberType: "CUSTOMER" as const,
    },
  });

  const handleSignUp = async (input: z.infer<typeof signUpSchema>) => {
    try {
      const { data } = await signUpMutate({
        variables: {
          input: input,
        },
        fetchPolicy: "network-only",
      });

      if (data?.signup.accessToken) {
        const jwtToken = data?.signup.accessToken;
        updateStorage({ jwtToken });
        updateUserInfo(jwtToken);
        alert("Xush kelibsiz!");
        router.replace("/");
      }
    } catch (err) {
      console.log("signup error", err);
    }
  };

  async function onSubmit(data: z.infer<typeof signUpSchema>) {
    await handleSignUp(data);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
        <CardDescription>Create an account to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-y-4">
            {/* Username */}
            <Controller
              name="memberNick"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>UserName</FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    placeholder="Khamzaev Asadbek"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Phone */}
            <Controller
              name="memberPhone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Phone number</FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    placeholder="+821234567800"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Password */}
            <Controller
              name="memberPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    placeholder="*****"
                    type="password"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* User Role */}
            <Controller
              name="memberType"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <FieldLabel>Account type</FieldLabel>

                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="CUSTOMER" id="customer" />
                      <Label
                        htmlFor="customer"
                        className="flex items-center gap-1 text-sm font-medium cursor-pointer"
                      >
                        <User2 className="size-4" />
                        Customer
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="SELLER" id="seller" />
                      <Label
                        htmlFor="seller"
                        className="flex items-center gap-1 text-sm font-medium cursor-pointer"
                      >
                        <StoreIcon className="size-4" />
                        Seller
                      </Label>
                    </div>
                  </RadioGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </div>
              )}
            />

            <Button className="mt-4 cursor-pointer">Sign up</Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
