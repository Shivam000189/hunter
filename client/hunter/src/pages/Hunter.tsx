import { useEffect, useState } from "react";
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

  // Mouse parallax offset state for floating cards
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setParallax({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const borderColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(91, 79, 207, 0.12)";
  const mutedText = isDark ? "rgba(245, 247, 246, 0.65)" : "#6b6580";

  return (
    <div
      className="relative min-h-screen overflow-x-hidden selection:bg-[#5b4fcf] selection:text-white transition-colors duration-300 font-sans"
      style={{
        background: isDark
          ? "linear-gradient(135deg, #0b0f19 0%, #111827 25%, #161b2e 50%, #111827 75%, #0b0f19 100%)"
          : "linear-gradient(135deg, #e8e0f0 0%, #f0eaf8 25%, #faf8ff 50%, #f5f0fa 75%, #ece4f5 100%)",
        color: isDark ? "#f8fafc" : "#1a1a2e",
      }}
    >
      {/* Background Glow Orbs */}
      <div
        className="pointer-events-none fixed"
        style={{
          width: 540,
          height: 540,
          background: isDark
            ? "radial-gradient(circle, rgba(91, 79, 207, 0.22) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(91, 79, 207, 0.12) 0%, transparent 70%)",
          top: -120,
          right: -80,
          filter: "blur(60px)",
        }}
      />
      <div
        className="pointer-events-none fixed"
        style={{
          width: 460,
          height: 460,
          background: isDark
            ? "radial-gradient(circle, rgba(59, 52, 232, 0.18) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(123, 127, 212, 0.15) 0%, transparent 70%)",
          bottom: 40,
          left: -100,
          filter: "blur(50px)",
        }}
      />

      {/* Navigation */}
      <nav className="relative z-20 mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6 sm:px-12 md:px-20">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="border-none bg-transparent p-0 cursor-pointer text-left transition-transform hover:opacity-90"
          aria-label="Hunter home"
        >
          <span className="text-[28px] font-extrabold tracking-[-0.5px] text-[#5b4fcf] dark:text-[#818cf8]">
            Hunter
          </span>
        </button>

        <div className="hidden md:flex items-center gap-10">
          <a
            href="#"
            className="text-[15px] font-medium text-[#4a4560] dark:text-[#cbd5e1] hover:text-[#5b4fcf] dark:hover:text-[#818cf8] transition-colors"
          >
            Home
          </a>
          <a
            href="#features"
            className="text-[15px] font-medium text-[#4a4560] dark:text-[#cbd5e1] hover:text-[#5b4fcf] dark:hover:text-[#818cf8] transition-colors"
          >
            About
          </a>
          <a
            href="#workflow"
            className="text-[15px] font-medium text-[#4a4560] dark:text-[#cbd5e1] hover:text-[#5b4fcf] dark:hover:text-[#818cf8] transition-colors"
          >
            Workflow
          </a>
        </div>

        <div className="flex items-center gap-4 sm:gap-5">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-[15px] font-medium text-[#4a4560] dark:text-[#cbd5e1] hover:text-[#5b4fcf] dark:hover:text-[#818cf8] transition-colors bg-transparent border-none cursor-pointer px-2 py-1"
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="bg-[#5b4fcf] hover:bg-[#4a3fbf] text-white px-6 sm:px-7 py-2.5 sm:py-3 rounded-full text-[15px] font-semibold transition-all duration-300 shadow-[0_4px_15px_rgba(91,79,207,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(91,79,207,0.4)] cursor-pointer"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto flex max-w-[1400px] flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 px-6 sm:px-12 md:px-20 pt-8 pb-16 lg:py-16 min-h-[calc(100vh-90px)]">
        {/* Left: Hero Content */}
        <div className="flex-1 max-w-[580px] w-full text-left animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold leading-[1.15] tracking-[-1px] text-[#1a1a2e] dark:text-white mb-6">
            Manage You Job{" "}
            <span className="text-[#3b34e8] dark:text-[#818cf8]">Application</span>
          </h1>

          <p className="text-[15px] leading-[1.7] text-[#6b6580] dark:text-[#94a3b8] mb-6 max-w-[480px]">
            Hunter is the calm, focused workspace for job seekers. Kanban tracking,
            AI cover letters, mock interview coaching, and analytics — all in one place.
          </p>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="px-4.5 py-2 rounded-full text-[13px] font-semibold text-[#5b4fcf] dark:text-[#a5b4fc] bg-[#5b4fcf]/10 dark:bg-[#5b4fcf]/20 border border-[#5b4fcf]/15">
              resume analyzer
            </span>
            <span className="px-4.5 py-2 rounded-full text-[13px] font-semibold text-[#5b4fcf] dark:text-[#a5b4fc] bg-[#5b4fcf]/10 dark:bg-[#5b4fcf]/20 border border-[#5b4fcf]/15">
              ATS
            </span>
          </div>

          {/* Start Free Button */}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="inline-flex items-center justify-center bg-[#5b4fcf] hover:bg-[#4a3fbf] text-white px-10 py-4 rounded-xl text-base font-semibold transition-all duration-300 shadow-[0_4px_20px_rgba(91,79,207,0.35)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(91,79,207,0.45)] cursor-pointer mb-9"
          >
            Start Free
          </button>

          {/* Rating Section */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-full bg-[#7c3aed] flex items-center justify-center text-[11px] font-bold text-white border-2 border-white dark:border-[#1e293b] shadow-sm">
                MR
              </div>
              <div className="w-9 h-9 rounded-full bg-[#f59e0b] -ml-2 flex items-center justify-center text-[11px] font-bold text-white border-2 border-white dark:border-[#1e293b] shadow-sm">
                DC
              </div>
              <div className="w-9 h-9 rounded-full bg-[#ef4444] -ml-2 flex items-center justify-center text-[11px] font-bold text-white border-2 border-white dark:border-[#1e293b] shadow-sm">
                SK
              </div>
              <div className="w-9 h-9 rounded-full bg-[#3b82f6] -ml-2 flex items-center justify-center text-[11px] font-bold text-white border-2 border-white dark:border-[#1e293b] shadow-sm">
                AS
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-0.5">
                <span className="text-[#f59e0b] text-sm leading-none">★</span>
                <span className="text-[#f59e0b] text-sm leading-none">★</span>
                <span className="text-[#f59e0b] text-sm leading-none">★</span>
                <span className="text-[#f59e0b] text-sm leading-none">★</span>
                <span className="text-[#f59e0b] text-sm leading-none">★</span>
                <span className="text-sm font-bold text-[#1a1a2e] dark:text-white ml-1.5">
                  4.9/5
                </span>
              </div>
              <span className="text-xs text-[#8b85a0] dark:text-[#94a3b8] mt-0.5">
                Loved by job seekers in 80+ countries
              </span>
            </div>
          </div>
        </div>

        {/* Right: Hero Visual with Man Image and Floating Cards */}
        <div className="flex-1 flex justify-center items-center relative max-w-[600px] w-full mt-4 lg:mt-0">
          {/* Main Circle with Man Image */}
          <div className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[480px] lg:h-[480px] rounded-full relative flex items-center justify-center overflow-hidden shadow-2xl shadow-indigo-500/10 dark:shadow-indigo-950/40"
               style={{
                 background: "linear-gradient(135deg, #7b7fd4 0%, #9b95d4 50%, #b0aad8 100%)",
               }}
          >
            <img
              src="/ChatGPT Image Sep 6, 2026, 02_36_20 PM.png"
              alt="Professional job seeker"
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                // Fallback to alias if needed
                (e.target as HTMLImageElement).src = "/hero-man.png";
              }}
            />
          </div>

          {/* Floating Card 1: Projects (Top-Left) */}
          <div
            className="absolute top-[12%] -left-[2%] sm:-left-[8%] lg:-left-[10%] bg-white dark:bg-[#141c2e] rounded-2xl p-3.5 sm:p-4 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-slate-100/80 dark:border-white/10 flex items-center gap-3 z-10 transition-transform duration-200 ease-out animate-float-1 backdrop-blur-md"
            style={{
              transform: `translate(${parallax.x * 6}px, ${parallax.y * 6}px)`,
            }}
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#f97316] to-[#fb923c] flex items-center justify-center text-white shadow-md shadow-orange-500/20 flex-shrink-0">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-base sm:text-lg font-bold text-[#1a1a2e] dark:text-white leading-tight">
                2K+
              </span>
              <span className="text-xs sm:text-[13px] text-[#8b85a0] dark:text-slate-400 font-medium">
                Projects
              </span>
            </div>
          </div>

          {/* Floating Card 2: Satisfaction (Top-Right) */}
          <div
            className="absolute top-[8%] -right-[2%] sm:-right-[4%] lg:-right-[5%] bg-white dark:bg-[#141c2e] rounded-2xl p-3 sm:p-4 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-slate-100/80 dark:border-white/10 flex items-center gap-3 z-10 transition-transform duration-200 ease-out animate-float-2 backdrop-blur-md"
            style={{
              transform: `translate(${parallax.x * 10}px, ${parallax.y * 10}px)`,
            }}
          >
            <span className="text-[#f59e0b] text-xl sm:text-2xl leading-none">★</span>
            <div className="flex flex-col text-left">
              <span className="text-base sm:text-lg font-bold text-[#1a1a2e] dark:text-white leading-tight">
                4.8
              </span>
              <span className="text-xs sm:text-[13px] text-[#8b85a0] dark:text-slate-400 font-medium">
                Satisfaction
              </span>
            </div>
          </div>

          {/* Floating Card 3: Product Designer (Bottom-Right) */}
          <div
            className="absolute bottom-[8%] -right-[2%] sm:-right-[6%] lg:-right-[8%] bg-white dark:bg-[#141c2e] rounded-2xl p-3.5 sm:p-4 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-slate-100/80 dark:border-white/10 flex items-center gap-3 z-10 transition-transform duration-200 ease-out animate-float-3 backdrop-blur-md"
            style={{
              transform: `translate(${parallax.x * 14}px, ${parallax.y * 14}px)`,
            }}
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#22c55e] to-[#4ade80] flex items-center justify-center text-white shadow-md shadow-emerald-500/20 flex-shrink-0">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm sm:text-base font-bold text-[#1a1a2e] dark:text-white leading-tight">
                Product Designer
              </span>
              <span className="text-xs sm:text-[13px] text-[#8b85a0] dark:text-slate-400 font-medium">
                5 Years
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Action Showcase: Live Dashboard Snapshot Preview */}
      <section className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-12 md:px-20 pb-20">
        <div
          className="p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden backdrop-blur-md"
          style={{
            background: isDark ? "rgba(20, 28, 46, 0.75)" : "rgba(255, 255, 255, 0.75)",
            borderColor,
          }}
        >
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b"
            style={{ borderColor }}
          >
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-rose-500" />
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-[#8b85a0] dark:text-slate-400 ml-2">
                Hunter Workspace • Live Dashboard Pipeline
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
              <Icon name="CheckCircle2" size={13} />
              <span>4 Applications in Progress</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div
              className="p-4 rounded-2xl border transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{
                background: isDark ? "#111827" : "#ffffff",
                borderColor,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  Applied
                </span>
                <span className="text-[10px] text-[#8b85a0] dark:text-slate-400">2d ago</span>
              </div>
              <div className="font-bold text-sm text-[#1a1a2e] dark:text-white">Linear</div>
              <div className="text-xs text-[#8b85a0] dark:text-slate-400">Product Engineer</div>
              <div className="mt-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                $175k - $200k
              </div>
            </div>

            <div
              className="p-4 rounded-2xl border border-amber-500/30 transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ background: isDark ? "#111827" : "#ffffff" }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  Interview
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                  Round 2
                </span>
              </div>
              <div className="font-bold text-sm text-[#1a1a2e] dark:text-white">Stripe</div>
              <div className="text-xs text-[#8b85a0] dark:text-slate-400">Staff Frontend</div>
              <div className="mt-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                $190k - $220k
              </div>
            </div>

            <div
              className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  <Icon name="PartyPopper" size={10} /> Offer
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  Received
                </span>
              </div>
              <div className="font-bold text-sm text-[#1a1a2e] dark:text-white">Vercel</div>
              <div className="text-xs text-[#8b85a0] dark:text-slate-400">React Architect</div>
              <div className="mt-3 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                $215,000
              </div>
            </div>

            <div
              className="p-4 rounded-2xl border transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{
                background: isDark ? "#111827" : "#ffffff",
                borderColor,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  AI Prep
                </span>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
                  95% Score
                </span>
              </div>
              <div className="font-bold text-sm text-[#1a1a2e] dark:text-white">Figma</div>
              <div className="text-xs text-[#8b85a0] dark:text-slate-400">Design Systems</div>
              <div className="mt-3 text-xs font-semibold text-purple-600 dark:text-purple-400">
                Mock Complete
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-12 md:px-20 pb-24">
        <div className="mb-12 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5b4fcf] dark:text-[#818cf8] bg-[#5b4fcf]/10 dark:bg-[#5b4fcf]/20 px-3.5 py-1.5 rounded-full border border-[#5b4fcf]/15">
            Features
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-[#1a1a2e] dark:text-white">
            Everything you need to get hired
          </h2>
          <p className="mt-2 text-base text-[#6b6580] dark:text-[#94a3b8] max-w-xl mx-auto">
            From discovering roles to negotiating offers, Hunter keeps your job search fast and organized.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className={`p-7 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between backdrop-blur-md`}
              style={{
                borderColor,
                background: isDark ? "rgba(20, 28, 46, 0.7)" : "rgba(255, 255, 255, 0.8)",
              }}
            >
              <div>
                <div
                  className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl border ${feature.tone}`}
                >
                  <Icon name={feature.icon} size={20} />
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#5b4fcf] dark:text-[#818cf8] mb-1">
                  {feature.badge}
                </div>
                <h3 className="mb-2.5 text-xl font-bold tracking-tight text-[#1a1a2e] dark:text-white">
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
        className="relative z-10 border-t px-6 sm:px-12 md:px-20 py-20 md:py-24"
        style={{ borderColor }}
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-[#1a1a2e] dark:text-white">
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
                  ? "linear-gradient(to right, transparent, rgba(91,79,207,0.35), rgba(56,189,248,0.35), transparent)"
                  : "linear-gradient(to right, transparent, rgba(91,79,207,0.25), rgba(59,52,232,0.25), transparent)",
              }}
            />

            {steps.map((step, index) => (
              <article
                key={step.number}
                className="relative z-10 text-center"
              >
                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] text-xl font-bold shadow-lg transition-transform hover:scale-105"
                  style={{
                    background:
                      index === 0
                        ? "#5b4fcf"
                        : isDark
                          ? "rgba(91, 79, 207, 0.18)"
                          : "#f0eaf8",
                    color:
                      index === 0
                        ? "#ffffff"
                        : isDark
                          ? "#a78bfa"
                          : "#5b4fcf",
                    border:
                      index === 0
                        ? "none"
                        : isDark
                          ? "1px solid rgba(167,139,250,0.3)"
                          : "1px solid rgba(91,79,207,0.2)",
                  }}
                >
                  {step.number}
                </div>
                <h3 className="mt-6 text-xl font-bold tracking-tight text-[#1a1a2e] dark:text-white">
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
      <footer
        className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-12 md:px-20 pb-12 text-sm"
        style={{ color: mutedText }}
      >
        <div
          className="flex flex-col justify-between gap-4 pt-8 sm:flex-row sm:items-center"
          style={{ borderTop: `1px solid ${borderColor}` }}
        >
          <span>&copy; {new Date().getFullYear()} Hunter. Built for ambitious job seekers.</span>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#5b4fcf] dark:hover:text-[#818cf8] transition-colors">
              Home
            </a>
            <a href="#features" className="hover:text-[#5b4fcf] dark:hover:text-[#818cf8] transition-colors">
              Features
            </a>
            <a href="#workflow" className="hover:text-[#5b4fcf] dark:hover:text-[#818cf8] transition-colors">
              Workflow
            </a>
            <button
              type="button"
              className="border-none bg-transparent p-0 hover:text-[#5b4fcf] dark:hover:text-[#818cf8] transition-colors cursor-pointer"
              style={{ color: mutedText }}
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
            <button
              type="button"
              className="border-none bg-transparent p-0 hover:text-[#5b4fcf] dark:hover:text-[#818cf8] transition-colors cursor-pointer font-semibold text-[#5b4fcf] dark:text-[#818cf8]"
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
