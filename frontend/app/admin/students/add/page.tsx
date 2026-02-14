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
    Calendar,
    Droplets,
    School,
    CheckCircle2
} from "lucide-react"
import Link from "next/link"

const departments = [
    "AIML", "AGRI", "EEE", "EIE", "ECE", "BT", "BME",
    "CIVIL", "IT", "MECH", "MECHATRONICS", "CSE", "FT", "FD", "AIDS"
]

export default function AddStudentPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({
        full_name: "",
        department: "AIML",
        year: 1,
        dob: "",
        blood_group: "O+",
        parent_phone: "",
        personal_phone: "",
        personal_email: "",
        previous_school: "",
        password: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const token = localStorage.getItem('token')
        try {
            const response = await fetch("http://127.0.0.1:8000/admin/students", {
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
                    router.push("/admin/students")
                }, 2000)
            }
        } catch (error) {
            console.error("Failed to add student", error)
        } finally {
            setLoading(false)
        }
    }

    // Auto-generate email preview logic
    const batch = { 1: "25", 2: "24", 3: "23", 4: "22" }[formData.year as 1 | 2 | 3 | 4] || "25"
    const firstName = formData.full_name.trim().split(' ')[0].toLowerCase() || "name"
    const previewEmail = `${firstName}.${formData.department.toLowerCase()}${batch}@gmail.com`

    if (success) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
                <Card className="max-w-md w-full border-none shadow-2xl rounded-[3rem] p-10 text-center space-y-6">
                    <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">Student Enrolled!</h2>
                        <p className="text-slate-500 font-medium mt-2">The record has been added to the {formData.department} directory.</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3 justify-center">
                        <Mail className="h-4 w-4 text-primary" />
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
                <Link href="/admin/students">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <UserPlus className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold tracking-tight text-slate-900">Manual Enrollment</h1>
            </header>

            <main className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black tracking-tight text-slate-900">Student Details</h2>
                        <p className="text-slate-500 font-medium">Add a new student profile to the institutional database.</p>
                    </div>

                    <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                        <CardContent className="p-8 md:p-12 grid gap-8 md:grid-cols-2">
                            {/* Personal Info */}
                            <div className="space-y-6">
                                <h3 className="text-sm font-black text-primary uppercase tracking-widest border-b border-primary/10 pb-2">Identity</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">Full Name</Label>
                                        <Input
                                            required
                                            className="rounded-xl border-slate-200 focus:ring-primary h-12"
                                            placeholder="Ex: Ashwin Kumar"
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">Personal Email</Label>
                                        <Input
                                            required
                                            type="email"
                                            className="rounded-xl border-slate-200 focus:ring-primary h-12"
                                            placeholder="personal@gmail.com"
                                            value={formData.personal_email}
                                            onChange={(e) => setFormData({ ...formData, personal_email: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-slate-500 uppercase">Date of Birth</Label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                                                <Input
                                                    required
                                                    type="date"
                                                    className="pl-10 rounded-xl border-slate-200 h-12"
                                                    value={formData.dob}
                                                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-slate-500 uppercase">Blood Group</Label>
                                            <div className="relative">
                                                <Droplets className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                                                <select
                                                    className="w-full pl-10 h-12 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:ring-primary outline-none"
                                                    value={formData.blood_group}
                                                    onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                                                >
                                                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(bg => (
                                                        <option key={bg} value={bg}>{bg}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Academic & Contact */}
                            <div className="space-y-6">
                                <h3 className="text-sm font-black text-primary uppercase tracking-widest border-b border-primary/10 pb-2">Academic Info</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-slate-500 uppercase">Department</Label>
                                            <select
                                                className="w-full h-12 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:ring-primary outline-none px-3"
                                                value={formData.department}
                                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            >
                                                {departments.map(d => (
                                                    <option key={d} value={d}>{d}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-slate-500 uppercase">Year</Label>
                                            <select
                                                className="w-full h-12 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:ring-primary outline-none px-3"
                                                value={formData.year}
                                                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                            >
                                                {[1, 2, 3, 4].map(y => (
                                                    <option key={y} value={y}>{y} Year</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">Previous School</Label>
                                        <div className="relative">
                                            <School className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                                            <Input
                                                className="pl-10 rounded-xl border-slate-200 h-12"
                                                placeholder="Ex: KVS Matriculation"
                                                value={formData.previous_school}
                                                onChange={(e) => setFormData({ ...formData, previous_school: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-slate-500 uppercase">Student Phone (+91)</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                                                <Input
                                                    required
                                                    maxLength={10}
                                                    pattern="[0-9]{10}"
                                                    className="pl-10 rounded-xl border-slate-200 h-12"
                                                    placeholder="10-digit number"
                                                    value={formData.personal_phone}
                                                    onChange={(e) => setFormData({ ...formData, personal_phone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-slate-500 uppercase">Parent Phone (+91)</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                                                <Input
                                                    required
                                                    maxLength={10}
                                                    pattern="[0-9]{10}"
                                                    className="pl-10 rounded-xl border-slate-200 h-12"
                                                    placeholder="10-digit number"
                                                    value={formData.parent_phone}
                                                    onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">Set Password</Label>
                                        <div className="relative">
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
                            </div>
                        </CardContent>
                    </Card>

                    {/* Email Preview & Action */}
                    <Card className="border-none shadow-xl bg-slate-900 rounded-3xl overflow-hidden text-white flex flex-col md:flex-row items-center justify-between p-8 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                <Mail className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Auto-Generated Institutional Email</p>
                                <p className="text-lg font-black tracking-tight">{previewEmail}</p>
                            </div>
                        </div>
                        <Button
                            disabled={loading || !formData.full_name}
                            className="bg-primary hover:bg-primary/90 text-white font-black px-10 py-6 rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center gap-2 group text-base"
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Save className="h-5 w-5 group-hover:scale-110 transition-transform" />
                            )}
                            Enroll Student
                        </Button>
                    </Card>
                </form>
            </main>
        </div>
    )
}
