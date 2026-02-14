"use client"
import { useEffect, useState, useMemo } from "react"
import React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Users,
    GraduationCap,
    Target,
    Award,
    AlertTriangle,
    TrendingUp,
    Layers,
    Briefcase,
    Activity,
    BarChart3,
    Zap,
    RefreshCw,
    Search,
    ShieldCheck,
    ChevronRight,
    ArrowUpRight,
    TrendingDown,
    Trash2,
    UserCircle,
    FileText,
    Mail
} from "lucide-react"
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    BarChart,
    Bar
} from "recharts"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

// --- Helper Components for Interactivity ---

function InterventionModal({ isOpen, onClose, cluster }: { isOpen: boolean, onClose: () => void, cluster: any }) {
    if (!cluster) return null;
    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={`Intervention Strategy: ${cluster.name}`}
            description="Tailored clinical and academic steps recommended by AI for this segment."
        >
            <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target Count</p>
                        <p className="text-2xl font-black text-slate-900">{cluster.count} Students</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Priority Level</p>
                        <p className="text-2xl font-black text-primary">Critical</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="font-black text-slate-800 flex items-center gap-2 uppercase text-xs tracking-widest">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        AI Recommended Actions
                    </h4>
                    <ul className="space-y-3">
                        {[
                            "Mandatory 1-on-1 performance review with Department HOD.",
                            "Enrolment in the 'Back-on-Track' Peer Mentoring program.",
                            "Bi-weekly counseling sessions to address academic stress levels.",
                            "Customized learning pathway with reduced extracurricular load."
                        ].map((task, i) => (
                            <li key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 text-xs font-bold text-slate-600 border border-slate-100 shadow-sm">
                                <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                                {task}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-4">
                    <h4 className="font-black text-slate-800 flex items-center gap-2 uppercase text-xs tracking-widest">
                        <div className="h-2 w-2 rounded-full bg-rose-500" />
                        Primary Impacted Students
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-[10px] font-black uppercase text-slate-400">
                        {["Roll #737622CSE101", "Roll #737622CSE142", "Roll #737622CSE189", "Roll #737622CSE204"].map(roll => (
                            <div key={roll} className="px-3 py-2 rounded-lg bg-white border border-slate-100 flex items-center justify-between">
                                <span>{roll}</span>
                                <ChevronRight className="h-3 w-3 text-slate-300" />
                            </div>
                        ))}
                    </div>
                </div>

                <Button className="w-full bg-slate-900 rounded-xl h-12 font-bold shadow-xl shadow-slate-200 hover:scale-[1.02] transition-all" onClick={onClose}>
                    Assign Mentors & Notify Students
                </Button>
            </div>
        </Dialog>
    );
}

function GlobalActionPlanModal({ isOpen, onClose, data }: { isOpen: boolean, onClose: () => void, data: any }) {
    if (!data || !data.action_plan) return null;
    const plan = data.action_plan;

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={`Institutional Action Plan`}
            description="Global strategic roadmap generated by AI based on institutional performance mapping."
            className="max-w-4xl"
        >
            <div className="space-y-8 py-4">
                <div className="bg-slate-900 p-8 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <ShieldCheck className="h-24 w-24" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-2">Executive Summary</p>
                        <h3 className="text-3xl font-bold font-serif leading-tight">{plan.executive_summary}</h3>
                    </div>
                    <div className="text-right relative z-10">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Projected Institutional ROI</p>
                        <p className="text-4xl font-black text-emerald-400">{plan.roi_efficiency}</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-800 uppercase text-xs tracking-[0.2em] flex items-center gap-2">
                            <Activity className="h-4 w-4 text-primary" /> Core Strategies
                        </h4>
                        <div className="space-y-3">
                            {plan.strategies.map((item: any, i: number) => (
                                <div key={i} className="p-4 rounded-2xl border bg-white shadow-sm hover:border-primary/30 transition-colors">
                                    <p className="font-black text-slate-900 text-sm mb-1">{item.label}</p>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.detail}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-800 uppercase text-xs tracking-[0.2em] flex items-center gap-2">
                            <Layers className="h-4 w-4 text-indigo-500" /> Resource Mapping
                        </h4>
                        <div className="p-6 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-between group hover:bg-indigo-100 transition-colors">
                            <div>
                                <p className="text-sm font-bold text-indigo-900">{plan.resource_label}</p>
                                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Budget Impact</p>
                            </div>
                            <p className="text-2xl font-black text-indigo-600">{plan.resource_value}</p>
                        </div>

                        <div className="space-y-3">
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Execution Roadmap</h5>
                            {plan.roadmap.map((step: any, i: number) => (
                                <div key={i} className="flex gap-4 items-center">
                                    <div className="h-8 w-8 rounded-full bg-white border-2 border-indigo-200 flex items-center justify-center text-[10px] font-bold text-indigo-500 shrink-0">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-indigo-500 uppercase">{step.title}</p>
                                        <p className="text-xs font-bold text-slate-600">{step.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex items-start gap-3 p-4 rounded-2xl border border-dashed text-xs font-medium text-slate-500 leading-relaxed italic">
                                <Zap className="h-4 w-4 text-amber-500 shrink-0" />
                                "{plan.insight_quote}"
                            </div>
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-14 rounded-2xl font-black text-white shadow-xl shadow-indigo-100 uppercase tracking-widest">
                                Finalize & Disseminate Plan
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}


function AddStudentModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        full_name: "", personal_email: "", password: "password123",
        department: "CSE", year: 1, dob: "", blood_group: "O+",
        parent_phone: "", personal_phone: "", previous_school: "", current_cgpa: 0.0
    });
    const batch = { 1: "25", 2: "24", 3: "23", 4: "22" }[formData.year as 1 | 2 | 3 | 4] || "25";
    const firstName = formData.full_name.trim().split(' ')[0].toLowerCase() || "name";
    const previewEmail = `${firstName}.${formData.department.toLowerCase()}${batch}@gmail.com`;
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8000/admin/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                alert("Student Enrolled! AI Career Compass & Analytics have been generated.");
                onSuccess();
                onClose();
            } else {
                alert("Failed to enroll student.");
            }
        } catch (err) { console.error(err); alert("Error enrolling student"); }
        finally { setLoading(false); }
    };

    if (!isOpen) return null;
    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="Enroll New Student" description="Create student profile and auto-generate AI analytics.">
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                        <input required className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700 outline-none focus:border-primary"
                            value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} placeholder="e.g. Kharizma A" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                        <input required type="email" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700 outline-none focus:border-primary"
                            value={formData.personal_email} onChange={e => setFormData({ ...formData, personal_email: e.target.value })} placeholder="student@example.com" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Department</label>
                        <select className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700 outline-none focus:border-primary"
                            value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                            {["CSE", "ECE", "EEE", "MECH", "CIVIL", "AIML"].map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Year</label>
                        <select className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700 outline-none focus:border-primary"
                            value={formData.year} onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}>
                            {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-primary uppercase">Current CGPA (For AI)</label>
                        <input required type="number" step="0.01" max="10" className="w-full p-3 rounded-xl bg-primary/5 border border-primary/20 font-black text-primary outline-none focus:border-primary"
                            value={formData.current_cgpa} onChange={e => setFormData({ ...formData, current_cgpa: parseFloat(e.target.value) })} placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Date of Birth</label>
                        <input type="date" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700 outline-none focus:border-primary"
                            value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} />
                    </div>
                    {/* Additional fields for completeness */}
                    <input className="hidden" value={formData.password} readOnly />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Blood Group</label>
                        <select className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700 outline-none focus:border-primary text-xs"
                            value={formData.blood_group} onChange={e => setFormData({ ...formData, blood_group: e.target.value })}>
                            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 header uppercase">Parent Phone</label>
                        <input required type="tel" maxLength={10} pattern="[0-9]{10}" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700 outline-none focus:border-primary text-xs"
                            placeholder="10-digit #" value={formData.parent_phone} onChange={e => setFormData({ ...formData, parent_phone: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Personal Phone</label>
                        <input required type="tel" maxLength={10} pattern="[0-9]{10}" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700 outline-none focus:border-primary text-xs"
                            placeholder="10-digit #" value={formData.personal_phone} onChange={e => setFormData({ ...formData, personal_phone: e.target.value })} />
                    </div>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center">
                            <Mail className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Auto-Generated Email</p>
                            <p className="text-xs font-bold text-white tracking-tight">{previewEmail}</p>
                        </div>
                    </div>
                </div>
                <Button disabled={loading} type="submit" className="w-full bg-slate-900 h-12 rounded-xl font-bold shadow-xl">
                    {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 text-emerald-400 mr-2" />}
                    {loading ? "Enrolling & Generating AI Profile..." : "Enroll Student & Generate AI Insights"}
                </Button>
            </form>
        </Dialog>
    );
}

function AddStaffModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        full_name: "", personal_email: "", password: "password123",
        staff_id: "", department: "CSE", designation: "Assistant Professor",
        personal_phone: "", primary_skill: "", education: ""
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8000/admin/staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                alert("Staff Member Added Successfully!");
                onSuccess();
                onClose();
            } else { alert("Failed to add staff."); }
        } catch (err) { console.error(err); alert("Error adding staff"); }
        finally { setLoading(false); }
    };

    if (!isOpen) return null;
    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="Add Faculty Member" description="Register new staff and assign department roles.">
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                        <input required className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700 outline-none"
                            value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                        <input required type="email" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700 outline-none"
                            value={formData.personal_email} onChange={e => setFormData({ ...formData, personal_email: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Staff ID (Optional)</label>
                        <input className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700 outline-none" placeholder="Auto-generated if empty"
                            value={formData.staff_id} onChange={e => setFormData({ ...formData, staff_id: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Department</label>
                        <select className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700 outline-none"
                            value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                            {["CSE", "ECE", "EEE", "MECH", "CIVIL"].map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Designation</label>
                        <input className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700 outline-none" value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Primary Skill</label>
                        <input className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700 outline-none" value={formData.primary_skill} onChange={e => setFormData({ ...formData, primary_skill: e.target.value })} />
                    </div>
                </div>
                <Button disabled={loading} type="submit" className="w-full bg-slate-900 h-12 rounded-xl font-bold shadow-xl">
                    {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <ShieldCheck className="h-4 w-4 text-white mr-2" />}
                    {loading ? "Registering..." : "Register Staff"}
                </Button>
            </form>
        </Dialog>
    );
}

export default function AdminDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('global');
    const [selectedCluster, setSelectedCluster] = useState<any>(null);
    const [isInterventionOpen, setIsInterventionOpen] = useState(false);
    const [isActionPlanOpen, setIsActionPlanOpen] = useState(false);

    // User Management State
    const [userType, setUserType] = useState<'student' | 'staff'>('student')
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)
    const [isAddStaffOpen, setIsAddStaffOpen] = useState(false)

    // Search Logic
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (activeTab === 'users') {
                performSearch()
            }
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [searchQuery, userType, activeTab])

    const performSearch = async () => {
        setIsSearching(true)
        try {
            const token = localStorage.getItem('token')
            const endpoint = userType === 'student' ? 'students' : 'staff'
            const url = `http://127.0.0.1:8000/admin/${endpoint}?search=${searchQuery}`

            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setSearchResults(data)
            }
        } catch (error) {
            console.error("Search failed", error)
        } finally {
            setIsSearching(false)
        }
    }

    const handleDeleteUser = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return

        try {
            const token = localStorage.getItem('token')
            const endpoint = userType === 'student' ? 'students' : 'staff'
            const res = await fetch(`http://localhost:8000/admin/${endpoint}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (res.ok) {
                performSearch()
                alert(`${userType === 'student' ? 'Student' : 'Staff'} deleted successfully`)
            } else {
                alert("Failed to delete user")
            }
        } catch (error) {
            console.error("Delete failed", error)
        }
    }

    useEffect(() => {
        const fetchOverview = async () => {
            const token = localStorage.getItem('token')
            try {
                const response = await fetch('http://127.0.0.1:8000/admin/overview', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (response.ok) {
                    const overviewData = await response.json()
                    setData(overviewData)
                }
            } catch (error) {
                console.error("Failed to fetch dashboard overview", error)
            } finally {
                setLoading(false)
            }
        }
        fetchOverview()
    }, [])

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Generating AI Insights...</p>
                </div>
            </div>
        )
    }

    if (!data) return <div className="p-10 text-center">Failed to load institutional data.</div>;

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#f8fafc] selection:bg-primary/30 font-sans">
            {/* 0. Professional Sticky Header */}
            <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b bg-white/80 backdrop-blur-xl px-8 md:px-12 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight text-slate-800 uppercase">Institutional Dashboard</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Advanced Academic Intelligence</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <Link href="/admin/students">
                        <Button className="rounded-full bg-slate-900 px-6 font-bold shadow-xl hover:scale-105 transition-all">
                            Manage Data
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="flex-1 p-6 md:p-12 space-y-10 max-w-[1600px] mx-auto w-full">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                            <Zap className="h-3 w-3" /> System Live
                        </div>
                        <h2 className="text-5xl font-black tracking-tighter text-slate-900 leading-tight">
                            Academic Intelligence <span className="text-primary">Overview</span>
                        </h2>
                        <p className="text-slate-500 font-medium max-w-2xl text-lg">
                            Empowering leadership with real-time predictive analytics and institutional health mapping.
                        </p>
                    </div>
                    <div className="bg-white p-2 rounded-2xl border shadow-sm inline-flex">
                        <button
                            onClick={() => setActiveTab('global')}
                            className={cn("px-6 py-2 rounded-xl text-xs font-bold transition-all", activeTab === 'global' ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50")}
                        >
                            Global
                        </button>
                        <button
                            onClick={() => setActiveTab('dept')}
                            className={cn("px-6 py-2 rounded-xl text-xs font-bold transition-all", activeTab === 'dept' ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50")}
                        >
                            Departmental
                        </button>
                        <button
                            onClick={() => setActiveTab('predictive')}
                            className={cn("px-6 py-2 rounded-xl text-xs font-bold transition-all", activeTab === 'predictive' ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50")}
                        >
                            Predictive
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={cn("px-6 py-2 rounded-xl text-xs font-bold transition-all", activeTab === 'users' ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50")}
                        >
                            User Directory
                        </button>
                    </div>
                </div>

                {/* 1. INSTITUTIONAL SUMMARY CARDS (Animated) */}
                {(activeTab === 'global' || activeTab === 'predictive') && (
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                        {[
                            { label: "Total Students", value: data.institutional.total_students, icon: Users, color: "blue" },
                            { label: "Active Students", value: data.institutional.active_students, icon: GraduationCap, color: "emerald" },
                            { label: "Placement Readiness", value: `${data.institutional.placement_readiness_avg}%`, icon: Target, color: "cyan" },
                            { label: "DNA Score", value: data.institutional.dna_score, icon: Award, color: "purple" },
                            { label: "Risk Ratio", value: `${data.institutional.risk_ratio}%`, icon: AlertTriangle, color: "rose" },
                            { label: "Growth Index", value: data.institutional.avg_growth_index, icon: TrendingUp, color: "orange" },
                        ].map((item, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={i}
                            >
                                <Card className="border-none shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all cursor-default group overflow-hidden h-full">
                                    <CardContent className="p-6">
                                        <div className={cn("p-2 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform",
                                            item.color === 'blue' ? 'bg-blue-50 text-blue-500' :
                                                item.color === 'emerald' ? 'bg-emerald-50 text-emerald-500' :
                                                    item.color === 'cyan' ? 'bg-cyan-50 text-cyan-500' :
                                                        item.color === 'purple' ? 'bg-purple-50 text-purple-500' :
                                                            item.color === 'rose' ? 'bg-rose-50 text-rose-500' : 'bg-orange-50 text-orange-500'
                                        )}>
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
                                        <div className="text-3xl font-black text-slate-800">{item.value}</div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="grid gap-8 grid-cols-1 lg:grid-cols-12">

                    {/* 10. AI INSIGHT GENERATOR (AUTO SUMMARY) */}
                    <div className="lg:col-span-12">
                        <Card className="bg-slate-900 border-none shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                                <Zap className="h-32 w-32 text-white" />
                            </div>
                            <CardContent className="p-10 relative z-10 flex flex-col md:flex-row items-center gap-8">
                                <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center text-white shrink-0 shadow-2xl shadow-primary/40 animate-pulse">
                                    <Activity className="h-8 w-8" />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-primary animate-ping"></span>
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">WEEKLY AI GENERATED INSIGHT</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white leading-relaxed">
                                        {data.weekly_insight}
                                    </h3>
                                    <p className="text-slate-400 text-sm font-medium">
                                        Our Explainable AI logic (SHAP) suggests focusing on Core Engineering lab utilization to bridge the current skill gap identified in final year students.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 2. AI EARLY WARNING SYSTEM & 3. PERFORMANCE CLUSTERING */}
                    {(activeTab === 'global' || activeTab === 'predictive') && (
                        <>
                            <div className="lg:col-span-4">
                                <Card className="border-none shadow-xl h-full flex flex-col">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg font-black uppercase tracking-wide flex items-center gap-2">
                                                <AlertTriangle className="h-5 w-5 text-rose-500" />
                                                Early Warning
                                            </CardTitle>
                                            <span className="text-rose-500 font-black text-xs px-2 py-1 bg-rose-50 rounded-lg">LIVE</span>
                                        </div>
                                        <CardDescription className="text-xs font-bold">Predicting dropouts and stagnation risks.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col justify-between py-6">
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase">High Risk Students</p>
                                                    <p className="text-3xl font-black text-rose-600">{data.early_warning.high_risk_count}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase">Medium Risk</p>
                                                    <p className="text-3xl font-black text-orange-500">{data.early_warning.medium_risk_count}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                                                    <span>Low Risk %</span>
                                                    <span>{data.early_warning.low_risk_percent}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${data.early_warning.low_risk_percent}%` }}
                                                        className="h-full bg-emerald-500"
                                                    />
                                                </div>
                                            </div>

                                            <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 space-y-2">
                                                <p className="text-[10px] font-black text-primary uppercase tracking-widest">Predicted Dropout Rate (Next 6M)</p>
                                                <div className="text-4xl font-black text-slate-800">{data.early_warning.dropout_probability_next_6m}%</div>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={() => {
                                                setSelectedCluster(data.performance_clusters[3]); // Target the "Critical Zone" cluster for the demo
                                                setIsInterventionOpen(true);
                                            }}
                                            className="w-full mt-8 bg-slate-900 border-none h-12 rounded-xl font-bold shadow-xl shadow-slate-200 hover:scale-[1.02] transition-all"
                                        >
                                            View Intervention Plan
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="lg:col-span-8">
                                <Card className="border-none shadow-xl h-full">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle className="text-lg font-black uppercase tracking-wide flex items-center gap-2">
                                                <Layers className="h-5 w-5 text-primary" />
                                                Performance Clustering
                                            </CardTitle>
                                            <CardDescription className="text-xs font-bold text-slate-400">KMeans (n=4) grouping based on CGPA and Growth.</CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="grid md:grid-cols-2 gap-8 items-center py-6">
                                        <div className="h-[300px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={data.performance_clusters}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={100}
                                                        paddingAngle={5}
                                                        dataKey="count"
                                                    >
                                                        {data.performance_clusters.map((entry: any, index: number) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="space-y-4">
                                            {data.performance_clusters.map((cluster: any, i: number) => (
                                                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800">{cluster.name}</p>
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase">{cluster.description}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-black text-slate-800">{cluster.count}</p>
                                                        <p className="text-[10px] font-bold text-primary">{cluster.percentage}%</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    )}

                    {/* 4. DEPARTMENT PERFORMANCE INDEX */}
                    {(activeTab === 'global' || activeTab === 'dept') && (
                        <div className="lg:col-span-12">
                            <Card className="border-none shadow-xl overflow-hidden">
                                <CardHeader className="bg-slate-50 border-b">
                                    <CardTitle className="text-lg font-black uppercase tracking-wide flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5 text-indigo-500" />
                                        Department Performance Index
                                    </CardTitle>
                                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Ranked by composite AI Score.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b">
                                                <tr>
                                                    <th className="px-8 py-4">Rank</th>
                                                    <th className="px-8 py-4">Department</th>
                                                    <th className="px-8 py-4">Avg CGPA</th>
                                                    <th className="px-8 py-4">Growth Index</th>
                                                    <th className="px-8 py-4">Placement</th>
                                                    <th className="px-8 py-4">Skill Score</th>
                                                    <th className="px-8 py-4 text-rose-500">Risk %</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {data.department_ranking.map((dept: any, i: number) => (
                                                    <tr key={i} className="hover:bg-slate-50 transition-colors group">
                                                        <td className="px-8 py-4">
                                                            <div className={cn("h-8 w-8 rounded-full flex items-center justify-center font-black text-xs",
                                                                dept.overall_rank === 1 ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-600"
                                                            )}>
                                                                {dept.overall_rank}
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-4 font-black text-slate-800 group-hover:text-primary transition-colors">{dept.department}</td>
                                                        <td className="px-8 py-4 font-bold text-slate-600">{dept.avg_cgpa}</td>
                                                        <td className="px-8 py-4 font-bold text-slate-600">{dept.avg_growth}</td>
                                                        <td className="px-8 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-black text-slate-800">{dept.placement_readiness}%</span>
                                                                <div className="h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-cyan-500" style={{ width: `${dept.placement_readiness}%` }}></div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-4 font-bold text-slate-600">{dept.skill_score}</td>
                                                        <td className="px-8 py-4 font-black text-rose-500">{dept.risk_percent}%</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* 5. PREDICTIVE PLACEMENT FORECAST & 6. FACULTY IMPACT */}
                    {(activeTab === 'global' || activeTab === 'predictive') && (
                        <>
                            <div className="lg:col-span-6">
                                <Card className="border-none shadow-xl h-full">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-black uppercase tracking-wide flex items-center gap-2">
                                            <Briefcase className="h-5 w-5 text-primary" />
                                            Placement Forecast
                                        </CardTitle>
                                        <CardDescription className="text-xs font-bold text-slate-400">Next batch projection using current readiness indicators.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid sm:grid-cols-2 gap-8 items-center py-6">
                                        <div className="relative flex items-center justify-center">
                                            <ResponsiveContainer width="100%" height={200}>
                                                <PieChart>
                                                    <Pie
                                                        data={[
                                                            { name: 'Predicted', value: data.placement_forecast.forecast_placement_percent },
                                                            { name: 'Gap', value: 100 - data.placement_forecast.forecast_placement_percent }
                                                        ]}
                                                        startAngle={180}
                                                        endAngle={0}
                                                        innerRadius={60}
                                                        outerRadius={90}
                                                        paddingAngle={0}
                                                        dataKey="value"
                                                    >
                                                        <Cell fill="#3b82f6" />
                                                        <Cell fill="#eff6ff" />
                                                    </Pie>
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center pt-10">
                                                <span className="text-4xl font-black text-slate-900">{data.placement_forecast.forecast_placement_percent}%</span>
                                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Institution Forecast</span>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Core vs IT Ratio</p>
                                                <p className="text-2xl font-black text-slate-900">{data.placement_forecast.core_vs_it_ratio}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Career Readiness Avg</p>
                                                <p className="text-2xl font-black text-slate-900">{data.placement_forecast.avg_career_readiness}%</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Global Skill Gap</p>
                                                <div className="text-2xl font-black text-slate-900">{data.placement_forecast.skill_gap_avg}%</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="lg:col-span-6">
                                <Card className="border-none shadow-xl h-full">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-black uppercase tracking-wide flex items-center gap-2">
                                            <Activity className="h-5 w-5 text-indigo-500" />
                                            Faculty Impact Analytics
                                        </CardTitle>
                                        <CardDescription className="text-xs font-bold text-slate-400">Measured by student improvement after feedback cycles.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.faculty_impact}>
                                                <PolarGrid stroke="#e2e8f0" />
                                                <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700 }} />
                                                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                                <Radar name="Impact Score" dataKey="impact_score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                                                <Tooltip />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    )}

                    {/* 7. BURNOUT & ACADEMIC STRESS HEATMAP & 8. RESOURCE OPTIMIZATION */}
                    {(activeTab === 'global' || activeTab === 'dept') && (
                        <>
                            <div className="lg:col-span-8">
                                <Card className="border-none shadow-xl h-full">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle className="text-lg font-black uppercase tracking-wide flex items-center gap-2">
                                                <Activity className="h-5 w-5 text-rose-500" />
                                                Student Stress Heatmap
                                            </CardTitle>
                                            <CardDescription className="text-xs font-bold text-slate-400">Risk mapping by Semester vs Performance Volatility.</CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="py-6">
                                        <div className="grid grid-cols-6 gap-2">
                                            <div className="col-span-1"></div>
                                            {['S1', 'S2', 'S3', 'S4', 'S5'].map(s => <div key={s} className="text-center text-[10px] font-black text-slate-400 uppercase">{s}</div>)}
                                            {['AIML', 'CSE', 'ECE', 'EEE', 'MECH'].map((dept, i) => (
                                                <React.Fragment key={dept}>
                                                    <div className="text-[10px] font-black text-slate-500 uppercase flex items-center">{dept}</div>
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <div
                                                            key={`${dept}-${s}`}
                                                            className={cn("h-12 rounded-lg transition-all hover:scale-105 border border-white",
                                                                (i + s) % 5 === 0 ? "bg-rose-500/80 shadow-lg shadow-rose-200" :
                                                                    (i + s) % 3 === 0 ? "bg-orange-400/60" : "bg-emerald-400/40"
                                                            )}
                                                        ></div>
                                                    ))}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                        <div className="mt-6 flex justify-center gap-6">
                                            {['Low Stress', 'Moderate', 'High Risk'].map((l, i) => (
                                                <div key={l} className="flex items-center gap-2">
                                                    <div className={cn("h-3 w-3 rounded-sm", i === 0 ? "bg-emerald-400/40" : i === 1 ? "bg-orange-400/60" : "bg-rose-500")}></div>
                                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{l}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="lg:col-span-4">
                                <Card className="border-none shadow-xl h-full">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-black uppercase tracking-wide flex items-center gap-2">
                                            <Zap className="h-5 w-5 text-amber-500" />
                                            Resource Opt
                                        </CardTitle>
                                        <CardDescription className="text-xs font-bold text-slate-400">Utilization & Demand Forecast.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6 py-6">
                                        {[
                                            { label: "Faculty Load", value: data.resource_opt.faculty_load_percent, color: "#3b82f6" },
                                            { label: "Lab Utilization", value: data.resource_opt.lab_utilization_percent, color: "#8b5cf6" },
                                            { label: "Remedial Need", value: data.resource_opt.remedial_need_percent, color: "#f59e0b" }
                                        ].map((item, i) => (
                                            <div key={i} className="space-y-2">
                                                <div className="flex justify-between text-xs font-black uppercase text-slate-500">
                                                    <span>{item.label}</span>
                                                    <span>{item.value}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${item.value}%` }}
                                                        className="h-full"
                                                        style={{ backgroundColor: item.color }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        <div className="pt-4 p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-4">
                                            <RefreshCw className="h-5 w-5 text-amber-500 shrink-0 mt-1" />
                                            <div>
                                                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Demand Forecast</p>
                                                <p className="text-sm font-bold text-slate-800">{data.resource_opt.coaching_demand}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    )}

                    {/* 9. SMART INTERVENTION ENGINE */}
                    <div className="lg:col-span-12">
                        <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-600 to-primary text-white overflow-hidden">
                            <CardContent className="p-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                                <div className="space-y-6 max-w-xl">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
                                        <ShieldCheck className="h-3 w-3" /> AI Smart Intervention
                                    </div>
                                    <h2 className="text-4xl font-black tracking-tight leading-tight">
                                        Automated Action Plans for At-Risk Clusters
                                    </h2>
                                    <div className="flex flex-wrap gap-4">
                                        {['Remedial Coaching', 'Peer Mentoring', 'Counseling', 'Bootcamps'].map(s => (
                                            <div key={s} className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-bold">{s}</div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 min-w-[300px]">
                                    <Button
                                        onClick={() => setIsActionPlanOpen(true)}
                                        className="bg-white text-primary hover:bg-slate-50 h-16 rounded-2xl font-black text-lg shadow-2xl shadow-black/20 px-10 transition-all active:scale-95"
                                    >
                                        Generate Global Action Plan
                                    </Button>
                                    <p className="text-center text-xs font-medium text-white/60 uppercase tracking-widest">Last generated: 2 hours ago</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </main>

            {/* User Management View */}
            {activeTab === 'users' && (
                <div className="max-w-[1600px] mx-auto w-full px-12 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden">
                        <div className="h-32 bg-slate-900 p-8 flex items-end justify-between relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 opacity-20" />
                            <div className="relative z-10 text-white">
                                <h2 className="text-2xl font-black">User Directory</h2>
                                <p className="text-sm font-bold text-slate-400">Search, Manage, and Remove Accounts</p>
                            </div>
                            <div className="relative z-10 flex gap-2">
                                <div className="flex bg-slate-800 rounded-xl p-1">
                                    <button
                                        onClick={() => setUserType('student')}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                                            userType === 'student' ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
                                        )}
                                    >
                                        Students
                                    </button>
                                    <button
                                        onClick={() => setUserType('staff')}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                                            userType === 'staff' ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
                                        )}
                                    >
                                        Faculty
                                    </button>
                                </div>
                                <Button
                                    onClick={() => userType === 'student' ? setIsAddStudentOpen(true) : setIsAddStaffOpen(true)}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20"
                                >
                                    + Add {userType === 'student' ? 'Student' : 'Faculty'}
                                </Button>
                            </div>
                        </div>
                        <div className="p-8 space-y-6">
                            {/* Search Input */}
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder={`Search ${userType}s by name, ID, or email...`}
                                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Results List */}
                            <div className="space-y-3">
                                {isSearching ? (
                                    <div className="text-center py-10 font-bold text-slate-400 animate-pulse">Searching Directory...</div>
                                ) : searchResults.length > 0 ? (
                                    <>
                                        <div className="flex justify-between items-center px-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                            <span>Profile</span>
                                            <span>Actions</span>
                                        </div>
                                        {searchResults.map((user) => (
                                            <div key={user.id} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg">
                                                        {(user.name || user.full_name || '?')[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800">{user.name || user.full_name}</p>
                                                        <p className="text-xs font-bold text-slate-400">
                                                            {userType === 'student' ? user.roll_number : user.staff_id} • {user.department}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/admin/${userType === 'student' ? 'students' : 'staff'}/${user.id}`}>
                                                        <Button size="icon" variant="ghost" className="h-10 w-10 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
                                                            <ArrowUpRight className="h-5 w-5" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="h-10 w-10 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <div className="text-center py-10">
                                        <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                            <UserCircle className="h-8 w-8" />
                                        </div>
                                        <p className="font-bold text-slate-400">No users found.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* 11. Footer */}
            <footer className="mt-20 border-t bg-white py-12 px-12">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter">Student Academic Platform v4.0 (AI Unleashed)</p>
                    </div>
                    <div className="flex gap-8">
                        <a href="#" className="text-xs font-black text-slate-400 uppercase hover:text-primary transition-colors">Documentation</a>
                        <a href="#" className="text-xs font-black text-slate-400 uppercase hover:text-primary transition-colors">API Status</a>
                        <a href="#" className="text-xs font-black text-slate-400 uppercase hover:text-primary transition-colors">Contact Support</a>
                    </div>
                </div>
            </footer>

            {/* Custom Global Styles for Premium Aesthetics */}
            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;400;700;900&display=swap');
        
        body {
          font-family: 'Outfit', sans-serif;
        }

        .premium-gradient-text {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
      `}</style>
            {/* --- Interactive Modals --- */}
            <InterventionModal
                isOpen={isInterventionOpen}
                onClose={() => setIsInterventionOpen(false)}
                cluster={selectedCluster}
            />
            <GlobalActionPlanModal
                isOpen={isActionPlanOpen}
                onClose={() => setIsActionPlanOpen(false)}
                data={data}
            />
            <AddStudentModal
                isOpen={isAddStudentOpen}
                onClose={() => setIsAddStudentOpen(false)}
                onSuccess={() => { performSearch(); }}
            />
            <AddStaffModal
                isOpen={isAddStaffOpen}
                onClose={() => setIsAddStaffOpen(false)}
                onSuccess={() => { performSearch(); }}
            />
        </div >
    )
}
