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
                className="relative flex flex-col items-center gap-6 text-center transition-all duration-500"
                style={{
                    opacity: visible && !leaving ? 1 : 0,
                    transform: visible && !leaving ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.96)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Animated emoji */}
                <div
                    className="text-6xl select-none"
                    style={{
                        animation: visible && !leaving ? 'wave 1.2s ease-in-out 0.3s 2' : 'none',
                    }}
                >
                    👋
                </div>

                {/* Text */}
                <div className="space-y-2">
                    <h1 className="font-serif text-4xl text-foreground sm:text-5xl">
                        Welcome back,
                    </h1>
                    <p className="font-serif text-5xl text-primary sm:text-6xl font-medium">
                        {firstName}
                    </p>
                    <p className="text-muted-foreground text-sm mt-4 font-sans">
                        Your dashboard is ready ✦
                    </p>
                </div>

                {/* Dismiss hint */}
                <p className="text-xs text-muted-foreground/60 font-sans mt-2">
                    Click anywhere to continue
                </p>

                {/* Progress bar showing auto-dismiss */}
                <div className="w-40 h-0.5 rounded-full bg-border overflow-hidden">
                    <div
                        className="h-full bg-primary rounded-full"
                        style={{
                            animation: visible && !leaving ? 'progress-fill 3.4s linear 0.1s forwards' : 'none',
                        }}
                    />
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
