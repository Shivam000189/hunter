import { useNavigate } from "react-router-dom";
import { Icon, type IconName } from "../components/ui/Icon";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { useTheme } from "../context/ThemeContext";

type FeatureItem = {
  icon: IconName;
  title: string;
  desc: string;
  tone: string;
};

const features: FeatureItem[] = [
  {
    icon: "Briefcase",
    title: "Kanban Tracking",
    desc: "Visual pipeline for every application. Drag jobs through Applied, Interview, Offer, and Rejected stages with custom reminders.",
    tone: "text-[var(--hunter-accent)] bg-[var(--hunter-accent-soft)]",
  },
  {
    icon: "Sparkles",
    title: "AI Cover Letters",
    desc: "Generate tailored cover letters in seconds. Adjust tone, length, and focus with one click to highlight your strongest qualifications.",
    tone: "text-[var(--hunter-warning)] bg-[var(--hunter-warning)]/15",
  },
  {
    icon: "BarChart3",
    title: "Smart Analytics",
    desc: "Track response rates, conversion funnels, and time-to-reply across your entire search to double down on what works.",
    tone: "text-[var(--hunter-info)] bg-[var(--hunter-info)]/15",
  },
];

const steps = [
  {
    number: "1",
    title: "Add Jobs",
    description:
      "Save roles quickly and keep your job search details organized in one place from the start.",
  },
  {
    number: "2",
    title: "Track and Create",
    description:
      "Move applications through stages, generate AI cover letters, and stay on top of next actions.",
  },
  {
    number: "3",
    title: "Improve Faster",
    description:
      "Use Hunter's insights and reminders to follow up better and focus on what gets results.",
  },
];

export function Hunter() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const borderColor = isDark ? "rgba(255,255,255,0.09)" : "var(--hunter-border)";
  const mutedText = isDark ? "rgba(245,247,246,0.65)" : "var(--hunter-muted)";

  return (
    <div
      className="relative min-h-screen overflow-hidden selection:bg-[var(--hunter-accent)] selection:text-white"
      style={{ background: "var(--hunter-bg)", color: "var(--hunter-text)" }}
    >
      {/* Background Ambient Glow Orbs with Refined Color Tones */}
      <div
        className="orb pointer-events-none"
        style={{
          width: 480,
          height: 480,
          background: isDark
            ? "radial-gradient(circle, #6ec095 0%, transparent 70%)"
            : "radial-gradient(circle, #37634c 0%, transparent 70%)",
          top: -120,
          right: -80,
          opacity: isDark ? 0.16 : 0.22,
        }}
      />
      <div
        className="orb pointer-events-none"
        style={{
          width: 400,
          height: 400,
          background: isDark
            ? "radial-gradient(circle, #486bb5 0%, transparent 70%)"
            : "radial-gradient(circle, #7f93c9 0%, transparent 70%)",
          bottom: 120,
          left: -100,
          opacity: isDark ? 0.14 : 0.2,
        }}
      />
      <div
        className="orb pointer-events-none"
        style={{
          width: 300,
          height: 300,
          background: isDark
            ? "radial-gradient(circle, #b88636 0%, transparent 70%)"
            : "radial-gradient(circle, #c8aa78 0%, transparent 70%)",
          top: "45%",
          right: "15%",
          opacity: isDark ? 0.1 : 0.15,
        }}
      />

      {/* Navigation */}
      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:py-8">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 border-none bg-transparent p-0 cursor-pointer"
          aria-label="Hunter home"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--hunter-primary)] text-white shadow-md">
            <Icon name="Target" size={18} />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">Hunter</span>
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
            className="hunter-btn-accent text-sm font-medium px-4 py-2 shadow-sm"
            onClick={() => navigate("/signup")}
          >
            Get started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-16 sm:pt-20">
        <div className="animate-fade-in-up">
          {/* Eyebrow Badge */}
          <div
            className="mb-8 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium backdrop-blur-md shadow-sm"
            style={{
              background: "var(--hunter-accent-soft)",
              color: "var(--hunter-accent)",
              border: `1px solid ${borderColor}`,
            }}
          >
            <Icon name="Sparkles" size={13} />
            <span>AI-powered job search, reimagined</span>
          </div>

          {/* Heading */}
          <h1
            className="mb-6 max-w-4xl font-display text-5xl font-semibold leading-[1.06] tracking-tight sm:text-6xl md:text-7xl"
            style={{ color: "var(--hunter-text)" }}
          >
            Track every application.
            <br />
            <span style={{ color: "var(--hunter-accent)" }}>Land the right role.</span>
          </h1>

          {/* Subtitle */}
          <p
            className="mb-10 max-w-2xl text-lg leading-8"
            style={{ color: mutedText }}
          >
            Hunter is the calm, focused workspace for job seekers. Kanban tracking,
            AI cover letters, resume scoring, and analytics, all in one place.
          </p>

          {/* CTA Row */}
          <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center">
            <button
              className="hunter-btn-accent inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-medium shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform"
              onClick={() => navigate("/signup")}
            >
              Start free <Icon name="ArrowRight" size={16} />
            </button>
            <button
              className="hunter-btn-ghost px-6 py-3.5 text-base font-medium"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className={`hunter-panel animate-fade-in-up p-8 stagger-${index + 1} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
              style={{
                borderColor,
                background: "var(--hunter-surface-strong)",
              }}
            >
              <div
                className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${feature.tone}`}
              >
                <Icon name={feature.icon} size={20} />
              </div>
              <h3 className="mb-2.5 font-display text-xl font-semibold tracking-tight">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: mutedText }}>
                {feature.desc}
              </p>
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
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              How Hunter works
            </h2>
            <p className="mt-3 text-base md:text-lg" style={{ color: mutedText }}>
              A familiar flow, with cleaner section sizing and hierarchy.
            </p>
          </div>

          <div className="relative mt-14 grid gap-8 md:grid-cols-3">
            {/* Horizontal connecting line */}
            <div
              className="absolute left-0 top-8 hidden h-px w-full md:block pointer-events-none"
              style={{
                backgroundImage: isDark
                  ? "linear-gradient(to right, transparent, rgba(110,192,149,0.3), rgba(184,134,54,0.3), transparent)"
                  : "linear-gradient(to right, transparent, rgba(55,99,76,0.2), rgba(184,134,54,0.2), transparent)",
              }}
            />

            {steps.map((step, index) => (
              <article
                key={step.number}
                className={`relative z-10 animate-fade-in-up text-center stagger-${index + 1}`}
              >
                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] text-xl font-bold shadow-md transition-transform hover:scale-105"
                  style={{
                    background:
                      index === 0
                        ? isDark
                          ? "#1d2b23"
                          : "#18221c"
                        : index === 1
                          ? isDark
                            ? "rgba(110, 192, 149, 0.16)"
                            : "#eaf3ee"
                          : isDark
                            ? "rgba(184, 134, 54, 0.18)"
                            : "#f7f0e4",
                    color:
                      index === 0
                        ? "#ffffff"
                        : index === 1
                          ? isDark
                            ? "#85ceaa"
                            : "#2c5440"
                          : isDark
                            ? "#e5c07b"
                            : "#8c6220",
                    border:
                      index === 0
                        ? isDark
                          ? "1px solid rgba(110,192,149,0.35)"
                          : "none"
                        : index === 1
                          ? isDark
                            ? "1px solid rgba(110,192,149,0.25)"
                            : "1px solid #d2e4d9"
                          : isDark
                            ? "1px solid rgba(184,134,54,0.3)"
                            : "1px solid #eddcc4",
                  }}
                >
                  {step.number}
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">
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
          <span>&copy; {new Date().getFullYear()} Hunter. Built for job seekers.</span>
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
