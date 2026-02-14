import Link from "next/link"
import { LayoutDashboard, GraduationCap, LineChart, BookOpen, Settings, User, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-background/95 md:flex-row">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r bg-background/40 backdrop-blur-xl sm:flex transition-all duration-300">
                <div className="flex h-16 items-center px-6 border-b border-border/50">
                    <Link className="flex items-center gap-2 group" href="/student">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <GraduationCap className="h-6 w-6 text-primary" />
                        </div>
                        <span className="font-bold text-xl tracking-tight premium-gradient-text">Portal</span>
                    </Link>
                </div>

                <div className="flex-1 overflow-auto py-6">
                    <nav className="grid gap-1 px-4 text-sm font-medium">
                        <NavItem href="/student" icon={LayoutDashboard} label="Dashboard" active />
                        <NavItem href="/student/academics" icon={BookOpen} label="Academics" />
                        <NavItem href="/student/analytics" icon={LineChart} label="AI Analytics" />
                        <NavItem href="/student/profile" icon={User} label="My Profile" />
                        <div className="mt-8 px-2 py-4">
                            <div className="h-px bg-border/50 mb-4" />
                            <NavItem href="/student/settings" icon={Settings} label="Settings" />
                            <NavItem href="/" icon={LogOut} label="Logout" className="text-destructive hover:bg-destructive/10 hover:text-destructive" />
                        </div>
                    </nav>
                </div>

                <div className="p-4 mt-auto">
                    <div className="glass-card p-4 rounded-xl border-primary/10">
                        <p className="text-xs font-semibold text-primary mb-1">AI Status</p>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Models Active</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-col flex-1 sm:pl-64 min-w-0">
                <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border/50 bg-background/40 backdrop-blur-md px-4 sm:px-8">
                    <div className="flex-1 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <h2 className="text-sm font-medium text-muted-foreground hidden md:block">
                                Academic Year 2023-24
                            </h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
                                <Settings className="h-5 w-5 text-muted-foreground" />
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-full border-primary/20 hover:bg-primary/5 transition-all">
                                <span className="mr-2 h-2 w-2 rounded-full bg-emerald-500" />
                                Student ID: 2024001
                            </Button>
                            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-blue-600 p-[2px]">
                                <div className="h-full w-full rounded-full bg-background flex items-center justify-center">
                                    <User className="h-5 w-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 lg:p-10 animate-in">
                    {children}
                </main>
            </div>
        </div>
    )
}

function NavItem({ href, icon: Icon, label, active, className }: { href: string, icon: any, label: string, active?: boolean, className?: string }) {
    return (
        <Link
            href={href}
            className={cn(
                "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200",
                active
                    ? "bg-primary/10 text-primary shadow-sm shadow-primary/5"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                className
            )}
        >
            <Icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", active ? "text-primary" : "text-muted-foreground/70 group-hover:text-foreground")} />
            <span className="font-medium tracking-tight">{label}</span>
            {active && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
        </Link>
    )
}
