import { z } from "zod";

export const signupSchema = z.object({
  fullName: z.string().min(1, "Name is required").max(50),
  email: z.string().email("Invalid email format").max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(255),
});

export const signinSchema = z.object({
  email: z.string().email("Invalid email format").max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(255),
});
