"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    ArrowLeft,
    UserPlus,
    Save,
    Mail,
    Phone,
    Briefcase,
    GraduationCap,
    Brain,
    CheckCircle2
} from "lucide-react"
import Link from "next/link"

const departments = [
    "AIML", "AGRI", "EEE", "EIE", "ECE", "BT", "BME",
    "CIVIL", "IT", "MECH", "MECHATRONICS", "CSE", "FT", "FD", "AIDS"
]

const designations = [
    "Assistant Professor", "Associate Professor", "Professor", "Head of Department"
]

export default function AddStaffPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({
        full_name: "",
        department: "AIML",
        designation: "Assistant Professor",
        be_degree: "",
        be_college: "",
        me_degree: "",
        me_college: "",
        primary_skill: "",
        personal_email: "",
        personal_phone: "",
        password: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const token = localStorage.getItem('token')
        try {
            const response = await fetch("http://127.0.0.1:8000/admin/staff", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })
            if (response.ok) {
                setSuccess(true)
                setTimeout(() => {
                    router.push("/admin/staff")
                }, 2000)
            }
        } catch (error) {
            console.error("Failed to add staff", error)
        } finally {
            setLoading(false)
        }
    }

    const firstName = formData.full_name.split(' ')[0] || "name"
    const previewEmail = `${firstName.toLowerCase()}${formData.department.toLowerCase()}777@gmail.com`

    if (success) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
                <Card className="max-w-md w-full border-none shadow-2xl rounded-[3rem] p-10 text-center space-y-6">
                    <div className="h-20 w-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">Faculty Onboarded!</h2>
                        <p className="text-slate-500 font-medium mt-2">The professional profile has been added to the {formData.department} registry.</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3 justify-center">
                        <Mail className="h-4 w-4 text-indigo-600" />
                        <span className="text-sm font-bold text-slate-600">{previewEmail}</span>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#F8FAFC]">
            {/* Header */}
            <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur-md px-6 md:px-10">
                <Link href="/admin/staff">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <Briefcase className="h-6 w-6 text-indigo-600" />
                <h1 className="text-xl font-bold tracking-tight text-slate-900">Faculty Onboarding</h1>
            </header>

            <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-2 text-center md:text-left">
                        <h2 className="text-3xl font-black tracking-tight text-slate-900">Professional Profile</h2>
                        <p className="text-slate-500 font-medium">Create a new faculty record with educational and expertise details.</p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                        {/* Column 1: Identity & Contact */}
                        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white p-8">
                            <div className="space-y-6">
                                <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Core Identity</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Full Name</Label>
                                        <Input
                                            required
                                            className="rounded-xl border-slate-200 h-12"
                                            placeholder="Dr. Ashwin Kumar"
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Department</Label>
                                            <select
                                                className="w-full h-12 rounded-xl border border-slate-200 bg-white text-sm font-medium outline-none px-3"
                                                value={formData.department}
                                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            >
                                                {departments.map(d => (
                                                    <option key={d} value={d}>{d}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Designation</Label>
                                            <select
                                                className="w-full h-12 rounded-xl border border-slate-200 bg-white text-sm font-medium outline-none px-3"
                                                value={formData.designation}
                                                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                            >
                                                {designations.map(d => (
                                                    <option key={d} value={d}>{d}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Personal Email</Label>
                                        <Input
                                            required
                                            type="email"
                                            className="rounded-xl border-slate-200 h-12"
                                            placeholder="ashwin@gmail.com"
                                            value={formData.personal_email}
                                            onChange={(e) => setFormData({ ...formData, personal_email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                                            <Input
                                                className="pl-10 rounded-xl border-slate-200 h-12"
                                                placeholder="+91 98765 43210"
                                                value={formData.personal_phone}
                                                onChange={(e) => setFormData({ ...formData, personal_phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Set Access Password</Label>
                                        <Input
                                            required
                                            type="password"
                                            className="rounded-xl border-slate-200 h-12"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Column 2: Education & Skills */}
                        <div className="space-y-8">
                            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white p-8">
                                <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2 mb-6">Expertise</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Primary Skill / Research Field</Label>
                                        <div className="relative">
                                            <Brain className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                                            <Input
                                                className="pl-10 rounded-xl border-slate-200 h-12"
                                                placeholder="Ex: Neural Networks"
                                                value={formData.primary_skill}
                                                onChange={(e) => setFormData({ ...formData, primary_skill: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">B.E. Degree</Label>
                                            <Input
                                                className="rounded-xl border-slate-200 h-12"
                                                placeholder="Ex: B.E. CSE"
                                                value={formData.be_degree}
                                                onChange={(e) => setFormData({ ...formData, be_degree: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Undergrad College</Label>
                                            <Input
                                                className="rounded-xl border-slate-200 h-12"
                                                placeholder="IIT Madras"
                                                value={formData.be_college}
                                                onChange={(e) => setFormData({ ...formData, be_college: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">M.E. / PhD Degree</Label>
                                            <Input
                                                className="rounded-xl border-slate-200 h-12"
                                                placeholder="Ex: M.E. AI"
                                                value={formData.me_degree}
                                                onChange={(e) => setFormData({ ...formData, me_degree: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Grad School</Label>
                                            <Input
                                                className="rounded-xl border-slate-200 h-12"
                                                placeholder="Stanford University"
                                                value={formData.me_college}
                                                onChange={(e) => setFormData({ ...formData, me_college: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="border-none shadow-xl bg-indigo-600 rounded-[2rem] overflow-hidden text-white p-8 flex flex-col items-center justify-between gap-4">
                                <div className="text-center">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Generated Email</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Mail className="h-4 w-4" />
                                        <p className="text-lg font-black tracking-tight">{previewEmail}</p>
                                    </div>
                                </div>
                                <Button
                                    disabled={loading || !formData.full_name}
                                    className="w-full bg-white text-indigo-600 hover:bg-slate-50 font-black h-12 rounded-xl flex items-center gap-2 group shadow-lg"
                                >
                                    {loading ? (
                                        <div className="h-5 w-5 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
                                    ) : (
                                        <Save className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                                    )}
                                    Complete Onboarding
                                </Button>
                            </Card>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    )
}
