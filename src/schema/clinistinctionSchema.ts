import { z } from "zod"

// Clinistinction Schema for Add/Edit
export const clinistinctionSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .min(2, "Name must be at least 2 characters long")
        .max(100, "Name must be at most 100 characters long"),
    description: z
        .string()
        .min(1, "Description is required")
        .min(5, "Description must be at least 5 characters long")
        .max(500, "Description must be at most 500 characters long"),
    category: z
        .string()
        .min(1, "Category is required")
        .min(2, "Category must be at least 2 characters long")
        .max(50, "Category must be at most 50 characters long"),
    status: z.enum(['Active', 'Inactive'], {
        message: "Status must be either Active or Inactive"
    })
})

export type ClinistinctionFormData = z.infer<typeof clinistinctionSchema>
