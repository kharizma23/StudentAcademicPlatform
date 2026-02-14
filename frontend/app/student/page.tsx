"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Activity,
    Target,
    Zap,
    TrendingUp,
    ArrowUpRight,
    CheckCircle2,
    Circle,
    Calendar,
    Clock,
    Plus,
    BrainCircuit,
    Sparkles,
    MessageSquare,
    ChevronRight,
    LayoutDashboard,
    ListTodo
} from "lucide-react"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { cn } from "@/lib/utils"

export default function StudentDashboard() {
    const [student, setStudent] = useState<any>(null)
    const [todos, setTodos] = useState<any[]>([])
    const [studyPlan, setStudyPlan] = useState<any[]>([])
    const [newTodo, setNewTodo] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const token = localStorage.getItem('token')
        const headers = { 'Authorization': `Bearer ${token}` }

        try {
            const [profileRes, todosRes, planRes] = await Promise.all([
                fetch("http://127.0.0.1:8000/student/profile", { headers }),
                fetch("http://127.0.0.1:8000/student/todos", { headers }),
                fetch("http://127.0.0.1:8000/student/study-plan", { headers })
            ])

            if (profileRes.ok) setStudent(await profileRes.json())
            if (todosRes.ok) setTodos(await todosRes.json())
            if (planRes.ok) setStudyPlan(await planRes.json())
        } catch (error) {
            console.error("Failed to fetch dashboard data", error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTodo) return

        const token = localStorage.getItem('token')
        const response = await fetch("http://127.0.0.1:8000/student/todos", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task_name: newTodo })
        })

        if (response.ok) {
            setNewTodo("")
            fetchData()
        }
    }

    const toggleTodo = async (id: string) => {
        const token = localStorage.getItem('token')
        await fetch(`http://127.0.0.1:8000/student/todos/${id}`, {
            method: "PATCH",
            headers: { 'Authorization': `Bearer ${token}` }
        })
        fetchData()
    }

    if (loading) return (
        <div className="flex items-center justify-center h-[600px]">
            <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-in pb-10">
            {/* Main Content Area (70%) */}
            <div className="flex-1 space-y-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-black tracking-tight premium-gradient-text">Student Dashboard</h1>
                    <p className="text-slate-500 font-medium">Welcome back, {student?.name}. Ready to level up your academics?</p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Cumulative GPA"
                        value={student?.current_cgpa || "0.0"}
                        subValue="Live Academic Standing"
                        icon={Target}
                    />
                    <StatCard
                        title="AI Risk Level"
                        value={student?.risk_level || "Low"}
                        icon={Zap}
                        color={student?.risk_level === "High" ? "text-rose-500" : "text-emerald-500"}
                    />
                    <StatCard
                        title="Growth Index"
                        value={student?.growth_index?.toFixed(1) || "0.0"}
                        subValue="Skill progression rate"
                        icon={TrendingUp}
                    />
                    <StatCard
                        title="Readiness"
                        value={`${student?.career_readiness_score?.toFixed(0) || "0"}%`}
                        subValue="Market fit score"
                        icon={Activity}
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Todo List Widget */}
                    <Card className="glass-card border-none shadow-xl overflow-hidden rounded-[2rem]">
                        <CardHeader className="bg-slate-900 text-white p-6">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <ListTodo className="h-5 w-5" />
                                    Daily Roadmap
                                </CardTitle>
                                <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                                    {todos.filter(t => !t.is_completed).length} Tasks Left
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
                                <Input
                                    placeholder="Add a new academic goal..."
                                    className="rounded-xl border-slate-100 h-10"
                                    value={newTodo}
                                    onChange={(e) => setNewTodo(e.target.value)}
                                />
                                <Button size="icon" className="rounded-xl shrink-0">
                                    <Plus className="h-5 w-5" />
                                </Button>
                            </form>
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {todos.map((todo) => (
                                    <div
                                        key={todo.id}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-2xl transition-all border border-transparent",
                                            todo.is_completed ? "bg-slate-50 opacity-60" : "bg-white border-slate-100 hover:border-primary/20 hover:shadow-lg hover:shadow-slate-200/50"
                                        )}
                                    >
                                        <button onClick={() => toggleTodo(todo.id)}>
                                            {todo.is_completed ? (
                                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                            ) : (
                                                <Circle className="h-5 w-5 text-slate-300" />
                                            )}
                                        </button>
                                        <span className={cn("text-sm font-bold flex-1", todo.is_completed && "line-through")}>
                                            {todo.task_name}
                                        </span>
                                    </div>
                                ))}
                                {todos.length === 0 && (
                                    <div className="text-center py-10">
                                        <p className="text-xs font-bold text-slate-400">No active goals. Set your first goal!</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* 60-Day Study Tracker */}
                    <Card className="glass-card border-none shadow-xl rounded-[2rem]">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Calendar className="h-5 w-5 text-primary" />
                                60-Day Growth Plan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <div className="grid grid-cols-6 gap-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar p-1">
                                {studyPlan.map((day) => (
                                    <div
                                        key={day.id}
                                        className={cn(
                                            "aspect-square rounded-xl flex flex-col items-center justify-center border-2 transition-all cursor-pointer group relative",
                                            day.is_completed
                                                ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                                                : "bg-white border-slate-100 hover:border-primary/30 text-slate-400"
                                        )}
                                    >
                                        <span className="text-[10px] font-black">{day.day_number}</span>
                                        <div className="absolute inset-0 bg-slate-900 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1 text-[8px] text-white text-center font-bold">
                                            {day.topic}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Performance Chart */}
                <Card className="glass-card border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="pb-0">
                        <CardTitle className="text-xl font-black">Performance Projection</CardTitle>
                        <CardDescription>AI-backed academic trajectory based on current efforts</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                                { name: 'Sem 1', val: 7.2 },
                                { name: 'Sem 2', val: 7.8 },
                                { name: 'Sem 3', val: 7.5 },
                                { name: 'Sem 4', val: 8.2 },
                            ]}>
                                <defs>
                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                                <Tooltip />
                                <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={3} fill="url(#colorVal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* AI Assistant Sidebar (30%) */}
            <div className="w-full lg:w-[350px] space-y-6">
                <Card className="glass-card border-none bg-slate-900 text-white rounded-[2.5rem] shadow-2xl p-8 sticky top-24">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center animate-pulse">
                                <BrainCircuit className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black">AI Coaching</h3>
                                <p className="text-xs text-white/50 font-bold uppercase tracking-widest">Personal Navigator</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 group hover:bg-white/10 transition-colors cursor-pointer">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="flex items-center gap-2 text-[10px] font-black uppercase text-primary tracking-widest">
                                        <Sparkles className="h-3 w-3" />
                                        Career Insight
                                    </span>
                                    <ChevronRight className="h-3 w-3 opacity-30 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="text-sm font-bold leading-snug">
                                    {(() => {
                                        const suggestions = student?.ai_scores?.career_suggestions;
                                        if (!suggestions) return "Waiting for faculty feedback to generate career roadmap...";
                                        try {
                                            const parsed = JSON.parse(suggestions);
                                            return (
                                                <div className="space-y-2">
                                                    <p className="text-primary">{parsed.primary_path || parsed[0] || "Standard Path"}</p>
                                                    <p className="text-[10px] text-white/40 uppercase tracking-tighter">Growth: {parsed.growth_potential || "High"}</p>
                                                </div>
                                            );
                                        } catch (e) {
                                            return suggestions;
                                        }
                                    })()}
                                </div>
                            </div>

                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 group hover:bg-white/10 transition-colors cursor-pointer">
                                <span className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-2">
                                    <ArrowUpRight className="h-3 w-3" />
                                    Recommended Skills
                                </span>
                                <div className="text-sm font-bold leading-snug">
                                    {(() => {
                                        const courses = student?.ai_scores?.recommended_courses;
                                        if (!courses) return "Focus on building foundational projects in your core department subjects.";
                                        try {
                                            const parsed = JSON.parse(courses);
                                            const strong = parsed.strong || [];
                                            return (
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {strong.slice(0, 3).map((s: string, i: number) => (
                                                        <span key={i} className="text-[9px] bg-white/10 px-2 py-0.5 rounded-full">{s}</span>
                                                    ))}
                                                </div>
                                            );
                                        } catch (e) {
                                            return courses;
                                        }
                                    })()}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-4">Recent Faculty Feedback</h4>
                            <div className="space-y-3">
                                {student?.feedback?.length > 0 ? (
                                    student.feedback.slice(0, 2).map((fb: any) => (
                                        <div key={fb.id} className="text-xs leading-relaxed italic opacity-80 border-l-2 border-primary pl-3 bg-white/5 p-2 rounded-r-lg">
                                            "{fb.detailed_remarks?.substring(0, 80)}..."
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs opacity-50 italic">No feedback entries yet.</p>
                                )}
                            </div>
                        </div>

                        <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-black h-12 rounded-2xl flex items-center gap-2 mt-4">
                            <MessageSquare className="h-4 w-4" />
                            Chat with AI Mentor
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}

function StatCard({ title, value, subValue, icon: Icon, color = "text-slate-900" }: any) {
    return (
        <Card className="glass-card border-none shadow-lg hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[10px] font-black tracking-[0.15em] text-slate-400 uppercase">{title}</CardTitle>
                <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                </div>
            </CardHeader>
            <CardContent>
                <div className={cn("text-2xl font-black tracking-tighter mb-1", color)}>{value}</div>
                {subValue && <p className="text-[10px] text-slate-400 font-bold">{subValue}</p>}
            </CardContent>
        </Card>
    )
}
