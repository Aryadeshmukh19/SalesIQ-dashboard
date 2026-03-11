'use client'

import { useEffect, useState } from 'react'
import type { User } from 'firebase/auth'

interface WelcomeGreetingProps {
    user: User | null
    onDismiss: () => void
}

function getFirstName(user: User | null): string {
    if (user?.displayName) {
        return user.displayName.split(' ')[0]
    }
    if (user?.email) {
        return user.email.split('@')[0]
    }
    return 'there'
}

export function WelcomeGreeting({ user, onDismiss }: WelcomeGreetingProps) {
    const [visible, setVisible] = useState(false)
    const [leaving, setLeaving] = useState(false)
    const firstName = getFirstName(user)

    useEffect(() => {
        // Trigger entrance animation
        const enterTimer = setTimeout(() => setVisible(true), 50)
        // Auto-dismiss after 3.5 seconds
        const exitTimer = setTimeout(() => handleDismiss(), 3500)
        return () => {
            clearTimeout(enterTimer)
            clearTimeout(exitTimer)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function handleDismiss() {
        setLeaving(true)
        setTimeout(() => onDismiss(), 500)
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={handleDismiss}
            aria-label="Welcome greeting – click to dismiss"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-500"
                style={{ opacity: visible && !leaving ? 1 : 0 }}
            />

            {/* Greeting card */}
            <div
                className="relative flex flex-col items-center gap-8 text-center transition-all duration-700 glass-card p-12 shadow-2xl border-none"
                style={{
                    opacity: visible && !leaving ? 1 : 0,
                    transform: visible && !leaving ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Animated icon container */}
                <div className="relative mb-2">
                    <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                    <div
                        className="text-7xl select-none relative z-10"
                        style={{
                            animation: visible && !leaving ? 'wave 1.5s ease-in-out 0.3s infinite' : 'none',
                        }}
                    >
                        ✨
                    </div>
                </div>

                {/* Text */}
                <div className="space-y-3">
                    <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Welcome back,
                    </h1>
                    <p className="font-serif text-5xl text-primary sm:text-6xl font-black tracking-tighter">
                        {firstName}
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-6">
                        <div className="h-px w-8 bg-border" />
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground/60">
                            Enterprise Instance Ready
                        </p>
                        <div className="h-px w-8 bg-border" />
                    </div>
                </div>

                {/* Progress bar showing auto-dismiss */}
                <div className="w-48 h-1 rounded-full bg-primary/5 overflow-hidden mt-2 relative">
                    <div
                        className="h-full bg-primary rounded-full"
                        style={{
                            animation: visible && !leaving ? 'progress-fill 3.4s linear 0.1s forwards' : 'none',
                        }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-10deg); }
        }
        @keyframes progress-fill {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
        </div>
    )
}
