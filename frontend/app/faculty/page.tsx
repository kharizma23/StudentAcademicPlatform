"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Users,
    TrendingUp,
    AlertTriangle,
    Search,
    Filter,
    ChevronRight,
    GraduationCap,
    MessageSquare,
    Save,
    CheckCircle2,
    X
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function FacultyDashboard() {
    const [staff, setStaff] = useState<any>(null)
    const [students, setStudents] = useState<any[]>([])
    const [selectedYear, setSelectedYear] = useState(1)
    const [loading, setLoading] = useState(true)
    const [showFeedbackModal, setShowFeedbackModal] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<any>(null)
    const [feedbackData, setFeedbackData] = useState<any>({
        detailed_remarks: "",
        ...Object.fromEntries(Array.from({ length: 25 }, (_, i) => [`q${i + 1}`, 5]))
    })

    useEffect(() => {
        fetchStaffProfile()
    }, [])

    useEffect(() => {
        if (staff) {
            fetchStudents()
        }
    }, [staff, selectedYear])

    const fetchStaffProfile = async () => {
        const token = localStorage.getItem('token')
        try {
            const response = await fetch("http://127.0.0.1:8000/staff/my-profile", {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                setStaff(await response.json())
            }
        } catch (error) {
            console.error("Failed to fetch staff profile", error)
        }
    }

    const fetchStudents = async () => {
        setLoading(true)
        const token = localStorage.getItem('token')
        try {
            const response = await fetch(`http://127.0.0.1:8000/staff/students?year=${selectedYear}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                setStudents(await response.json())
            }
        } catch (error) {
            console.error("Failed to fetch students", error)
        } finally {
            setLoading(false)
        }
    }

    const handleFeedbackSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const token = localStorage.getItem('token')

        // Map q1 to q1_technical_clarity etc in the backend format
        const metricNames = [
            "technical_clarity", "problem_solving", "code_efficiency", "algorithm_knowledge", "debugging_skills",
            "concept_application", "mathematical_aptitude", "system_design", "documentation_quality", "test_coverage_awareness",
            "presentation_skills", "collaborative_spirit", "adaptability", "curiosity_level", "deadline_discipline",
            "resourcefulness", "critical_thinking", "puncuality", "peer_mentoring", "leadership_potential",
            "ethical_awareness", "feedback_receptivity", "passion_for_field", "originality_of_ideas", "consistency_index"
        ]

        const payload: any = {
            student_id: selectedStudent.id,
            detailed_remarks: feedbackData.detailed_remarks
        }

        metricNames.forEach((name, i) => {
            payload[`q${i + 1}_${name}`] = feedbackData[`q${i + 1}`]
        })

        try {
            const response = await fetch("http://127.0.0.1:8000/staff/feedback", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            if (response.ok) {
                setShowFeedbackModal(false)
                setSelectedStudent(null)
                // Reset form
                setFeedbackData({
                    detailed_remarks: "",
                    ...Object.fromEntries(Array.from({ length: 25 }, (_, i) => [`q${i + 1}`, 5]))
                })
            }
        } catch (error) {
            console.error("Feedback submission failed", error)
        }
    }

    const metrics = [
        "Technical Clarity", "Problem Solving", "Code Efficiency", "Algorithm Knowledge", "Debugging Skills",
        "Concept Application", "Mathematical Aptitude", "System Design", "Documentation Quality", "Test Coverage Awareness",
        "Presentation Skills", "Collaborative Spirit", "Adaptability", "Curiosity Level", "Deadline Discipline",
        "Resourcefulness", "Critical Thinking", "Punctuality", "Peer Mentoring", "Leadership Potential",
        "Ethical Awareness", "Feedback Receptivity", "Passion for Field", "Originality of Ideas", "Consistency Index"
    ]

    return (
        <div className="flex flex-col gap-8 animate-in pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tight premium-gradient-text">Faculty Portal</h1>
                    <p className="text-slate-500 font-medium">Department of {staff?.department} | Evaluating {students.length} Students</p>
                </div>
                <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
                    {[1, 2, 3, 4].map((year) => (
                        <button
                            key={year}
                            onClick={() => setSelectedYear(year)}
                            className={cn(
                                "px-6 py-2 rounded-xl text-sm font-black transition-all",
                                selectedYear === year ? "bg-white shadow-lg text-primary scale-105" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            Year {year}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-6 md:grid-cols-3">
                <StatCard
                    title="Total Scoped Students"
                    value={students.length}
                    icon={Users}
                    subValue={`Active in ${staff?.department}`}
                />
                <StatCard
                    title="Avg Dept Performance"
                    value="7.82"
                    icon={TrendingUp}
                    subValue="+0.12 this semester"
                    color="text-emerald-600"
                />
                <StatCard
                    title="Pending Feedback"
                    value={students.length}
                    icon={AlertTriangle}
                    subValue="Evaluations required"
                    color="text-amber-500"
                />
            </div>

            {/* Student Directory Table-like View */}
            <Card className="glass-card border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-8 border-b border-slate-50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-xl font-black">Student Directory</CardTitle>
                            <CardDescription>Select a student to provide detailed academic feedback</CardDescription>
                        </div>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input placeholder="Search name or roll no..." className="pl-10 rounded-xl h-10 border-slate-100" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-50">
                        {loading ? (
                            <div className="p-20 text-center">
                                <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Fetching Directory...</p>
                            </div>
                        ) : (
                            students.map((student) => (
                                <div
                                    key={student.id}
                                    className="p-6 hover:bg-slate-50/50 transition-colors flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center text-xl font-black text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors uppercase">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 group-hover:text-primary transition-colors">{student.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-black uppercase text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded">
                                                    {student.roll_number}
                                                </span>
                                                <span className="text-[10px] font-black uppercase text-primary">CGP: {student.current_cgpa}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="hidden md:block text-right">
                                            <p className={cn(
                                                "text-xs font-black uppercase tracking-widest",
                                                student.risk_level === "High" ? "text-rose-500" : "text-emerald-500"
                                            )}>Risk: {student.risk_level}</p>
                                            <p className="text-[10px] text-slate-400 font-bold">Updated: Today</p>
                                        </div>
                                        <Button
                                            onClick={() => {
                                                setSelectedStudent(student)
                                                setShowFeedbackModal(true)
                                            }}
                                            className="rounded-xl bg-white text-slate-900 border border-slate-200 hover:bg-primary hover:text-white transition-all shadow-sm"
                                        >
                                            Assess Student
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                        {!loading && students.length === 0 && (
                            <div className="p-20 text-center space-y-4">
                                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                                    <Users className="h-8 w-8 text-slate-200" />
                                </div>
                                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No Students Found in this Batch</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Feedback Modal (25 Questions) */}
            {showFeedbackModal && selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <Card className="max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col rounded-[3rem] shadow-2xl border-none">
                        <CardHeader className="p-8 bg-slate-900 text-white flex flex-row items-center justify-between shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                    <GraduationCap className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-black">Performance Assessment</CardTitle>
                                    <CardDescription className="text-white/50">{selectedStudent.name} | {selectedStudent.roll_number}</CardDescription>
                                </div>
                            </div>
                            <button onClick={() => setShowFeedbackModal(false)} className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                            <form onSubmit={handleFeedbackSubmit} className="space-y-10">
                                <div className="grid gap-x-12 gap-y-8 md:grid-cols-2">
                                    {metrics.map((metric, index) => (
                                        <div key={index} className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">
                                                    Q{index + 1}. {metric}
                                                </label>
                                                <span className="text-lg font-black text-primary">{feedbackData[`q${index + 1}`]}</span>
                                            </div>
                                            <Input
                                                type="range"
                                                min="1"
                                                max="10"
                                                step="1"
                                                className="h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                                                value={feedbackData[`q${index + 1}`]}
                                                onChange={(e) => setFeedbackData({ ...feedbackData, [`q${index + 1}`]: parseInt(e.target.value) })}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 pt-6 border-t border-slate-100">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4" />
                                        Qualitative Assessment / AI Training Remarks
                                    </label>
                                    <Textarea
                                        required
                                        className="rounded-[2rem] border-slate-100 p-6 min-h-[120px] focus:ring-primary/20 text-slate-700 font-medium"
                                        placeholder="Discuss the student's research potential, project contributions, and areas where AI coaching should focus..."
                                        value={feedbackData.detailed_remarks}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFeedbackData({ ...feedbackData, detailed_remarks: e.target.value })}
                                    />
                                </div>

                                <Card className="p-8 bg-slate-50 border-none rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="text-center md:text-left">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Submission Impact</p>
                                        <p className="text-sm font-bold text-slate-600 mt-1">This evaluation will instantly update the student's AI Insight engine and Career Roadmap.</p>
                                    </div>
                                    <Button type="submit" className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black shadow-xl shadow-primary/20 transition-all flex items-center gap-3">
                                        <Save className="h-5 w-5" />
                                        Publish Evaluation
                                    </Button>
                                </Card>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

function StatCard({ title, value, subValue, icon: Icon, color = "text-slate-900" }: any) {
    return (
        <Card className="glass-card border-none shadow-xl hover:shadow-2xl transition-all duration-300 rounded-[2.5rem]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">{title}</CardTitle>
                <div className="p-3 rounded-2xl bg-slate-50">
                    <Icon className="h-5 w-5 text-primary" />
                </div>
            </CardHeader>
            <CardContent>
                <div className={cn("text-3xl font-black tracking-tight mb-1", color)}>{value}</div>
                {subValue && <p className="text-xs text-slate-400 font-bold">{subValue}</p>}
            </CardContent>
        </Card>
    )
}
