import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/Input'
import { Loader } from '@/components/ui/Loader'
import { registerSchema } from '@/schema'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import useAuthStore from '@/store/authStore'
import { env } from '@/config/env'

type RegisterFormData = z.infer<typeof registerSchema>

export default function Register() {
    const navigate = useNavigate()
    const { register: registerUser, isLoading } = useAuthStore()
    const [isPending, setIsPending] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    })

    const onSubmit = async (data: RegisterFormData) => {
        try {
            const success = await registerUser(
                data.name,
                data.email,
                data.password,
                env.ADMIN_ROLE_ID
            )

            if (success) {
                setIsPending(true)
            }
        } catch (error) {
            console.error('Registration failed:', error)
        }
    }

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
                <div className="w-full max-w-md">
                    <div className="bg-card border border-border rounded-lg shadow-lg p-8 animate-scale-in text-center">
                        {/* Success Icon */}
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="w-8 h-8 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>

                        {/* Message */}
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                            Registration Submitted
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            Your registration request has been submitted successfully. Please wait for admin approval to access your account.
                        </p>

                        {/* Back to Login Button */}
                        <Button
                            onClick={() => navigate('/login')}
                            className="w-full"
                        >
                            Back to Login
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
            <div className="w-full max-w-md">
                <div className="bg-card border border-border rounded-lg shadow-lg p-8 animate-scale-in">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
                        <p className="text-muted-foreground">Register for admin access</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Name Field */}
                        <div className="space-y-2 text-left">
                            <label htmlFor="name" className="text-sm font-medium text-foreground">
                                Full Name
                            </label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                {...register('name')}
                                disabled={isLoading}
                                className={errors.name ? 'border-destructive' : ''}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2 text-left">
                            <label htmlFor="email" className="text-sm font-medium text-foreground ">
                                Email Address
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                {...register('email')}
                                disabled={isLoading}
                                className={errors.email ? 'border-destructive' : ''}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2 text-left">
                            <label htmlFor="password" className="text-sm font-medium text-foreground">
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register('password')}
                                disabled={isLoading}
                                className={errors.password ? 'border-destructive' : ''}
                            />
                            {errors.password && (
                                <p className="text-sm text-destructive">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2 text-left">
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                                Confirm Password
                            </label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                {...register('confirmPassword')}
                                disabled={isLoading}
                                className={errors.confirmPassword ? 'border-destructive' : ''}
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader size="sm" variant="white" />
                                    Creating account...
                                </span>
                            ) : (
                                'Register'
                            )}
                        </Button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="text-primary font-medium hover:underline"
                            >
                                Sign in here
                            </button>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-muted-foreground mt-8">
                    © 2025 Zabiyo Admin. All rights reserved.
                </p>
            </div>
        </div>
    )
}
