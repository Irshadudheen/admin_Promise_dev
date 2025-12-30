import { z } from "zod"

// Class Schema for Add/Edit
export const classSchema = z.object({
    className: z
        .string()
        .min(1, "Class name is required")
        .min(1, "Class name must be at least 1 character long")
        .max(50, "Class name must be at most 50 characters long"),

    description: z
        .string()
        .max(200, "Description must be at most 200 characters long")
        .optional()
        .or(z.literal("")),
    schoolId: z
        .string()
        .optional(),
})

export type ClassFormData = z.infer<typeof classSchema>
