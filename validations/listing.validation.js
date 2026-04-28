import { z } from "zod";

export const listingValidation = z.object({
  title: z.string().trim().min(2).max(100),
  description: z.string().trim().min(2).max(255),
  company: z.string().trim().min(2).max(100),
  model: z.string().trim().min(2).max(100),
  color: z.string().trim().min(3).max(30),

  price: z.coerce.number().positive(),
  mileage: z.coerce.number().int().nonnegative(),
});
