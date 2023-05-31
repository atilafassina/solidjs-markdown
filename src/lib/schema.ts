import { z } from "zod"

export const userLoginSchema = z.object({
  username: z.string().email(),
  password: z.string().refine((val) => val.length >= 6, {
    message: "Password must have 6 characters or more.",
  }),
})

export const loginFormSchema = userLoginSchema.extend({
  loginType: z.union([z.literal("login"), z.literal("register")]),
  redirectTo: z.string().default("/"),
})

export const fullUserSchema = userLoginSchema.extend({
  id: z.string(),
})

export type UserLoginForm = z.infer<typeof userLoginSchema>

const envSchema = z.object({
  SESSION_SECRET: z.string(),
})

export const ENV = envSchema.parse(process.env)
