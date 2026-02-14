import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GraduationCap, Brain, TrendingUp, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background overflow-hidden selection:bg-primary/30">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-cyan-400/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="z-50 w-full max-w-7xl px-6 py-8 flex items-center justify-between animate-in">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
            <GraduationCap className="h-7 w-7 text-primary" />
          </div>
          <span className="font-bold text-2xl tracking-tighter premium-gradient-text">Khariz's Innovation</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground/80">
          <Link href="#" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#" className="hover:text-primary transition-colors">Architecture</Link>
          <Link href="#" className="hover:text-primary transition-colors">Security</Link>
          <Button variant="outline" className="rounded-full px-6 border-primary/20 hover:bg-primary/5 transition-all">Documentation</Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="z-10 relative flex flex-col items-center justify-center pt-20 pb-16 px-6 text-center max-w-5xl animate-in">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-8 animate-bounce transition-all duration-700">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">Khariz's Innovation</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-4 leading-[1.1]">
          Bridge the Gap Between <br />
          <span className="premium-gradient-text">Potential & Performance</span>
        </h1>

        <div className="mb-8 p-3 rounded-2xl bg-slate-900/5 border border-slate-200 backdrop-blur-sm inline-block">
          <p className="text-xl md:text-2xl font-black tracking-tight text-slate-800 uppercase">
            Role Based Access Control
          </p>
        </div>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed">
          The next-generation academic management platform featuring secure,
          granular role-based access for students, faculty, and administrators.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-24">
          <Button size="lg" className="rounded-full px-10 h-14 text-lg font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
            Get Started Now
          </Button>
          <Button size="lg" variant="ghost" className="rounded-full px-10 h-14 text-lg font-semibold hover:bg-muted/50 transition-all">
            Explore Features
          </Button>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="z-10 w-full max-w-7xl px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <RoleCard
            href="/login?role=student"
            title="Student Portal"
            description="Secure access to academic records, growth trends, and personalized institutional roadmaps."
            icon={TrendingUp}
            color="primary"
          />
          <RoleCard
            href="/login?role=faculty"
            title="Faculty Access"
            description="Manage classroom performance and provide direct data-driven student feedback."
            icon={Brain}
            color="blue"
          />
          <RoleCard
            href="/login?role=admin"
            title="Admin Dashboard"
            description="High-level dashboard for institutional oversight, user management, and security controls."
            icon={ShieldCheck}
            color="cyan"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="z-10 w-full border-t border-border/50 py-12 px-6 flex flex-col items-center gap-4 bg-muted/20 backdrop-blur-sm">
        <p className="text-sm text-muted-foreground">© 2024 Khariz's Innovation. Built for Excellence.</p>
        <div className="flex gap-6 text-xs font-medium text-muted-foreground/60 uppercase tracking-widest">
          <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-primary transition-colors">Contact Support</Link>
        </div>
      </footer>
    </main>
  );
}

function RoleCard({ href, title, description, icon: Icon, color }: { href: string, title: string, description: string, icon: any, color: string }) {
  return (
    <Link href={href} className="group relative">
      <div className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative glass-card hover:bg-card/80 p-8 rounded-[2rem] transition-all duration-500 group-hover:-translate-y-2 h-full flex flex-col overflow-hidden">
        <div className="mb-6 inline-flex p-4 rounded-2xl bg-muted group-hover:bg-primary/10 transition-colors duration-500">
          <Icon className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors duration-500" />
        </div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 group-hover:text-primary transition-colors">
          {title}
          <ArrowRight className="h-5 w-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          {description}
        </p>
        <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-primary/60 group-hover:text-primary transition-colors">Access Portal</span>
          <Sparkles className="h-4 w-4 text-primary/20 group-hover:text-primary/100 transition-colors" />
        </div>
      </div>
    </Link>
  )
}
