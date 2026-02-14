"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldCheck, ArrowLeft, Filter, Search, GraduationCap, UserPlus } from "lucide-react"
import Link from "next/link"

const departments = [
    "AIML", "AGRI", "EEE", "EIE", "ECE", "BT", "BME",
    "CIVIL", "IT", "MECH", "MECHATRONICS", "CSE", "FT", "FD", "AIDS"
]

const years = [
    { id: 1, label: "1st Year", batch: "2025-2029" },
    { id: 2, label: "2nd Year", batch: "2024-2028" },
    { id: 3, label: "3rd Year", batch: "2023-2027" },
    { id: 4, label: "4th Year", batch: "2022-2026" },
]

export default function StudentsPage() {
    const [selectedDept, setSelectedDept] = useState("AIML")
    const [selectedYear, setSelectedYear] = useState(3) // Default to 3rd year as requested
    const [students, setStudents] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const fetchStudents = async () => {
        setLoading(true)
        const token = localStorage.getItem('token')
        try {
            const url = `http://127.0.0.1:8000/admin/students?department=${selectedDept}&year=${selectedYear}`
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setStudents(data)
            }
        } catch (error) {
            console.error("Failed to fetch students", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStudents()
    }, [selectedDept, selectedYear])

    return (
        <div className="flex min-h-screen w-full flex-col bg-background selection:bg-primary/30">
            {/* Header */}
            <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-6 md:px-10">
                <Link href="/admin">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <ShieldCheck className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold tracking-tight">Student Management</h1>
            </header>

            <main className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Student Intelligence</h2>
                        <p className="text-slate-500 font-medium mt-1">Institutional directory of {students.length}+ students across all departments.</p>
                    </div>
                    <Link href="/admin/students/add">
                        <Button className="bg-primary text-white font-black px-8 py-6 rounded-2xl shadow-xl shadow-primary/20 flex items-center gap-2 group transform transition-all hover:scale-105 active:scale-95">
                            <UserPlus className="h-5 w-5" />
                            Enroll Student
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card className="glass-card border-none shadow-xl shadow-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5 text-primary" />
                            Selection Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Department</label>
                            <select
                                value={selectedDept}
                                onChange={(e) => setSelectedDept(e.target.value)}
                                className="w-full flex h-12 rounded-xl border border-input bg-background px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-primary shadow-sm"
                            >
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Academic Year</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {years.map(year => (
                                    <button
                                        key={year.id}
                                        onClick={() => setSelectedYear(year.id)}
                                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${selectedYear === year.id
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "border-muted bg-muted/30 text-muted-foreground hover:border-primary/50"
                                            }`}
                                    >
                                        <span className="text-sm font-bold">{year.label}</span>
                                        <span className="text-[10px] opacity-70 font-medium">{year.batch}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Student List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <GraduationCap className="h-6 w-6 text-primary" />
                            Students in {selectedDept} - {years.find(y => y.id === selectedYear)?.label}
                            <span className="ml-2 text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                                {students.length} Total
                            </span>
                        </h3>
                    </div>

                    {loading ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-32 rounded-3xl bg-muted animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {students.map((student) => (
                                <Link key={student.id} href={`/admin/students/${student.id}`}>
                                    <Card className="glass-card border-none hover:scale-[1.02] transition-all cursor-pointer group h-full">
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center font-bold text-primary group-hover:bg-primary group-hover:text-white transition-colors uppercase">
                                                    {student.name ? student.name.split(' ').map((n: string) => n[0]).join('') : 'ST'}
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">CGPA</div>
                                                    <div className="text-xl font-black text-primary">{student.current_cgpa.toFixed(2)}</div>
                                                </div>
                                            </div>
                                            <h4 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{student.name}</h4>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono font-bold bg-muted px-2 py-0.5 rounded text-muted-foreground">
                                                    {student.roll_number}
                                                </span>
                                                <span className="text-xs font-bold text-muted-foreground uppercase">{student.department}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}

                    {!loading && students.length === 0 && (
                        <div className="text-center py-20 bg-muted/20 rounded-[2rem] border-2 border-dashed border-muted">
                            <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <h3 className="text-lg font-bold text-muted-foreground">No students found for this selection</h3>
                            <p className="text-sm text-muted-foreground/60">Try changing the filters or seeding the database.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
