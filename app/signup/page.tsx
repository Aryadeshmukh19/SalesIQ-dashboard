'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUpWithEmail, signInWithGoogle } from '@/lib/firebase/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { BarChart3, Loader2, Chrome } from 'lucide-react'

export default function SignupPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [gLoading, setGLoading] = useState(false)

    async function handleEmailSignup(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        if (password !== confirm) {
            setError('Passwords do not match.')
            return
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.')
            return
        }
        setLoading(true)
        try {
            await signUpWithEmail(email, password)
            router.replace('/')
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to create account'
            setError(friendlyError(msg))
        } finally {
            setLoading(false)
        }
    }

    async function handleGoogleSignup() {
        setError('')
        setGLoading(true)
        try {
            const result = await signInWithGoogle()
            // On mobile (redirect flow) result is void — page will reload after Google auth.
            // AuthContext picks up the session on reload.
            if (result) {
                router.replace('/')
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Google sign-in failed'
            setError(friendlyError(msg))
            setGLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            {/* Background gradient orbs */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="mb-8 flex flex-col items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg">
                        <BarChart3 className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold tracking-tight">SalesIQ</h1>
                        <p className="text-sm text-muted-foreground">Smart Sales Intelligence</p>
                    </div>
                </div>

                <Card className="border-border/50 shadow-xl backdrop-blur-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl">Create your account</CardTitle>
                        <CardDescription>Get started with SalesIQ for free</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Google */}
                        <Button
                            variant="outline"
                            className="w-full gap-2"
                            onClick={handleGoogleSignup}
                            disabled={gLoading || loading}
                        >
                            {gLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Chrome className="h-4 w-4" />
                            )}
                            Continue with Google
                        </Button>

                        <div className="relative">
                            <Separator />
                            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                                or
                            </span>
                        </div>

                        {/* Email/Password */}
                        <form onSubmit={handleEmailSignup} className="space-y-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="confirm">Confirm password</Label>
                                <Input
                                    id="confirm"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                />
                            </div>

                            {error && (
                                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                    {error}
                                </p>
                            )}

                            <Button type="submit" className="w-full" disabled={loading || gLoading}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create account'}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="justify-center pt-2">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link href="/login" className="font-medium text-primary hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

function friendlyError(msg: string): string {
    if (msg.includes('email-already-in-use'))
        return 'An account with this email already exists.'
    if (msg.includes('weak-password'))
        return 'Password is too weak. Use at least 6 characters.'
    if (msg.includes('popup-closed'))
        return 'Sign-in popup was closed. Please try again.'
    return 'Something went wrong. Please try again.'
}
