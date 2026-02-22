"use client";

import Image from "next/image";
import { CREATE_STORE, IMAGE_UPLOADER } from "@/apollo/user/user-mutation";
import { storeSchema } from "@/app/schemas/storeSchema";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useApolloClient, useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Store, Upload, MapPin, Phone, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { StoreLocation } from "@/lib/enums/store.enum";

export default function CreateStorePage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const client = useApolloClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [imageUploader] = useMutation(IMAGE_UPLOADER);

  /* -------------------------------------------------------------------------- */
  /*                                  HANDLERS                                  */
  /* -------------------------------------------------------------------------- */
  const form = useForm({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      storeName: "",
      storePhone: "",
      storeAddress: "",
      storeDesc: "",
      storeLocation: undefined,
      storeLogo: "",
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const { data } = await imageUploader({
          variables: { file, target: "member" },
        });
        form.setValue("storeLogo", data.imageUploader);
        setLogoPreview(URL.createObjectURL(file));
        toast.success("Logo uploaded successfully");
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.log("handleImageUpload error", err.message);
          toast(err.message);
        } else {
          toast("Unexpected error occurred");
        }
      }
    }
  };

  function onSubmit(data: z.infer<typeof storeSchema>) {
    startTransition(async () => {
      try {
        await client.mutate({
          mutation: CREATE_STORE,
          variables: { input: data },
        });
        toast.success("Store created successfully!");
        router.replace("/dashboard");
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.log("onSubmit error", err.message);
          toast(err.message);
        } else {
          toast("Unexpected error occurred");
        }
      }
    });
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-none border-none bg-transparent my-8">
      <CardHeader className="px-0">
        <div className="flex items-center gap-2 mb-2">
          <Store className="size-6 text-pink-500" />
          <CardTitle className="text-2xl font-bold">Create Store</CardTitle>
        </div>
        <CardDescription>
          Fill in the details below to register your tech store on NextTech.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-y-6">
            {/* Store Logo Section */}
            <div className="flex items-center gap-4 p-4 border rounded-xl bg-muted/5">
              <div className="size-20 rounded-lg border-2 border-dashed flex items-center justify-center bg-background overflow-hidden relative">
                {logoPreview ? (
                  <Image
                    src={logoPreview}
                    alt="Preview"
                    className="size-full object-cover"
                    fill
                  />
                ) : (
                  <Upload className="text-muted-foreground size-5" />
                )}
              </div>
              <div className="space-y-2">
                <FieldLabel>Store Logo</FieldLabel>
                <Input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer"
                >
                  Upload Image
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Store Name */}
              <Controller
                name="storeName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Store Name</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      placeholder="CoreParts"
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
                name="storePhone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Phone Number</FieldLabel>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        aria-invalid={fieldState.invalid}
                        placeholder="010-XXXX-XXXX"
                        {...field}
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Location */}
            <Controller
              name="storeLocation"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Store Location</FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(StoreLocation).map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Address */}
            <Controller
              name="storeAddress"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Address</FieldLabel>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      aria-invalid={fieldState.invalid}
                      placeholder="Street, City, Building"
                      {...field}
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Description */}
            <Controller
              name="storeDesc"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Description</FieldLabel>
                  <div className="relative">
                    <Info className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Textarea
                      className="pl-9 min-h-[100px] resize-none"
                      aria-invalid={fieldState.invalid}
                      placeholder="Tell us about your hardware expertise..."
                      {...field}
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button
              disabled={isPending}
              className="h-12 text-base font-bold cursor-pointer"
            >
              {isPending ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <span>Create Store</span>
              )}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
