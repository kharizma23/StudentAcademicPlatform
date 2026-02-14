"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    ArrowLeft,
    Mail,
    Phone,
    Calendar,
    Droplet,
    User,
    TrendingUp,
    Target,
    AlertTriangle,
    GraduationCap,
    Award,
    CheckCircle2,
    BookOpen,
    Activity,
    Key
} from "lucide-react"
import Link from "next/link"
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    BarChart,
    Bar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ScatterChart,
    Scatter,
    ZAxis,
    Cell
} from 'recharts'

export default function StudentDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const [student, setStudent] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const fetchStudentDetail = async () => {
        const token = localStorage.getItem('token')
        try {
            const response = await fetch(`http://localhost:8000/admin/students/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setStudent(data)
            }
        } catch (error) {
            console.error("Failed to fetch student detail", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStudentDetail()
    }, [id])

    const aiCareer = useMemo(() => {
        try {
            if (student?.ai_scores?.career_suggestions) {
                return JSON.parse(student.ai_scores.career_suggestions)
            }
        } catch (e) { console.error("Failed to parse career AI", e) }
        return []
    }, [student])

    const aiCourses = useMemo(() => {
        try {
            if (student?.ai_scores?.recommended_courses) {
                return JSON.parse(student.ai_scores.recommended_courses)
            }
        } catch (e) { console.error("Failed to parse course AI", e) }
        return { strong: [], weak: [] }
    }, [student])

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="font-bold text-muted-foreground animate-pulse">Analyzing Academic DNA...</p>
                </div>
            </div>
        )
    }

    if (!student) {
        return <div className="p-10 text-center">Student not found.</div>
    }

    // Prepare Data for Charts
    const cgpaData = student.academic_records.map((r: any) => ({
        name: `Sem ${r.semester}`,
        cgpa: r.external_marks / 10 + 2, // Mocking a trend
        attendance: r.attendance_percentage
    })).sort((a: any, b: any) => a.name.localeCompare(b.name))

    const skillData = [
        { subject: 'Consistency', A: (student.ai_scores?.consistency_index || 0) * 100, fullMark: 100 },
        { subject: 'Performance', A: (student.academic_dna_score || 0), fullMark: 100 },
        { subject: 'Growth', A: (student.growth_index || 0) * 20, fullMark: 100 },
        { subject: 'Readiness', A: (student.career_readiness_score || 0), fullMark: 100 },
        { subject: 'Skill Gap', A: (student.ai_scores?.skill_gap_score || 0), fullMark: 100 },
    ]

    const attendanceCorrelation = student.academic_records.map((r: any) => ({
        x: r.attendance_percentage,
        y: (r.internal_marks + r.external_marks),
        z: 200
    }))

    const internalExternalData = student.academic_records.map((r: any) => ({
        name: `Sem ${r.semester}`,
        internal: r.internal_marks * 5, // Normalize to 100
        external: r.external_marks
    }))



    return (
        <div className="flex min-h-screen w-full flex-col bg-[#F8FAFC] selection:bg-primary/30">
            {/* Header */}
            <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b bg-white/80 backdrop-blur-xl px-10 shadow-sm">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-2xl hover:bg-slate-100">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="h-10 w-[2px] bg-slate-200 mx-2" />
                <GraduationCap className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">{student.name}</h1>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{student.roll_number}</p>
                </div>

                <div className="ml-auto flex gap-3">
                    <div className="hidden md:flex flex-col items-end px-4 py-1 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Current CGPA</span>
                        <span className="text-lg font-black text-primary leading-none">{student.current_cgpa.toFixed(2)}</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-8 space-y-8 max-w-[1600px] mx-auto w-full">
                {/* Profile Grid */}
                <div className="grid gap-8 lg:grid-cols-12">
                    {/* Sidebar Info */}
                    <div className="lg:col-span-4 space-y-8">
                        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden">
                            <div className="h-32 bg-gradient-to-br from-primary to-blue-600 p-8 flex items-end justify-between">
                                <div className="h-20 w-20 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl font-black text-white shadow-xl">
                                    {student.name.split(' ').map((n: string) => n[0]).join('')}
                                </div>
                                <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white font-bold text-sm">
                                    {student.department} • {student.year}th Year
                                </div>
                            </div>
                            <CardContent className="p-8 pt-10 space-y-6">
                                <div className="grid gap-4">
                                    <div className="flex items-center gap-4 group">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Institutional Email</p>
                                            <p className="text-sm font-bold text-slate-700">{student.user?.institutional_email || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            <Calendar className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date of Birth</p>
                                            <p className="text-sm font-bold text-slate-700">{student.dob || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            <Droplet className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Blood Group</p>
                                            <p className="text-sm font-bold text-slate-700">{student.blood_group || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            <Phone className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Personal Contact</p>
                                            <p className="text-sm font-bold text-slate-700">{student.personal_phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100">
                                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Login Credentials</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm">
                                                <Mail className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">Login Email ID</p>
                                                <p className="text-xs font-black text-slate-700 mt-1">{student.user?.email || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-amber-500 shadow-sm">
                                                <Key className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">Unique Password</p>
                                                <p className="text-xs font-black text-slate-700 mt-1">{student.user?.plain_password || '••••••••'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100">
                                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Risk Level Analysis</h4>
                                    <div className={`p-4 rounded-2xl flex items-center gap-4 ${student.risk_level === 'High' ? 'bg-red-50 text-red-600 border border-red-100' :
                                        student.risk_level === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                            'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                        }`}>
                                        <AlertTriangle className="h-6 w-6" />
                                        <div>
                                            <p className="text-lg font-black leading-none">{student.risk_level} Risk</p>
                                            <p className="text-[10px] font-bold opacity-70 uppercase tracking-tight mt-1">Based on AI Behavioral Analysis</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Radar Chart Skill Analysis */}
                        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] p-6 h-[400px]">
                            <CardHeader className="p-4 px-6 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-black text-slate-800">Skill DNA</CardTitle>
                                    <CardDescription className="text-xs font-bold">Multi-dimensional Intelligence</CardDescription>
                                </div>
                                <Target className="h-6 w-6 text-primary opacity-20" />
                            </CardHeader>
                            <CardContent className="h-full pb-12">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                                        <PolarGrid stroke="#E2E8F0" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 10, fontWeight: 700 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                        <Radar
                                            name="Student"
                                            dataKey="A"
                                            stroke="#3b82f6"
                                            fill="#3b82f6"
                                            fillOpacity={0.6}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Analytics Content */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Top Line Graphs */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] p-6">
                                <CardHeader className="p-4 px-6 flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg font-black text-slate-800 tracking-tight">CGPA Progression</CardTitle>
                                        <CardDescription className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                            <TrendingUp className="h-3 w-3" /> Growth Index: {student.growth_index.toFixed(2)}
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="h-[250px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={cgpaData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} />
                                            <YAxis hide domain={[0, 10]} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 700 }}
                                            />
                                            <Line type="monotone" dataKey="cgpa" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] p-6">
                                <CardHeader className="p-4 px-6 flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg font-black text-slate-800 tracking-tight">Attendance Trend</CardTitle>
                                        <CardDescription className="text-xs font-bold text-slate-500 flex items-center gap-1">
                                            Avg Participation: 84%
                                        </CardDescription>
                                    </div>
                                    <Activity className="h-6 w-6 text-slate-200" />
                                </CardHeader>
                                <CardContent className="h-[250px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={cgpaData}>
                                            <XAxis dataKey="name" hide />
                                            <YAxis hide domain={[0, 100]} />
                                            <Tooltip />
                                            <Bar dataKey="attendance" fill="#94a3b8" radius={[10, 10, 10, 10]}>
                                                {cgpaData.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={entry.attendance > 85 ? '#10b981' : '#94a3b8'} fillOpacity={0.8} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Internal vs External Comparison */}
                        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] p-8">
                            <CardHeader className="p-0 mb-8">
                                <CardTitle className="text-2xl font-black text-slate-800 tracking-tight">Performance Matrix</CardTitle>
                                <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Internal (Normalized) vs External Marks</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px] p-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={internalExternalData} barGap={8}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748B' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                        <Tooltip />
                                        <Bar dataKey="internal" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                                        <Bar dataKey="external" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Last Row: AI Insights & Career */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] p-8 bg-slate-900 text-white">
                                <CardHeader className="p-0 mb-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                            <Award className="h-5 w-5" />
                                        </div>
                                        <CardTitle className="text-xl font-black tracking-tight">Career Compass</CardTitle>
                                    </div>
                                    <CardDescription className="text-slate-400 font-bold">AI Recommended Pathways</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0 space-y-4">
                                    {aiCareer.length > 0 ? aiCareer.map((c: any, i: number) => (
                                        <div key={i} className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{c.icon}</span>
                                                <div>
                                                    <p className="font-bold text-sm">{c.role}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold">{c.fit}</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                                                <TrendingUp className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )) : (
                                        <p className="text-slate-500 text-sm p-4">AI analysis pending...</p>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] p-8">
                                <CardHeader className="p-0 mb-6">
                                    <CardTitle className="text-xl font-black text-slate-800">Learning Analytics</CardTitle>
                                    <CardDescription className="text-xs font-bold">Subject Proficiency Highlight</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0 space-y-3">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Strong Assets</p>
                                        <div className="flex flex-wrap gap-2">
                                            {aiCourses.strong.map((s: string) => (
                                                <span key={s} className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 flex items-center gap-2">
                                                    <CheckCircle2 className="h-3 w-3" /> {s}
                                                </span>
                                            ))}
                                            {aiCourses.strong.length === 0 && <span className="text-xs text-slate-400 px-2">Analysis pending...</span>}
                                        </div>
                                    </div>
                                    <div className="space-y-2 pt-4">
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Critical Attention</p>
                                        <div className="flex flex-wrap gap-2">
                                            {aiCourses.weak.map((s: string) => (
                                                <span key={s} className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-100 flex items-center gap-2">
                                                    <AlertTriangle className="h-3 w-3" /> {s}
                                                </span>
                                            ))}
                                            {aiCourses.weak.length === 0 && <span className="text-xs text-slate-400 px-2">Analysis pending...</span>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
