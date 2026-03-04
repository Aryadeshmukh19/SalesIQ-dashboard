'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BarChart3, Plus, LogOut, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { signOutUser } from '@/lib/firebase/auth'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'

interface DashboardHeaderProps {
  companyName: string
  activeTab: string
  onTabChange: (tab: string) => void
  onAddSale: () => void
}

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'regional', label: 'Regional' },
  { id: 'products', label: 'Products' },
  { id: 'reps', label: 'Reps' },
  { id: 'data', label: 'Data' },
]

export function DashboardHeader({
  companyName,
  activeTab,
  onTabChange,
  onAddSale,
}: DashboardHeaderProps) {
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
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <BarChart3 className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-lg text-foreground">SalesIQ</span>
            <span className="hidden text-sm text-muted-foreground sm:inline">
              / {companyName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={onAddSale} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Sale</span>
          </Button>

          {/* Dark mode toggle */}
          <ThemeToggle />

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-border hover:ring-primary transition-all">
                  <AvatarImage src={user?.photoURL ?? ''} alt={user?.displayName ?? 'User'} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">{user?.displayName ?? 'User'}</span>
                  <span className="text-xs text-muted-foreground font-normal truncate">
                    {user?.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                Account
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 text-destructive focus:text-destructive"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <nav className="-mb-px flex gap-1 overflow-x-auto" aria-label="Dashboard tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
