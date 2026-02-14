"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { GraduationCap, Lock, Mail, Loader2, ArrowRight, ShieldCheck, UserPlus } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (password !== confirmPassword) {
            setError("Passwords do not match.")
            setLoading(false)
            return
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/users/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    role: "student" // Backend will override this based on domain
                }),
            })

            const data = await response.json()

            if (response.ok) {
                setSuccess(true)
                setTimeout(() => {
                    router.push("/login")
                }, 2000)
            } else {
                setError(data.detail || "Registration failed. Please try again.")
            }
        } catch (err) {
            console.error("Registration Error:", err)
            setError("Server unreachable. Please ensure the backend is running.")
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md glass-card text-center p-8 space-y-4">
                    <div className="mx-auto p-4 rounded-full bg-emerald-500/10 w-fit">
                        <ShieldCheck className="h-12 w-12 text-emerald-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Registration Successful!</CardTitle>
                    <p className="text-muted-foreground">Your account has been created. Redirecting to login...</p>
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                </Card>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background/95 p-4 overflow-hidden relative selection:bg-primary/30">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[100px]" />
            </div>

            <Card className="w-full max-w-md z-10 glass-card border-none overflow-hidden animate-in">
                <CardHeader className="space-y-4 pb-8 text-center">
                    <div className="mx-auto p-3 rounded-2xl bg-primary/10 w-fit">
                        <UserPlus className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-3xl font-extrabold tracking-tight">Create Account</CardTitle>
                        <CardDescription className="text-base mt-2">
                            Join the academic intelligence network
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="grid gap-6">
                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl flex items-center gap-3">
                                <ShieldCheck className="h-5 w-5 shrink-0" />
                                {error}
                            </div>
                        )}
                        <div className="grid gap-2">
                            <label className="text-sm font-semibold text-muted-foreground ml-1">Academic Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="yourid@university.edu"
                                    className="flex h-11 w-full rounded-xl border border-input bg-background/50 pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all duration-200"
                                    required
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground ml-1 mt-1">Use <b>@faculty.com</b> for faculty access.</p>
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-semibold text-muted-foreground ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="flex h-11 w-full rounded-xl border border-input bg-background/50 pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all duration-200"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-semibold text-muted-foreground ml-1">Confirm Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="flex h-11 w-full rounded-xl border border-input bg-background/50 pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all duration-200"
                                    required
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    Create My Account
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 pb-8">
                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary font-bold hover:underline underline-offset-4">
                            Sign In
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
