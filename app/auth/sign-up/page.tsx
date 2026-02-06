/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
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
import { signUpService } from "@/lib/auth/signup";
import { useApolloClient } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, StoreIcon, User2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function SignupPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const client = useApolloClient();

  /* -------------------------------------------------------------------------- */
  /*                                   HANDLERS                                  */
  /* -------------------------------------------------------------------------- */
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      memberNick: "",
      memberPhone: "",
      memberPassword: "",
      memberType: "CUSTOMER" as const,
    },
  });

  function onSubmit(data: z.infer<typeof signUpSchema>) {
    startTransition(async () => {
      try {
        await signUpService(client, data);
        toast.success("Welcome to Next Tech");
        router.replace("/");
      } catch (err: any) {
        toast.error(err.message);
      }
    });
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

            <Button disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                </>
              ) : (
                <span>Sign Up</span>
              )}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
