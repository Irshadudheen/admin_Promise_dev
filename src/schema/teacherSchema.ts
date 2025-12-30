import { z } from "zod"

// Teacher Schema for Add/Edit
export const teacherSchema = z.object({
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
    subject: z
        .string()
        .min(1, "Subject is required")
        .min(2, "Subject must be at least 2 characters long")
        .max(50, "Subject must be at most 50 characters long"),
    department: z
        .string()
        .min(1, "Department is required")
        .min(2, "Department must be at least 2 characters long")
        .max(50, "Department must be at most 50 characters long"),
    status: z.enum(['Active', 'Inactive'], {
        message: "Status must be either Active or Inactive"
    })
})

export type TeacherFormData = z.infer<typeof teacherSchema>
