# Zod Validation Schemas Documentation

This document provides an overview of all Zod validation schemas implemented in the Zabiyo Admin application.

## Overview

All validation schemas are located in the `src/schema` directory and can be imported from `@/schema`.

## Available Schemas

### 1. Authentication Schemas (`authschema.ts`)

#### Login Schema
```typescript
import { loginSchema } from '@/schema'
```

**Fields:**
- `email`: Required, must be a valid email address
- `password`: Required, minimum 6 characters

#### Register Schema
```typescript
import { registerSchema } from '@/schema'
```

**Fields:**
- `name`: Required, 2-100 characters
- `email`: Required, must be a valid email address
- `password`: Required, minimum 6 characters
- `confirmPassword`: Required, must match password

#### Forgot Password Schema
```typescript
import { forgetPasswordSchema } from '@/schema'
```

**Fields:**
- `phone`: Required, exactly 10 digits

#### Reset Password Schema
```typescript
import { resetPasswordSchema } from '@/schema'
```

**Fields:**
- `password`: Required, minimum 8 characters, must contain:
  - At least one lowercase letter
  - At least one uppercase letter
  - At least one digit
  - At least one special character
- `confirmPassword`: Required, must match password

---

### 2. Role Schema (`roleSchema.ts`)

```typescript
import { roleSchema } from '@/schema'
```

**Fields:**
- `roleName`: Required, 2-50 characters
- `description`: Required, 5-200 characters
- `status`: Required, must be 'Active' or 'Inactive'

---

### 3. Student Schema (`studentSchema.ts`)

```typescript
import { studentSchema } from '@/schema'
```

**Fields:**
- `fullName`: Required, 2-100 characters
- `email`: Required, must be a valid email address
- `phone`: Required, valid phone number format
- `grade`: Required
- `status`: Required, must be 'Active' or 'Inactive'

---

### 4. Teacher Schema (`teacherSchema.ts`)

```typescript
import { teacherSchema } from '@/schema'
```

**Fields:**
- `fullName`: Required, 2-100 characters
- `email`: Required, must be a valid email address
- `phone`: Required, valid phone number format
- `subject`: Required, 2-50 characters
- `department`: Required, 2-50 characters
- `status`: Required, must be 'Active' or 'Inactive'

---

### 5. Parent Schema (`parentSchema.ts`)

```typescript
import { parentSchema } from '@/schema'
```

**Fields:**
- `fullName`: Required, 2-100 characters
- `email`: Required, must be a valid email address
- `phone`: Required, valid phone number format
- `associatedStudents`: Required, array of strings, at least one student
- `status`: Required, must be 'Active' or 'Inactive'

---

### 6. Clinistinction Schema (`clinistinctionSchema.ts`)

```typescript
import { clinistinctionSchema } from '@/schema'
```

**Fields:**
- `name`: Required, 2-100 characters
- `description`: Required, 5-500 characters
- `category`: Required, 2-50 characters
- `status`: Required, must be 'Active' or 'Inactive'

---

### 7. Country Code Schema (`countryCodeSchema.ts`)

```typescript
import { countryCodeSchema } from '@/schema'
```

**Fields:**
- `countryName`: Required, 2-100 characters
- `dialCode`: Required, must start with '+' and contain 1-4 digits (e.g., +1, +91)
- `flagImage`: Required, must be a valid flag emoji
- `digitCountLimit`: Required, integer between 1-15
- `status`: Required, must be 'Active' or 'Inactive'

---

### 8. School Schema (`schoolSchema.ts`)

```typescript
import { schoolSchema } from '@/schema'
```

**Fields:**
- `schoolName`: Required, 2-100 characters
- `address`: Required, 5-200 characters
- `phone`: Required, valid phone number format
- `email`: Required, must be a valid email address
- `principalName`: Required, 2-100 characters
- `status`: Required, must be 'Active' or 'Inactive'

---

### 9. App Settings Schema (`appSettingsSchema.ts`)

```typescript
import { appSettingsSchema } from '@/schema'
```

**Fields:**
- `appName`: Required, 2-50 characters
- `appImage`: Required, must be a valid URL or file path

---

## Usage Example

### Basic Validation

```typescript
import { loginSchema } from '@/schema'
import { z } from 'zod'

const validateForm = (formData) => {
    try {
        loginSchema.parse(formData)
        return { success: true }
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = {}
            error.issues.forEach((issue) => {
                if (issue.path[0]) {
                    errors[issue.path[0]] = issue.message
                }
            })
            return { success: false, errors }
        }
    }
}
```

### In React Components

```typescript
import { useState } from 'react'
import { countryCodeSchema } from '@/schema'
import { z } from 'zod'

function MyForm() {
    const [formData, setFormData] = useState({
        countryName: '',
        dialCode: '',
        flagImage: '',
        digitCountLimit: 0,
        status: 'Active'
    })
    const [errors, setErrors] = useState({})

    const handleSubmit = (e) => {
        e.preventDefault()
        
        try {
            const validatedData = countryCodeSchema.parse(formData)
            setErrors({})
            // Process validated data
            console.log('Valid data:', validatedData)
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors = {}
                error.issues.forEach((issue) => {
                    if (issue.path[0]) {
                        fieldErrors[issue.path[0]] = issue.message
                    }
                })
                setErrors(fieldErrors)
            }
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {/* Form fields with error display */}
        </form>
    )
}
```

## Type Inference

All schemas export TypeScript types that can be inferred:

```typescript
import { type RoleFormData } from '@/schema'
import { type StudentFormData } from '@/schema'
import { type CountryCodeFormData } from '@/schema'

// Or use z.infer
import { roleSchema } from '@/schema'
import { z } from 'zod'

type RoleData = z.infer<typeof roleSchema>
```

## Implemented Pages

The following pages have Zod validation implemented:

- ✅ **Login** (`src/pages/Login.tsx`) - Uses `loginSchema`
- ✅ **Register** (`src/pages/Register.tsx`) - Uses `registerSchema`
- ✅ **CountryCode** (`src/pages/CountryCode.tsx`) - Uses `countryCodeSchema`

## TODO: Pages Needing Implementation

The schemas are ready for the following pages:

- ⏳ **Roles** - Use `roleSchema`
- ⏳ **Students** - Use `studentSchema`
- ⏳ **Teachers** - Use `teacherSchema`
- ⏳ **Parents** - Use `parentSchema`
- ⏳ **Clinistinction** - Use `clinistinctionSchema`
- ⏳ **Schools** - Use `schoolSchema`
- ⏳ **AppSettings** - Use `appSettingsSchema`

## Best Practices

1. **Always validate on submit**: Validate form data when the user submits the form
2. **Clear errors on change**: Clear field errors when the user starts typing
3. **Show field-level errors**: Display validation errors next to the relevant fields
4. **Visual feedback**: Add visual indicators (red border) for fields with errors
5. **Type safety**: Use TypeScript types inferred from schemas for better type safety

## Error Handling Pattern

```typescript
// Standard error handling pattern used across all forms
try {
    const validatedData = schema.parse(formData)
    setErrors({})
    // Success - proceed with validated data
} catch (error) {
    if (error instanceof z.ZodError) {
        const fieldErrors = {}
        error.issues.forEach((issue) => {
            if (issue.path[0]) {
                fieldErrors[issue.path[0]] = issue.message
            }
        })
        setErrors(fieldErrors)
        // Optionally show toast notification
        showToast('error', 'Please fix the validation errors')
    }
}
```
