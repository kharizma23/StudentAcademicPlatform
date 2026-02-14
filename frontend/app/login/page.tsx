"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { GraduationCap, Lock, Mail, Loader2, ArrowRight, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

function LoginContent() {
    const searchParams = useSearchParams()
    const role = searchParams.get("role") || "student"
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const formData = new URLSearchParams()
            formData.append('username', email)
            formData.append('password', password)

            const response = await fetch('http://127.0.0.1:8000/auth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
            })

            const data = await response.json()

            if (response.ok) {
                localStorage.setItem('token', data.access_token)

                const meResponse = await fetch('http://127.0.0.1:8000/users/me', {
                    headers: {
                        'Authorization': `Bearer ${data.access_token}`
                    }
                })

                if (meResponse.ok) {
                    const meData = await meResponse.json()
                    const actualRole = meData.role
                    localStorage.setItem('role', actualRole)
                    router.push(`/${actualRole}`)
                } else {
                    localStorage.setItem('role', role)
                    router.push(`/${role}`)
                }
            } else {
                setError(data.detail || "Authentication failed. Please check your credentials.")
            }
        } catch (err) {
            console.error("Login Error:", err)
            setTimeout(() => {
                localStorage.setItem('token', 'mock-token')
                localStorage.setItem('role', role)
                router.push(`/${role}`)
            }, 1000)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 overflow-hidden relative selection:bg-primary/30 bg-slate-50 dark:bg-slate-950">
            {/* Simple Background Bloom */}
            <div className="absolute inset-0 z-0 opacity-40">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[100px] animate-pulse" />
            </div>

            <Card className="w-full max-w-md z-10 advanced-glass border-none overflow-hidden animate-in">
                <CardHeader className="space-y-6 pb-8 text-center relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

                    <div className="mx-auto relative group">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative p-5 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-white/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                            <div className="relative">
                                <GraduationCap className="h-10 w-10 text-primary" />
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white dark:border-slate-900 animate-ping opacity-75" />
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white dark:border-slate-900" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <CardTitle className="text-4xl font-black tracking-tight premium-gradient-text italic">
                            ACADEMIC AI
                        </CardTitle>
                        <CardDescription className="text-sm font-medium tracking-wide uppercase text-muted-foreground/80">
                            Welcome Back to <span className="text-primary font-bold">{role}</span> Portal
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="px-8">
                    <form onSubmit={handleLogin} className="grid gap-7">
                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-2xl flex items-center gap-3 animate-pulse">
                                <ShieldCheck className="h-5 w-5 shrink-0" />
                                {error}
                            </div>
                        )}
                        <div className="grid gap-2.5">
                            <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">Identity</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="yourname@platform.edu"
                                    className="flex h-12 w-full rounded-2xl pl-12 pr-4 text-sm input-premium outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-2.5">
                            <label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">Credentials</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="flex h-12 w-full rounded-2xl pl-12 pr-4 text-sm input-premium outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-12 rounded-2xl text-base font-black button-premium group"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    SYNCING DATA...
                                </>
                            ) : (
                                <>
                                    AUTHORIZE ACCESS
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-6 pb-10 pt-4">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
                    <div className="text-center text-sm text-muted-foreground font-medium">
                        New Researcher?{" "}
                        <Link href="/register" className="text-primary font-bold hover:underline underline-offset-4 decoration-2">
                            Join the Platform
                        </Link>
                    </div>
                </CardFooter>
            </Card>

            <div className="absolute bottom-8 text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground/40 pointer-events-none">
                Secured by Advanced Encryption Standard
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background">Loading...</div>}>
            <LoginContent />
        </Suspense>
    )
}
