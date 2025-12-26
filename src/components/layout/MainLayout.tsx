import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface MainLayoutProps {
    children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

    return (
        <div className="min-h-screen bg-background">
            <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
            <Header onMenuToggle={toggleSidebar} />

            {/* Main content area */}
            <main className="lg:ml-64 pt-16 min-h-screen">
                <div className="p-4 lg:p-6">
                    {children}
                </div>
            </main>
        </div>
    )
}
