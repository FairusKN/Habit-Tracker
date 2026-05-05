import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.email(),
    full_name: z.string().max(255),
    password: z.string().min(8).max(255)
  })
})

export const loginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string()
  })
})
