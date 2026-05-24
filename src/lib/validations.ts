import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(80),
    email: z.string().email("Enter a valid email address"),
    phone: z
      .string()
      .min(10, "Enter a valid mobile number")
      .max(13)
      .regex(/^(\+91)?[6-9]\d{9}$/, "Enter a valid Indian mobile number"),
    gender: z.enum(["boy", "girl"], { required_error: "Please choose your island character" }),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Google Sign-In users don't submit a password
export const registerGoogleSchema = z.object({
  name: z.string().min(1, "Name is required").max(80),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .min(10, "Enter a valid mobile number")
    .max(13)
    .regex(/^(\+91)?[6-9]\d{9}$/, "Enter a valid Indian mobile number"),
  gender: z.enum(["boy", "girl"], { required_error: "Please choose your island character" }),
  googleId: z.string().min(1),
});

export const forgotPasswordEmailSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "Code must be 6 digits")
    .regex(/^\d{6}$/, "Code must be numeric"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RegisterGoogleInput = z.infer<typeof registerGoogleSchema>;
export type ForgotPasswordEmailInput = z.infer<typeof forgotPasswordEmailSchema>;
export type OtpInput = z.infer<typeof otpSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
