import { z } from "zod"

// Login Schema
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters long")
})

// Register Schema
export const registerSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .min(2, "Name must be at least 2 characters long")
        .max(100, "Name must be at most 100 characters long"),
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
        .string()
        .min(1, "Please confirm your password")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
})

// Forgot Password Schema
export const forgetPasswordSchema = z.object({
    phone: z
        .string()
        .min(10, "Phone must be at least 10 characters long")
        .max(10, "Phone must be at most 10 characters long")
        .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
})

// Reset Password Schema
export const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one digit")
        .regex(
            /[^a-zA-Z0-9]/,
            "Password must contain at least one special character"
        ),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
})