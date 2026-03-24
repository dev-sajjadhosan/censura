import z from "zod";

export const loginZodSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long"),
  // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  // .regex(/[0-9]/, "Password must contain at least one number")
  // .regex(
  //   /[^A-Za-z0-9]/,
  //   "Password must contain at least one special character",
  // ),,
});

export const registerZodSchema = z.object({
  name: z
    .string("Name is required.")
    .min(3, "Name must be at least 3 characters long")
    .max(30, "Name must be at most 30 characters."),
  email: z.email("Invalid email address."),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long"),
  // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  // .regex(/[0-9]/, "Password must contain at least one number")
  // .regex(
  //   /[^A-Za-z0-9]/,
  //   "Password must contain at least one special character",
  // ),
  acceptTerms: z.boolean("You must accept the terms and conditions"),
  rememberMe: z.boolean().optional(),
});

export const verifyEmailZodSchema = z.object({
  email: z.email("Invalid email address"),
  otp: z
    .string()
    .min(6, "OTP must be at least 6 digits long")
    .max(6, "OTP must be at most 6 digits long"),
});

export type ILoginProps = z.infer<typeof loginZodSchema>;
export type IRegisterProps = z.infer<typeof registerZodSchema>;
export type IVerifyEmailProps = z.infer<typeof verifyEmailZodSchema>;
