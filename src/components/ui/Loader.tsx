import * as React from "react"
import { cn } from "@/lib/utils"

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: "sm" | "md" | "lg"
    variant?: "default" | "primary" | "white"
}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
    ({ className, size = "md", variant = "default", ...props }, ref) => {
        const sizeClasses = {
            sm: "w-4 h-4 border-2",
            md: "w-8 h-8 border-2",
            lg: "w-12 h-12 border-3",
        }

        const variantClasses = {
            default: "border-muted-foreground border-t-foreground",
            primary: "border-primary/30 border-t-primary",
            white: "border-white/30 border-t-white",
        }

        return (
            <div
                ref={ref}
                className={cn("inline-block", className)}
                {...props}
            >
                <div
                    className={cn(
                        "rounded-full animate-spin",
                        sizeClasses[size],
                        variantClasses[variant]
                    )}
                />
            </div>
        )
    }
)

Loader.displayName = "Loader"

// Full page loader component
interface FullPageLoaderProps {
    message?: string
}

const FullPageLoader: React.FC<FullPageLoaderProps> = ({ message = "Loading..." }) => {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-4">
                <Loader size="lg" variant="primary" />
                {message && (
                    <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
                )}
            </div>
        </div>
    )
}

export { Loader, FullPageLoader }
