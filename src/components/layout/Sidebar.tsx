import { NavLink } from 'react-router-dom'
import {
    Shield,
    GraduationCap,
    Users,
    UserCircle,
    Stethoscope,
    Globe,
    School,
    Settings,
    X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
    isOpen: boolean
    onToggle: () => void
}

const menuItems = [
    { name: 'App Settings', path: '/', icon: Settings },
    { name: 'Roles', path: '/roles', icon: Shield },
    { name: 'Students', path: '/students', icon: GraduationCap },
    { name: 'Teachers', path: '/teachers', icon: Users },
    { name: 'Parents', path: '/parents', icon: UserCircle },
    { name: 'Clinistinction', path: '/clinistinction', icon: Stethoscope },
    { name: 'Country Code', path: '/country-codes', icon: Globe },
    { name: 'Schools', path: '/schools', icon: School },
]

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed left-0 top-0 h-full bg-white border-r border-border z-50 transition-transform duration-300 ease-in-out",
                "w-64 flex flex-col shadow-lg",
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                {/* Logo/Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-border">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">Z</span>
                        </div>
                        <span className="font-bold text-lg">Zabiyo Admin</span>
                    </div>
                    <button
                        onClick={onToggle}
                        className="lg:hidden p-1 hover:bg-muted rounded-md transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto py-4 px-3">
                    <ul className="space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) => cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                                            "text-sm font-medium group",
                                            isActive
                                                ? "bg-primary text-white shadow-md"
                                                : "text-foreground hover:bg-muted hover:text-primary"
                                        )}
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <Icon className={cn(
                                                    "w-5 h-5 transition-transform group-hover:scale-110",
                                                    isActive ? "text-white" : "text-muted-foreground group-hover:text-primary"
                                                )} />
                                                <span>{item.name}</span>
                                            </>
                                        )}
                                    </NavLink>
                                </li>
                            )
                        })}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-border">
                    <p className="text-xs text-muted-foreground text-center">
                        © 2024 Zabiyo Admin
                    </p>
                </div>
            </aside>
        </>
    )
}
