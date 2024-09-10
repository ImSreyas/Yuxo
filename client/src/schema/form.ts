import { z } from "zod";

export const OperatorFormSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address." }),
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long" }),
    phone: z.string().min(10, { message: "Invalid number" }),
    place: z.string({ message: "Place required" }),
    permit_no: z
      .string()
      .min(15, { message: "Permit no. should contain at least 15 characters" })
      .max(20, { message: "Permit no. should contain at most 20 characters" }),
    is_ksrtc_operator: z.boolean(),
    password: z.string().min(6, { message: "Invalid password" }),
    confirm_password: z.string({ message: "Please confirm your password." }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });
