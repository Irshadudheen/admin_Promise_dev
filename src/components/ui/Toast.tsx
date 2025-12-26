import * as React from "react"
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
    id: string
    type: ToastType
    message: string
}

interface ToastContextType {
    showToast: (type: ToastType, message: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function useToast() {
    const context = React.useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within ToastProvider')
    }
    return context
}

const toastIcons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertTriangle,
}

const toastStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
}

const iconStyles = {
    success: 'text-green-600',
    error: 'text-red-600',
    info: 'text-blue-600',
    warning: 'text-yellow-600',
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<Toast[]>([])

    const showToast = React.useCallback((type: ToastType, message: string) => {
        const id = Math.random().toString(36).substring(7)
        setToasts(prev => [...prev, { id, type, message }])

        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id))
        }, 5000)
    }, [])

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
                {toasts.map(toast => {
                    const Icon = toastIcons[toast.type]
                    return (
                        <div
                            key={toast.id}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-in-right",
                                toastStyles[toast.type]
                            )}
                        >
                            <Icon className={cn("w-5 h-5 shrink-0", iconStyles[toast.type])} />
                            <p className="flex-1 text-sm font-medium">{toast.message}</p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="shrink-0 p-1 rounded hover:bg-black/5 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )
                })}
            </div>
        </ToastContext.Provider>
    )
}
