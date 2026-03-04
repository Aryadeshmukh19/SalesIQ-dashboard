'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Avoid hydration mismatch
    useEffect(() => setMounted(true), [])

    if (!mounted) {
        return (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
        )
    }

    const isDark = theme === 'dark'

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="relative flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
        >
            <Sun
                className="absolute h-4 w-4 transition-all duration-300"
                style={{
                    opacity: isDark ? 0 : 1,
                    transform: isDark ? 'rotate(90deg) scale(0.5)' : 'rotate(0deg) scale(1)',
                }}
            />
            <Moon
                className="absolute h-4 w-4 transition-all duration-300"
                style={{
                    opacity: isDark ? 1 : 0,
                    transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.5)',
                }}
            />
        </button>
    )
}
