import { z } from "zod"

// Country Code Schema for Add/Edit
export const countryCodeSchema = z.object({
    countryName: z
        .string()
        .min(1, "Country name is required")
        .min(2, "Country name must be at least 2 characters long")
        .max(100, "Country name must be at most 100 characters long"),
    dialCode: z
        .string()
        .min(1, "Dial code is required")
        .regex(/^\+\d{1,4}$/, "Dial code must start with + and contain 1-4 digits"),
    flagImage: z
        .string()
        .min(1, "Flag emoji is required")
        .regex(/[\u{1F1E6}-\u{1F1FF}]{2}/u, "Please enter a valid flag emoji"),
    digitCountLimit: z
        .number({
            message: "Digit count limit must be a number"
        })
        .int("Digit count limit must be an integer")
        .min(1, "Digit count limit must be at least 1")
        .max(15, "Digit count limit must be at most 15"),
    status: z.enum(['Active', 'Inactive'], {
        message: "Status must be either Active or Inactive"
    })
})

export type CountryCodeFormData = z.infer<typeof countryCodeSchema>
