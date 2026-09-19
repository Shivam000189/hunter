import React from "react";
import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { Briefcase, Sparkles, TrendingUp, Send, Users, Award, CheckCircle2 } from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";

type AuthLayoutProps = {
  mode: "login" | "signup";
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

const pipeline = [
  { company: "Stripe", role: "Staff Backend Engineer", status: "Applied", tone: "applied" as const, initial: "S" },
  { company: "Airbnb", role: "Lead Frontend Architect", status: "Interview", tone: "interview" as const, initial: "A" },
  { company: "OpenAI", role: "Research Software Engineer", status: "Offer", tone: "offer" as const, initial: "O" },
];

const toneStyles: Record<string, string> = {
  applied: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  interview: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  offer: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
};

const panelVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const listContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.25 },
  },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, x: 12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export function AuthLayout({ mode, eyebrow, title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="auth-shell relative min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden bg-white dark:bg-slate-950">
      <div className="mx-auto grid min-h-screen lg:h-full lg:max-h-screen w-full max-w-7xl grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* Left: Form Column */}
        <div className="relative flex flex-col justify-between px-5 py-4 sm:px-8 sm:py-6 lg:px-12 lg:py-6 lg:h-full overflow-y-auto">
          <div className="flex items-center justify-between shrink-0">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <Briefcase className="w-4 h-4 stroke-[2.4]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Hunter
              </span>
            </Link>
            <ThemeToggle />
          </div>

          <div className="flex flex-1 items-center justify-center py-6 sm:py-8">
            <motion.div
              initial="hidden"
              animate="show"
              variants={panelVariants}
              className="mx-auto w-full max-w-sm"
            >
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 dark:bg-blue-950/40 dark:border-blue-800/60 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{eyebrow}</span>
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight"
              >
                {title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal"
              >
                {subtitle}
              </motion.p>

              <div className="mt-5">{children}</div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="mt-5"
              >
                {footer}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Right: Modern Blue Gradient Preview Panel */}
        <div className="relative hidden overflow-hidden p-3 lg:p-4 xl:p-6 lg:block lg:h-full">
          <div className="relative h-full w-full overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 border border-slate-800/80 px-6 py-6 xl:px-8 xl:py-8 flex flex-col justify-between shadow-2xl shadow-blue-900/20">
            {/* Ambient Lighting Orbs */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex h-full flex-col justify-between z-10">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md"
              >
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-[11px] font-semibold uppercase tracking-wider mb-2">
                  <span>{mode === "login" ? "Candidate Workspace" : "Job Search, Organized"}</span>
                </div>
                <h2 className="text-xl xl:text-2xl font-bold leading-snug text-white tracking-tight">
                  Every application, interview, and compensation offer—tracked in one calm place.
                </h2>
              </motion.div>

              {/* Central Mockup Kanban Pipeline Card */}
              <motion.div
                initial="hidden"
                animate="show"
                variants={panelVariants}
                transition={{ delay: 0.15 }}
                className="relative my-auto py-2"
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 sm:p-5 backdrop-blur-xl shadow-[0_24px_48px_rgba(0,0,0,0.4)]"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-white">
                        <Briefcase className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-bold text-white tracking-tight">Hunter Pipeline</span>
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                      <TrendingUp className="w-3 h-3" />
                      +34.2% Response
                    </span>
                  </div>

                  {/* 3 Metric Counters */}
                  <div className="mt-3.5 grid grid-cols-3 gap-2">
                    {[
                      { label: "Applied", value: "48", icon: Send },
                      { label: "Interview", value: "6", icon: Users },
                      { label: "Offers", value: "2", icon: Award },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-2 text-left"
                      >
                        <div className="flex items-center gap-1 text-white/50">
                          <stat.icon className="w-3 h-3" />
                          <span className="text-[10px] font-medium">{stat.label}</span>
                        </div>
                        <p className="mt-1 text-lg font-bold text-white">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Pipeline rows */}
                  <motion.div
                    variants={listContainerVariants}
                    initial="hidden"
                    animate="show"
                    className="mt-3.5 space-y-2"
                  >
                    {pipeline.map((row) => (
                      <motion.div
                        key={row.company}
                        variants={rowVariants}
                        className="flex items-center justify-between rounded-lg bg-white/[0.04] border border-white/5 px-3 py-2"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-600/30 border border-blue-400/30 text-[11px] font-bold text-blue-200">
                            {row.initial}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{row.role}</p>
                            <p className="text-[10px] text-white/50 truncate">{row.company}</p>
                          </div>
                        </div>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${toneStyles[row.tone]}`}>
                          {row.status}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>

                {/* Floating Offer Celebration Pill */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, x: 15, y: 15 }}
                  animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                  transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.7 }}
                  className="absolute -bottom-4 -left-3 w-56 rounded-xl border border-emerald-500/30 bg-slate-900/95 p-2.5 shadow-2xl backdrop-blur-md"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-emerald-400 truncate">Offer in Hand: OpenAI</p>
                      <p className="text-[10px] text-slate-300 font-semibold truncate">$385k Total Comp / yr</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Bottom Trust Strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="flex items-center gap-2.5 border-t border-white/10 pt-4"
              >
                <div className="flex -space-x-1.5">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces"
                    alt="Candidate 1"
                    className="w-5 h-5 rounded-full ring-1 ring-white/30 object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces"
                    alt="Candidate 2"
                    className="w-5 h-5 rounded-full ring-1 ring-white/30 object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces"
                    alt="Candidate 3"
                    className="w-5 h-5 rounded-full ring-1 ring-white/30 object-cover"
                  />
                </div>
                <p className="text-[11px] text-white/70">
                  Trusted by <span className="text-white font-bold">10,000+</span> job seekers closing offers faster
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

