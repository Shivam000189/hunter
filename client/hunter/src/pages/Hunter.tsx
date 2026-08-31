import { useNavigate } from "react-router-dom";
import { Icon, type IconName } from "../components/ui/Icon";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { useTheme } from "../context/ThemeContext";

type FeatureItem = {
  icon: IconName;
  title: string;
  desc: string;
  badge: string;
  tone: string;
};

const features: FeatureItem[] = [
  {
    icon: "Briefcase",
    title: "Kanban Tracking",
    badge: "Pipeline",
    desc: "Visual pipeline for every application. Drag jobs through Applied, Interview, Offer, and Rejected stages with custom reminders.",
    tone: "text-[var(--hunter-primary)] bg-[var(--hunter-primary-soft)] border-indigo-500/20",
  },
  {
    icon: "Sparkles",
    title: "AI Cover Letters",
    badge: "AI Generator",
    desc: "Generate tailored cover letters in seconds. Adjust tone, length, and focus with one click to highlight your strongest qualifications.",
    tone: "text-[var(--hunter-warning)] bg-[var(--hunter-warning-soft)] border-amber-500/20",
  },
  {
    icon: "Brain",
    title: "AI Mock Interview",
    badge: "Prep Coach",
    desc: "Simulate role-tailored technical and behavioral interview rounds. Receive instant score breakdowns, strengths, and actionable tips.",
    tone: "text-[var(--hunter-accent)] bg-[var(--hunter-accent-soft)] border-sky-500/20",
  },
  {
    icon: "BarChart3",
    title: "Smart Analytics",
    badge: "Metrics",
    desc: "Track response rates, conversion funnels, and time-to-reply across your entire search to double down on what works.",
    tone: "text-[var(--hunter-success)] bg-[var(--hunter-success-soft)] border-emerald-500/20",
  },
];

const steps = [
  {
    number: "1",
    title: "Add Jobs",
    description:
      "Save roles quickly, track salary ranges, and keep all job search details organized in one place from day one.",
    icon: "Plus" as IconName,
  },
  {
    number: "2",
    title: "Track & Create",
    description:
      "Move applications through stages, generate tailored AI cover letters, and prepare for interviews with AI coaching.",
    icon: "Wand2" as IconName,
  },
  {
    number: "3",
    title: "Improve Faster",
    description:
      "Use Hunter's insights and reminders to follow up better, optimize your resume keywords, and close higher offers.",
    icon: "TrendingUp" as IconName,
  },
];

export function Hunter() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const borderColor = isDark ? "rgba(255, 255, 255, 0.08)" : "var(--hunter-border)";
  const mutedText = isDark ? "rgba(245, 247, 246, 0.65)" : "var(--hunter-muted)";

  return (
    <div
      className="relative min-h-screen overflow-hidden selection:bg-[var(--hunter-primary)] selection:text-white transition-colors duration-300"
      style={{ background: "var(--hunter-bg)", color: "var(--hunter-text)" }}
    >
      {/* Background Ambient Glow Orbs with Refined Color Palette */}
      <div
        className="orb pointer-events-none fixed"
        style={{
          width: 520,
          height: 520,
          background: isDark
            ? "radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(79, 70, 229, 0.14) 0%, transparent 70%)",
          top: -140,
          right: -80,
          filter: "blur(60px)",
        }}
      />
      <div
        className="orb pointer-events-none fixed"
        style={{
          width: 440,
          height: 440,
          background: isDark
            ? "radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(2, 132, 199, 0.12) 0%, transparent 70%)",
          bottom: 80,
          left: -120,
          filter: "blur(50px)",
        }}
      />
      <div
        className="orb pointer-events-none fixed"
        style={{
          width: 380,
          height: 380,
          background: isDark
            ? "radial-gradient(circle, rgba(167, 139, 250, 0.15) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(124, 58, 237, 0.10) 0%, transparent 70%)",
          top: "45%",
          right: "12%",
          filter: "blur(50px)",
        }}
      />

      {/* Navigation */}
      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:py-8">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-3 border-none bg-transparent p-0 cursor-pointer group"
          aria-label="Hunter home"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[var(--hunter-primary)] to-[var(--hunter-accent)] text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Icon name="Target" size={19} />
          </div>
          <div className="flex flex-col items-start text-left">
            <span className="font-display text-xl font-bold tracking-tight">Hunter</span>
          </div>
        </button>

        <div className="flex items-center gap-3.5">
          <ThemeToggle />
          <button
            className="hunter-btn-ghost text-sm font-medium px-4 py-2"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
          <button
            className="hunter-btn-primary text-sm font-medium px-4 py-2 shadow-sm"
            onClick={() => navigate("/signup")}
          >
            Get started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-12 sm:pt-16">
        <div className="animate-fade-in-up max-w-3xl">
          {/* Eyebrow Badge */}
          <div
            className="mb-8 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md shadow-sm border"
            style={{
              background: "var(--hunter-primary-soft)",
              color: "var(--hunter-primary)",
              borderColor: isDark ? "rgba(99, 102, 241, 0.3)" : "rgba(79, 70, 229, 0.2)",
            }}
          >
            <Icon name="Sparkles" size={13} />
            <span>AI-powered job search, reimagined</span>
          </div>

          {/* Heading */}
          <h1
            className="mb-6 font-display text-5xl font-extrabold leading-[1.06] tracking-tight sm:text-6xl md:text-7xl"
            style={{ color: "var(--hunter-text)" }}
          >
            Track every application.
            <br />
            <span className="bg-gradient-to-r from-[var(--hunter-primary)] via-[var(--hunter-accent)] to-[var(--hunter-purple)] bg-clip-text text-transparent">
              Land the right role.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="mb-10 text-lg leading-8 max-w-2xl"
            style={{ color: mutedText }}
          >
            Hunter is the calm, focused workspace for job seekers. Kanban tracking,
            AI cover letters, mock interview coaching, and analytics — all in one place.
          </p>

          {/* CTA Row */}
          <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center">
            <button
              className="hunter-btn-primary inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform"
              onClick={() => navigate("/signup")}
            >
              Start free <Icon name="ArrowRight" size={16} />
            </button>
            <button
              className="hunter-btn-ghost px-6 py-3.5 text-base font-semibold"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
          </div>
        </div>

        {/* Action Showcase Card: Quick Action Preview */}
        <div className="mt-16 p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden backdrop-blur-md"
             style={{
               background: "var(--hunter-surface)",
               borderColor,
             }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b" style={{ borderColor }}>
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-rose-500" />
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-[var(--hunter-muted)] ml-2">Hunter Workspace • Live Dashboard Snapshot</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
              <Icon name="CheckCircle2" size={13} />
              <span>4 Applications in Progress</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-2xl border" style={{ background: "var(--hunter-bg)", borderColor }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">Applied</span>
                <span className="text-[10px] text-[var(--hunter-muted)]">2d ago</span>
              </div>
              <div className="font-bold text-sm">Linear</div>
              <div className="text-xs text-[var(--hunter-muted)]">Product Engineer</div>
              <div className="mt-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400">$175k - $200k</div>
            </div>

            <div className="p-4 rounded-2xl border border-amber-500/30" style={{ background: "var(--hunter-bg)" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">Interview</span>
                <span className="text-[10px] text-amber-600 font-semibold">Round 2</span>
              </div>
              <div className="font-bold text-sm">Stripe</div>
              <div className="text-xs text-[var(--hunter-muted)]">Staff Frontend</div>
              <div className="mt-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400">$190k - $220k</div>
            </div>

            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  <Icon name="PartyPopper" size={10} /> Offer
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">Received</span>
              </div>
              <div className="font-bold text-sm">Vercel</div>
              <div className="text-xs text-[var(--hunter-muted)]">React Architect</div>
              <div className="mt-3 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">$215,000</div>
            </div>

            <div className="p-4 rounded-2xl border" style={{ background: "var(--hunter-bg)", borderColor }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">AI Prep</span>
                <span className="text-[10px] text-purple-600 font-semibold">95% Score</span>
              </div>
              <div className="font-bold text-sm">Figma</div>
              <div className="text-xs text-[var(--hunter-muted)]">Design Systems</div>
              <div className="mt-3 text-xs font-semibold text-purple-600 dark:text-purple-400">Mock Complete</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className={`hunter-panel animate-fade-in-up p-7 stagger-${index + 1} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between`}
              style={{
                borderColor,
                background: "var(--hunter-surface-strong)",
              }}
            >
              <div>
                <div
                  className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl border ${feature.tone}`}
                >
                  <Icon name={feature.icon} size={20} />
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--hunter-accent)] mb-1">
                  {feature.badge}
                </div>
                <h3 className="mb-2.5 font-display text-xl font-bold tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: mutedText }}>
                  {feature.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Workflow Section */}
      <section
        id="workflow"
        className="relative z-10 border-t px-6 py-20 md:py-24"
        style={{ borderColor }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="animate-fade-in-up text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              How Hunter works
            </h2>
            <p className="mt-3 text-base md:text-lg" style={{ color: mutedText }}>
              A focused, systematic path to landing your next career milestone.
            </p>
          </div>

          <div className="relative mt-14 grid gap-8 md:grid-cols-3">
            {/* Horizontal connecting line */}
            <div
              className="absolute left-0 top-8 hidden h-px w-full md:block pointer-events-none"
              style={{
                backgroundImage: isDark
                  ? "linear-gradient(to right, transparent, rgba(99,102,241,0.35), rgba(56,189,248,0.35), transparent)"
                  : "linear-gradient(to right, transparent, rgba(79,70,229,0.25), rgba(2,132,199,0.25), transparent)",
              }}
            />

            {steps.map((step, index) => (
              <article
                key={step.number}
                className={`relative z-10 animate-fade-in-up text-center stagger-${index + 1}`}
              >
                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] text-xl font-bold shadow-lg transition-transform hover:scale-105"
                  style={{
                    background:
                      index === 0
                        ? "linear-gradient(135deg, var(--hunter-primary), var(--hunter-primary-hover))"
                        : index === 1
                          ? isDark
                            ? "rgba(56, 189, 248, 0.16)"
                            : "#e0f2fe"
                          : isDark
                            ? "rgba(167, 139, 250, 0.18)"
                            : "#f3e8ff",
                    color:
                      index === 0
                        ? "#ffffff"
                        : index === 1
                          ? isDark
                            ? "#38bdf8"
                            : "#0284c7"
                          : isDark
                            ? "#a78bfa"
                            : "#7c3aed",
                    border:
                      index === 0
                        ? "none"
                        : index === 1
                          ? isDark
                            ? "1px solid rgba(56,189,248,0.3)"
                            : "1px solid #bae6fd"
                          : isDark
                            ? "1px solid rgba(167,139,250,0.3)"
                            : "1px solid #e9d5ff",
                  }}
                >
                  {step.number}
                </div>
                <h3 className="mt-6 font-display text-xl font-bold tracking-tight">
                  {step.title}
                </h3>
                <p
                  className="mx-auto mt-2.5 max-w-xs text-sm leading-relaxed md:text-base"
                  style={{ color: mutedText }}
                >
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mx-auto max-w-6xl px-6 pb-12 text-sm" style={{ color: mutedText }}>
        <div
          className="flex flex-col justify-between gap-4 pt-8 sm:flex-row sm:items-center"
          style={{ borderTop: `1px solid ${borderColor}` }}
        >
          <span>&copy; {new Date().getFullYear()} Hunter. Built for ambitious job seekers.</span>
          <div className="flex gap-6">
            <a href="#workflow" className="hover:text-[var(--hunter-text)] transition-colors">
              How it works
            </a>
            <button
              type="button"
              className="border-none bg-transparent p-0 hover:text-[var(--hunter-text)] transition-colors cursor-pointer"
              style={{ color: mutedText }}
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
            <button
              type="button"
              className="border-none bg-transparent p-0 hover:text-[var(--hunter-text)] transition-colors cursor-pointer"
              style={{ color: mutedText }}
              onClick={() => navigate("/signup")}
            >
              Get started
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
