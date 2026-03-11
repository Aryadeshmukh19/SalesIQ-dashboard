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
import { Search, Bell, Settings, Plus, BarChart3, Menu } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { signOutUser } from '@/lib/firebase/auth'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'

interface DashboardHeaderProps {
  onAddSale: () => void
  onMenuClick?: () => void
}

export function DashboardHeader({ onAddSale, onMenuClick }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 px-4 lg:px-6 py-3 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden shrink-0"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        {/* Global Search Placeholder */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search dashboard, records, analytics..."
            className="h-10 w-full rounded-xl border border-border bg-muted/50 pl-10 pr-4 text-sm transition-all focus:border-primary/50 focus:bg-card focus:outline-none focus:ring-4 focus:ring-primary/5"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-5 w-5" />
          </Button>

          <div className="mx-2 h-5 w-px bg-border" />

          <Button onClick={onAddSale} className="gap-2 rounded-xl px-5 shadow-lg shadow-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="h-4.5 w-4.5" />
            <span>New Sale</span>
          </Button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
