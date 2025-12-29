import { Menu, Bell, User } from 'lucide-react'

interface HeaderProps {
    onMenuToggle: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
    return (
        <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white border-b border-border z-30 transition-all duration-300">
            <div className="h-full px-4 lg:px-6 flex items-center justify-between">
                {/* Left side - Mobile menu button */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuToggle}
                        className="lg:hidden p-2 hover:bg-muted rounded-md transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <h1 className="text-lg font-semibold hidden sm:block">Dashboard</h1>
                </div>

                {/* Right side - User actions */}
                <div className="flex items-center gap-3">
                    {/* Notifications */}
                    <button className="relative p-2 hover:bg-muted rounded-md transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* User profile */}
                    <div className="flex items-center gap-2 px-3 py-1.5 hover:bg-muted rounded-md transition-colors cursor-pointer">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="hidden md:block">

                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
