import React from "react";
import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { Icon } from "../ui/Icon";
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
  { company: "Northwind Labs", role: "Product Designer", status: "Interview", tone: "interview" as const },
  { company: "Vela Robotics", role: "Frontend Engineer", status: "Applied", tone: "applied" as const },
  { company: "Cursive", role: "UX Researcher", status: "Offer", tone: "offer" as const },
];

const toneStyles: Record<string, string> = {
  interview: "bg-status-interview-soft status-interview",
  applied: "bg-status-applied-soft status-applied",
  offer: "bg-status-offer-soft status-offer",
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
    <div className="auth-shell relative min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden">
      <div className="mx-auto grid min-h-screen lg:h-full lg:max-h-screen w-full max-w-7xl grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* Left: form column */}
        <div className="relative flex flex-col justify-between px-5 py-4 sm:px-8 sm:py-6 lg:px-12 lg:py-6 lg:h-full overflow-y-auto">
          <div className="flex items-center justify-between shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--hunter-primary)] text-white shadow-sm">
                <Icon name="Target" size={16} />
              </span>
              <span className="font-display text-base font-semibold tracking-tight">Hunter</span>
            </Link>
            <ThemeToggle />
          </div>

          <div className="flex flex-1 items-center justify-center py-3 sm:py-4">
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
                className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[var(--hunter-border)] bg-[var(--hunter-accent-soft)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--hunter-accent)]"
              >
                <Icon name="Sparkles" size={11} />
                {eyebrow}
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="font-display text-2xl font-semibold tracking-tight sm:text-[1.85rem] leading-tight"
              >
                {title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="mt-1 text-xs text-[var(--hunter-muted)] sm:text-[13px]"
              >
                {subtitle}
              </motion.p>

              <div className="mt-4 sm:mt-5">{children}</div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="mt-4 sm:mt-5"
              >
                {footer}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Right: animated preview panel */}
        <div className="relative hidden overflow-hidden p-3 lg:p-4 xl:p-6 lg:block lg:h-full">
          <div className="relative h-full w-full overflow-hidden rounded-[1.5rem] bg-[linear-gradient(155deg,_var(--hunter-primary)_0%,_#2b2f2a_58%,_#1c231f_100%)] px-6 py-6 xl:px-8 xl:py-8 flex flex-col justify-between">
            <div className="orb -left-16 -top-24 h-64 w-64 bg-[var(--hunter-info)]" />
            <div className="orb -right-10 bottom-0 h-72 w-72 bg-[var(--hunter-accent)]" />
            <div className="orb right-20 top-1/3 h-36 w-36 bg-[var(--hunter-warning)] opacity-20" />

            <div className="relative flex h-full flex-col justify-between">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-sm"
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
                  {mode === "login" ? "Welcome back" : "Job search, organized"}
                </p>
                <h2 className="font-display mt-2 text-xl font-semibold leading-snug text-white xl:text-[1.55rem]">
                  Every application, interview, and offer — tracked in one calm place.
                </h2>
              </motion.div>

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
                  className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl shadow-[0_24px_48px_rgba(0,0,0,0.35)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-white/80">Application pipeline</span>
                    <span className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                      <Icon name="TrendingUp" size={11} />
                      +18%
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2.5">
                    {[
                      { label: "Applied", value: "24", icon: "Send" as const },
                      { label: "Interview", value: "6", icon: "Users" as const },
                      { label: "Offers", value: "2", icon: "PartyPopper" as const },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-white/10 bg-white/[0.05] px-2.5 py-2"
                      >
                        <div className="flex items-center gap-1 text-white/50">
                          <Icon name={stat.icon} size={11} />
                          <span className="text-[10px]">{stat.label}</span>
                        </div>
                        <p className="mt-1 text-lg font-semibold text-white">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  <motion.div
                    variants={listContainerVariants}
                    initial="hidden"
                    animate="show"
                    className="mt-3 space-y-1.5"
                  >
                    {pipeline.map((row) => (
                      <motion.div
                        key={row.company}
                        variants={rowVariants}
                        className="flex items-center justify-between rounded-lg bg-white/[0.04] px-2.5 py-1.5"
                      >
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10 text-[10px] font-semibold text-white/80">
                            {row.company.slice(0, 2).toUpperCase()}
                          </span>
                          <div>
                            <p className="text-xs font-medium text-white">{row.role}</p>
                            <p className="text-[10px] text-white/45">{row.company}</p>
                          </div>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${toneStyles[row.tone]}`}>
                          {row.status}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.85, x: 15, y: 15 }}
                  animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                  transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.7 }}
                  className="absolute -bottom-4 -left-4 w-48 rounded-xl border border-white/10 bg-[var(--hunter-surface-strong)] p-2.5 shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-status-offer-soft status-offer">
                      <Icon name="CheckCircle2" size={14} />
                    </span>
                    <div>
                      <p className="text-xs font-medium text-[var(--hunter-text)]">Offer received</p>
                      <p className="text-[10px] text-[var(--hunter-muted)]">Cursive · UX Researcher</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="flex items-center gap-2.5 border-t border-white/10 pt-3"
              >
                <div className="flex -space-x-1.5">
                  {["AK", "MJ", "RS"].map((initials) => (
                    <span
                      key={initials}
                      className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--hunter-primary)] bg-white/15 text-[9px] font-semibold text-white"
                    >
                      {initials}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-white/55">
                  Joined by job seekers tracking <span className="text-white/85 font-medium">12,400+</span> applications this month
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
