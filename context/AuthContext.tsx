'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import { onAuthStateChange, getGoogleRedirectResult } from '@/lib/firebase/auth'

interface AuthContextValue {
    user: User | null
    loading: boolean
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true })

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Handle the result of a Google redirect sign-in (mobile flow)
        getGoogleRedirectResult().catch(() => {
            // Not a redirect sign-in, or already handled — silently ignore
        })

        const unsubscribe = onAuthStateChange((firebaseUser) => {
            setUser(firebaseUser)
            setLoading(false)
        })
        return unsubscribe
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}

