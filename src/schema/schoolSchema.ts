import { z } from "zod"

// School Schema for Add/Edit
export const schoolSchema = z.object({
    schoolName: z
        .string()
        .min(1, "School name is required")
        .min(2, "School name must be at least 2 characters long")
        .max(100, "School name must be at most 100 characters long"),
    address: z
        .string()
        .min(1, "Address is required")
        .min(5, "Address must be at least 5 characters long")
        .max(200, "Address must be at most 200 characters long"),
    phone: z
        .string()
        .min(1, "Phone number is required")
        .regex(/^[+]?[\d\s-()]+$/, "Invalid phone number format"),
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address"),
    principalName: z
        .string()
        .min(1, "Principal name is required")
        .min(2, "Principal name must be at least 2 characters long")
        .max(100, "Principal name must be at most 100 characters long"),
    status: z.enum(['Active', 'Inactive'], {
        message: "Status must be either Active or Inactive"
    })
})

export type SchoolFormData = z.infer<typeof schoolSchema>
