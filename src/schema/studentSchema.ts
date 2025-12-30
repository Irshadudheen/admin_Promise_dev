import { z } from "zod"

// Student Schema for Add/Edit
export const studentSchema = z.object({
    fullName: z
        .string()
        .min(1, "Full name is required")
        .min(2, "Full name must be at least 2 characters long")
        .max(100, "Full name must be at most 100 characters long"),
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address"),
    phone: z
        .string()
        .min(1, "Phone number is required")
        .regex(/^[+]?[\d\s-()]+$/, "Invalid phone number format"),
    grade: z
        .string()
        .min(1, "Grade is required"),
    status: z.enum(['Active', 'Inactive'], {
        message: "Status must be either Active or Inactive"
    })
})

export type StudentFormData = z.infer<typeof studentSchema>
