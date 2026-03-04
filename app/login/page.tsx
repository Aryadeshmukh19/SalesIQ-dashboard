'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signInWithEmail, signInWithGoogle } from '@/lib/firebase/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { BarChart3, Loader2, Chrome } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [gLoading, setGLoading] = useState(false)

    async function handleEmailLogin(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await signInWithEmail(email, password)
            router.replace('/')
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to sign in'
            setError(friendlyError(msg))
        } finally {
            setLoading(false)
        }
    }

    async function handleGoogleLogin() {
        setError('')
        setGLoading(true)
        try {
            await signInWithGoogle()
            router.replace('/')
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Google sign-in failed'
            setError(friendlyError(msg))
        } finally {
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
                        <CardTitle className="text-xl">Welcome back</CardTitle>
                        <CardDescription>Sign in to your dashboard</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Google */}
                        <Button
                            variant="outline"
                            className="w-full gap-2"
                            onClick={handleGoogleLogin}
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
                        <form onSubmit={handleEmailLogin} className="space-y-3">
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
                                    autoComplete="current-password"
                                />
                            </div>

                            {error && (
                                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                    {error}
                                </p>
                            )}

                            <Button type="submit" className="w-full" disabled={loading || gLoading}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign in'}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="justify-center pt-2">
                        <p className="text-sm text-muted-foreground">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="font-medium text-primary hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

function friendlyError(msg: string): string {
    if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential'))
        return 'Invalid email or password. Please try again.'
    if (msg.includes('too-many-requests'))
        return 'Too many attempts. Please try again later.'
    if (msg.includes('popup-closed'))
        return 'Sign-in popup was closed. Please try again.'
    return 'Something went wrong. Please try again.'
}
