import { z } from "zod";

export const signUpValidation = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username should not exceed 20 characters"),
  email: z.email("Invalid Email"),
  password: z.string().min(6),
  phone: z.string(),
  city: z.string().trim().min(3),
});

export const loginValidation = z.object({
  email: z.email("Invalid Email"),
  password: z.string().min(6),
});
