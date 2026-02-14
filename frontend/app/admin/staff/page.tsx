"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldCheck, ArrowLeft, Filter, Users, Mail, Briefcase, UserPlus } from "lucide-react"
import Link from "next/link"

const departments = [
    "AIML", "AGRI", "EEE", "EIE", "ECE", "BT", "BME",
    "CIVIL", "IT", "MECH", "MECHATRONICS", "CSE", "FT", "FD", "AIDS"
]

export default function StaffPage() {
    const [selectedDept, setSelectedDept] = useState("AIML")
    const [staff, setStaff] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const fetchStaff = async () => {
        setLoading(true)
        const token = localStorage.getItem('token')
        try {
            const url = `http://127.0.0.1:8000/admin/staff?department=${selectedDept}`
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setStaff(data)
            }
        } catch (error) {
            console.error("Failed to fetch staff", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStaff()
    }, [selectedDept])

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#F8FAFC] selection:bg-primary/30">
            {/* Header */}
            <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur-md px-6 md:px-10">
                <Link href="/admin">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <ShieldCheck className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold tracking-tight">Staff Management</h1>
            </header>

            <main className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Faculty Directory</h2>
                        <p className="text-slate-500 font-medium mt-1">Manage and view professional profiles of institutional staff.</p>
                    </div>
                    <Link href="/admin/staff/add">
                        <Button className="bg-indigo-600 text-white font-black px-8 py-6 rounded-2xl shadow-xl shadow-indigo-200 flex items-center gap-2 group transform transition-all hover:scale-105 active:scale-95">
                            <UserPlus className="h-5 w-5" />
                            Onboard Faculty
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                        <CardTitle className="flex items-center gap-2 text-slate-800">
                            <Filter className="h-5 w-5 text-primary" />
                            Department Selection
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex flex-wrap gap-2">
                            {departments.map(dept => (
                                <button
                                    key={dept}
                                    onClick={() => setSelectedDept(dept)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${selectedDept === dept
                                        ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                                        : "bg-white text-slate-600 border border-slate-200 hover:border-primary/50 hover:bg-slate-50"
                                        }`}
                                >
                                    {dept}
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Staff List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                            <Users className="h-6 w-6 text-primary" />
                            Faculty in {selectedDept}
                            <span className="ml-2 text-sm font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                                {staff.length} Members
                            </span>
                        </h3>
                    </div>

                    {loading ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-48 rounded-[2rem] bg-white animate-pulse shadow-sm" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {staff.map((member) => (
                                <Link key={member.id} href={`/admin/staff/${member.id}`}>
                                    <Card className="group relative border-none shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 rounded-[2rem] overflow-hidden bg-white cursor-pointer h-full">
                                        <CardContent className="p-8">
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center font-black text-primary text-xl group-hover:from-primary group-hover:to-blue-600 group-hover:text-white transition-all duration-500 uppercase">
                                                    {member.name.split(' ').map((n: string) => n[0]).join('')}
                                                </div>
                                                <div className="px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {member.staff_id}
                                                </div>
                                            </div>

                                            <h4 className="font-extrabold text-xl text-slate-900 mb-1 group-hover:text-primary transition-colors">
                                                {member.name}
                                            </h4>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter mb-4 flex items-center gap-1">
                                                <Briefcase className="h-3 w-3" /> {member.designation}
                                            </p>

                                            <div className="pt-4 border-t border-slate-50 space-y-2">
                                                <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-600 transition-colors">
                                                    <Mail className="h-4 w-4" />
                                                    <span className="text-xs font-bold">{member.personal_email || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-bold text-slate-300 uppercase">Specialization</span>
                                                        <span className="text-xs font-bold text-slate-700">{member.primary_skill}</span>
                                                    </div>
                                                    <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all transform group-hover:translate-x-1">
                                                        <ArrowLeft className="h-4 w-4 rotate-180" />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}

                    {!loading && staff.length === 0 && (
                        <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-sm">
                            <Users className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-600">No faculty members found</h3>
                            <p className="text-sm text-slate-400 font-medium">Try selecting a different department.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
