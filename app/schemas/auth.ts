import z from "zod";

export const signUpSchema = z.object({
  memberNick: z
    .string()
    .min(3, "Username must be at least 2 characters long.")
    .max(12, "Username should be at most 12 characters long."),
  memberPassword: z
    .string()
    .min(5, "Password must be at least 2 characters long.")
    .max(12, "Password should be at most 12 characters long."),
  memberPhone: z
    .string()
    .regex(/^\+82\d{9,10}$/, "The phone number is in the wrong format"),
  memberType: z.enum(["CUSTOMER", "SELLER"]),
});
