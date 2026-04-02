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
export const sendVerifyOtpSchema = z.object({
  email: z.email("Invalid email"),
  type: z.enum(
    ["sign-in", "email-verification", "forget-password", "change-email"],
    "Type is required",
  ),
});

export const forgotPasswordZodSchema = z.object({
  email: z.email("Please enter a valid email address."),
});

export const profileSchema = z.object({
  name: z.string("Name is required.").min(2, "At least 2 characters."),
  // username: z
  //   .string("Username is required.")
  //   .min(3, "At least 3 characters.")
  //   .regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers, underscores."),
  bio: z.string("Bio is required.").max(300, "Max 300 characters.").optional(),
});

export const passwordSchema = z
  .object({
    oldPassword: z.string("Current password is required.").min(1, "Required."),
    newPassword: z.string("New password is required.").min(8, "At least 8 characters."),
    confirmPassword: z.string("Confirm password is required.").min(1, "Required."),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ILoginProps = z.infer<typeof loginZodSchema>;
export type IRegisterProps = z.infer<typeof registerZodSchema>;
export type IVerifyEmailProps = z.infer<typeof verifyEmailZodSchema>;
export type ISendVerifyOtpProps = z.infer<typeof sendVerifyOtpSchema>;
export type IProfileProps = z.infer<typeof profileSchema>;
export type IPasswordProps = z.infer<typeof passwordSchema>;
export type IForgotPasswordProps = z.infer<typeof forgotPasswordZodSchema>;
