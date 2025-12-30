import { z } from "zod"

// App Settings Schema for Edit
export const appSettingsSchema = z.object({
    appName: z
        .string()
        .min(1, "App name is required")
        .min(2, "App name must be at least 2 characters long")
        .max(50, "App name must be at most 50 characters long"),
    appImage: z
        .string()
        .min(1, "App image is required")
        .url("App image must be a valid URL")
        .or(z.string().startsWith("/", "App image must be a valid path"))
})

export type AppSettingsFormData = z.infer<typeof appSettingsSchema>
