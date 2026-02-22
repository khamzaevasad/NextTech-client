import { StoreLocation } from "@/lib/enums/store.enum";
import * as z from "zod";

export const storeSchema = z.object({
  storeName: z
    .string()
    .min(3, "Store name must be at least 3 characters")
    .max(12, "Store name cannot exceed 12 characters"),
  storeDesc: z
    .string()
    .min(6, "Description must be at least 6 characters")
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
  storeLogo: z.string().optional(),
  storePhone: z
    .string()
    .min(3, "Phone must be at least 3 characters")
    .max(15, "Phone cannot exceed 15 characters"),
  storeAddress: z
    .string()
    .min(3, "Address must be at least 3 characters")
    .max(100, "Address cannot exceed 100 characters"),
  storeLocation: z.nativeEnum(StoreLocation).catch(() => {
    throw new Error("Please select a valid location");
  }),
});

export type StoreFormValues = z.infer<typeof storeSchema>;
