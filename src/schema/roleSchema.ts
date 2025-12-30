import { z } from "zod"

// Role Schema for Add/Edit
export const roleSchema = z.object({
    roleName: z
        .string()
        .min(1, "Role name is required")
        .min(2, "Role name must be at least 2 characters long")
        .max(50, "Role name must be at most 50 characters long"),
    description: z
        .string()
        .min(1, "Description is required")
        .min(5, "Description must be at least 5 characters long")
        .max(200, "Description must be at most 200 characters long"),
    status: z.enum(['Active', 'Inactive'], {
        message: "Status must be either Active or Inactive"
    })
})

export type RoleFormData = z.infer<typeof roleSchema>
