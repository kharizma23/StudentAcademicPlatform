"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    ArrowLeft,
    Mail,
    Phone,
    Award,
    BookOpen,
    Layout,
    TrendingUp,
    Star,
    Search,
    Brain,
    Rocket,
    CheckCircle2,
    Calendar,
    Briefcase
} from "lucide-react"
import {
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    Radar,
    PolarRadiusAxis,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Cell
} from 'recharts'

export default function StaffDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const [staff, setStaff] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const fetchStaffDetail = async () => {
        const token = localStorage.getItem('token')
        try {
            const response = await fetch(`http://localhost:8000/admin/staff/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setStaff(data)
            }
        } catch (error) {
            console.error("Failed to fetch staff detail", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStaffDetail()
    }, [id])

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="font-bold text-muted-foreground animate-pulse">Syncing Professional Data...</p>
                </div>
            </div>
        )
    }

    if (!staff) return <div className="p-10 text-center">Staff not found.</div>

    const metricData = [
        { subject: 'Consistency', A: (staff.consistency_score || 0) * 100, fullMark: 100 },
        { subject: 'Feedback', A: (staff.student_feedback_rating || 0) * 20, fullMark: 100 },
        { subject: 'Projects', A: Math.min((staff.projects_completed || 0) * 4, 100), fullMark: 100 },
        { subject: 'Publications', A: Math.min((staff.publications_count || 0) * 8, 100), fullMark: 100 },
        { subject: 'Skill Index', A: 85, fullMark: 100 },
    ]

    const contributionData = [
        { name: 'Projects', value: staff.projects_completed, color: '#3b82f6' },
        { name: 'Research', value: staff.publications_count, color: '#10b981' },
        { name: 'Mentorship', value: 12, color: '#f43f5e' },
        { name: 'Curriculum', value: 8, color: '#8b5cf6' },
    ]

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#F8FAFC] selection:bg-primary/30">
            {/* Header */}
            <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b bg-white/80 backdrop-blur-xl px-10 shadow-sm">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-2xl hover:bg-slate-100">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="h-10 w-[2px] bg-slate-200 mx-2" />
                <Briefcase className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">{staff.name}</h1>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{staff.staff_id}</p>
                </div>

                <div className="ml-auto flex items-center gap-4">
                    <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 flex items-center gap-2">
                        <Star className="h-4 w-4 fill-emerald-600" />
                        <span className="text-sm font-black">{staff.student_feedback_rating} Rating</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-8 space-y-8 max-w-[1600px] mx-auto w-full">
                <div className="grid gap-8 lg:grid-cols-12">
                    {/* Left Column: Profile & Info */}
                    <div className="lg:col-span-4 space-y-8">
                        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                            <div className="h-32 bg-gradient-to-br from-slate-900 to-slate-800 p-8 flex items-end justify-between">
                                <div className="h-20 w-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl font-black text-white shadow-xl">
                                    {staff.name.split(' ').map((n: string) => n[0]).join('')}
                                </div>
                                <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white font-bold text-xs uppercase tracking-wider">
                                    {staff.department}
                                </div>
                            </div>
                            <CardContent className="p-8 pt-10 space-y-6">
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Professional Identity</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                <Award className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase">Designation</p>
                                                <p className="text-sm font-black text-slate-800">{staff.designation}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                                                <Brain className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase">Primary Expertise</p>
                                                <p className="text-sm font-black text-slate-800">{staff.primary_skill}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Educational Background</h4>
                                    <div className="space-y-4">
                                        <div className="relative pl-6 border-l-2 border-slate-100 flex flex-col gap-1">
                                            <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary border-4 border-white shadow-sm" />
                                            <p className="text-xs font-black text-slate-900">{staff.me_degree}</p>
                                            <p className="text-[10px] font-bold text-slate-500">{staff.me_college}</p>
                                        </div>
                                        <div className="relative pl-6 border-l-2 border-slate-100 flex flex-col gap-1">
                                            <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-slate-300 border-4 border-white" />
                                            <p className="text-xs font-black text-slate-900">{staff.be_degree}</p>
                                            <p className="text-[10px] font-bold text-slate-500">{staff.be_college}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Contact Gateway</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <Mail className="h-4 w-4" />
                                            <span className="text-xs font-bold">{staff.user?.institutional_email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <Phone className="h-4 w-4" />
                                            <span className="text-xs font-bold">{staff.personal_phone}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Analytics */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Performance Radar */}
                            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] p-8 bg-white">
                                <CardHeader className="p-0 mb-6">
                                    <CardTitle className="text-xl font-black text-slate-800">Professional DNA</CardTitle>
                                    <CardDescription className="text-xs font-bold uppercase tracking-tighter">AI Behavioral Analysis</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px] p-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={metricData}>
                                            <PolarGrid stroke="#f1f5f9" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 10, fontWeight: 700 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                            <Radar
                                                name="Staff"
                                                dataKey="A"
                                                stroke="#3b82f6"
                                                fill="#3b82f6"
                                                fillOpacity={0.6}
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Summary Metrics */}
                            <div className="grid grid-cols-2 gap-6">
                                <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] bg-indigo-600 text-white p-6 flex flex-col justify-between">
                                    <BookOpen className="h-8 w-8 opacity-20" />
                                    <div>
                                        <p className="text-3xl font-black">{staff.publications_count}</p>
                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Publications</p>
                                    </div>
                                </Card>
                                <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] bg-emerald-500 text-white p-6 flex flex-col justify-between">
                                    <Rocket className="h-8 w-8 opacity-20" />
                                    <div>
                                        <p className="text-3xl font-black">{staff.projects_completed}</p>
                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Projects</p>
                                    </div>
                                </Card>
                                <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white p-6 flex flex-col justify-between">
                                    <Star className="h-8 w-8 text-amber-400 fill-amber-400 opacity-20" />
                                    <div>
                                        <p className="text-3xl font-black text-slate-900">{staff.student_feedback_rating}</p>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Feedback</p>
                                    </div>
                                </Card>
                                <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white p-6 flex flex-col justify-between">
                                    <TrendingUp className="h-8 w-8 text-primary opacity-20" />
                                    <div>
                                        <p className="text-3xl font-black text-slate-900">{Math.round(staff.consistency_score * 100)}%</p>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Consistency</p>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        {/* Contribution Mix */}
                        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] p-10 bg-white">
                            <CardHeader className="p-0 mb-10">
                                <CardTitle className="text-2xl font-black text-slate-800 tracking-tight text-center">Impact Matrix</CardTitle>
                                <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 text-center">Distribution of academic and professional contributions</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px] p-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={contributionData} layout="vertical" margin={{ left: 40, right: 40 }}>
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 14, fontWeight: 800, fill: '#1e293b' }} />
                                        <Tooltip cursor={{ fill: 'transparent' }} />
                                        <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={32}>
                                            {contributionData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Recent Highlights */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] p-8 bg-slate-900 text-white">
                                <h4 className="text-xl font-black mb-6 flex items-center gap-3">
                                    <Award className="h-6 w-6 text-primary" /> Achievements
                                </h4>
                                <div className="space-y-4">
                                    {[
                                        "Best Paper Award at ICCET 2023",
                                        "Patent Filed: ML in Smart City Logic",
                                        "Outstanding Faculty Award 2022"
                                    ].map((a, i) => (
                                        <div key={i} className="flex gap-4 items-start p-4 rounded-2xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-all">
                                            <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                                            <p className="text-sm font-bold opacity-80">{a}</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] p-8 bg-white">
                                <h4 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                                    <Layout className="h-6 w-6 text-orange-500" /> Research Fields
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {["Neural Networks", "Ethics in AI", "Predictive Analytics", "System Architecture", "Open Source Dev"].map(f => (
                                        <span key={f} className="px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-600 hover:bg-primary/5 hover:border-primary/20 hover:text-primary transition-all cursor-default">
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
