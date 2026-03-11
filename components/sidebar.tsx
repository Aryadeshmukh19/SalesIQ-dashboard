'use client'

import { useState } from 'react'
import {
    LayoutDashboard,
    Map,
    Package,
    Users2,
    Database,
    Search,
    ChevronLeft,
    ChevronRight,
    LogOut,
    User,
    Settings,
    Bell,
    HelpCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/context/AuthContext'
import { signOutUser } from '@/lib/firebase/auth'
import { useRouter } from 'next/navigation'

interface SidebarProps {
    activeTab: string
    onTabChange: (tab: string) => void
    companyName: string
}

const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'regional', label: 'Regional', icon: Map },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'reps', label: 'Reps', icon: Users2 },
    { id: 'data', label: 'Data', icon: Database },
]

export function Sidebar({ activeTab, onTabChange, companyName }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false)
    const { user } = useAuth()
    const router = useRouter()

    const initials = user?.displayName
        ? user.displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : user?.email?.[0].toUpperCase() ?? 'U'

    async function handleSignOut() {
        await signOutUser()
        router.replace('/login')
    }

    return (
        <aside
            className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-white/40 bg-white/30 backdrop-blur-xl transition-all duration-300 shadow-xl ${collapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Brand */}
            <div className="flex h-16 items-center justify-between px-6">
                {!collapsed && (
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
                            <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="font-serif text-xl font-semibold text-foreground truncate">
                            {companyName}
                        </span>
                    </div>
                )}
                {collapsed && (
                    <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
                    </div>
                )}
                {/* Toggle (Desktop only) */}
                {/* <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex h-6 w-6 items-center justify-center rounded-md border border-border hover:bg-muted"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button> */}
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1.5 px-3 py-4">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.id
                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${isActive
                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]'
                                : 'text-muted-foreground hover:bg-white/50 hover:text-foreground'
                                } ${collapsed ? 'justify-center' : ''}`}
                        >
                            <Icon className={`h-4 w-4 shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                            {!collapsed && <span>{item.label}</span>}
                            {!collapsed && isActive && (
                                <div className="ml-auto h-1 w-1 rounded-full bg-primary-foreground/50" />
                            )}
                        </button>
                    )
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="border-t border-border p-4 space-y-2">
                {!collapsed && (
                    <div className="flex flex-col gap-1 mb-4">
                        <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                            <Settings className="h-4 w-4" />
                            Settings
                        </button>
                        <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                            <HelpCircle className="h-4 w-4" />
                            Support
                        </button>
                    </div>
                )}

                {/* User Profile */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className={`flex w-full items-center gap-3 rounded-xl p-2 transition-all hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary ${collapsed ? 'justify-center' : ''}`}>
                            <Avatar className="h-9 w-9 border-2 border-border">
                                <AvatarImage src={user?.photoURL ?? ''} />
                                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            {!collapsed && (
                                <div className="flex flex-1 flex-col items-start overflow-hidden">
                                    <span className="text-sm font-semibold text-foreground truncate w-full">
                                        {user?.displayName ?? 'User'}
                                    </span>
                                    <span className="text-xs text-muted-foreground truncate w-full">
                                        Enterprise Plan
                                    </span>
                                </div>
                            )}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align={collapsed ? 'center' : 'end'} className="w-56" side={collapsed ? 'right' : 'top'}>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                            <User className="h-4 w-4" /> Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Bell className="h-4 w-4" /> Notifications
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                            onClick={handleSignOut}
                        >
                            <LogOut className="h-4 w-4" /> Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </aside>
    )
}
