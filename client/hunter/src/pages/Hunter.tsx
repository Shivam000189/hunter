import { useNavigate } from "react-router-dom";
import { Icon, type IconName } from "../components/ui/Icon";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { useTheme } from "../context/ThemeContext";

type FeatureItem = {
  icon: IconName;
  title: string;
  desc: string;
};

const features: FeatureItem[] = [
  {
    icon: "Briefcase",
    title: "Kanban Tracking",
    desc: "Visual pipeline for every application. Drag jobs through Applied, Interview, Offer, and Rejected stages.",
  },
  {
    icon: "Sparkles",
    title: "AI Cover Letters",
    desc: "Generate tailored cover letters in seconds. Adjust tone, length, and focus with one click.",
  },
  {
    icon: "BarChart3",
    title: "Smart Analytics",
    desc: "Track response rates, conversion funnels, and time-to-reply across your entire search.",
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

  const borderColor = isDark ? "rgba(255,255,255,0.08)" : "var(--hunter-border)";
  const mutedText = isDark ? "rgba(246,243,237,0.58)" : "var(--hunter-muted)";

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: "var(--hunter-bg)", color: "var(--hunter-text)" }}
    >
      <div
        className="orb"
        style={{
          width: 400,
          height: 400,
          background: "var(--hunter-accent)",
          top: -100,
          right: -100,
          opacity: isDark ? 0.16 : 0.4,
        }}
      />
      <div
        className="orb"
        style={{
          width: 300,
          height: 300,
          background: "var(--hunter-info)",
          bottom: 100,
          left: -100,
          opacity: isDark ? 0.12 : 0.25,
        }}
      />

      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 border-none bg-transparent p-0"
          aria-label="Hunter home"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#191919]">
            <span className="text-sm font-bold text-white">H</span>
          </div>
          <span className="font-display text-xl font-semibold">Hunter</span>
        </button>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button className="hunter-btn-ghost text-sm" onClick={() => navigate("/login")}>
            Sign in
          </button>
          <button className="hunter-btn-accent text-sm" onClick={() => navigate("/signup")}>
            Get started
          </button>
        </div>
      </nav>

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-28 pt-24">
        <div className="animate-fade-in-up">
          <div
            className="mb-8 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium"
            style={{
              background: "var(--hunter-accent-soft)",
              color: "var(--hunter-accent)",
              border: isDark ? "1px solid rgba(255,255,255,0.08)" : "none",
            }}
          >
            <Icon name="Sparkles" size={14} />
            <span>AI-powered job search, reimagined</span>
          </div>

          <h1
            className="mb-6 max-w-4xl font-display text-5xl font-medium leading-[1.05] tracking-tight md:text-7xl"
            style={{ color: "var(--hunter-text)" }}
          >
            Track every application.
            <br />
            <span style={{ color: "var(--hunter-muted)" }}>Land the right role.</span>
          </h1>

          <p className="mb-10 max-w-xl text-lg leading-8" style={{ color: mutedText }}>
            Hunter is the calm, focused workspace for job seekers. Kanban tracking,
            AI cover letters, resume scoring, and analytics, all in one place.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              className="hunter-btn-accent inline-flex items-center justify-center gap-2"
              onClick={() => navigate("/signup")}
            >
              Start free <Icon name="ArrowRight" size={16} />
            </button>
            <button className="hunter-btn-ghost" onClick={() => navigate("/login")}>
              Sign in
            </button>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className={`hunter-panel animate-fade-in-up p-8 stagger-${index + 1}`}
            >
              <div
                className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg"
                style={{
                  background: "var(--hunter-accent-soft)",
                  color: "var(--hunter-accent)",
                }}
              >
                <Icon name={feature.icon} size={20} />
              </div>
              <h3 className="mb-2 font-display text-xl font-medium">{feature.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: mutedText }}>
                {feature.desc}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="workflow"
        className="relative z-10 border-t px-6 py-20 md:py-24"
        style={{ borderColor }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="animate-fade-in-up text-center">
            <h2 className="font-display text-3xl font-medium tracking-tight md:text-5xl">
              How Hunter works
            </h2>
            <p className="mt-4 text-base md:text-lg" style={{ color: mutedText }}>
              A familiar flow, with cleaner section sizing and hierarchy.
            </p>
          </div>

          <div className="relative mt-12 grid gap-8 md:grid-cols-3">
            <div
              className="absolute left-0 top-8 hidden h-px w-full bg-gradient-to-r from-transparent to-transparent md:block"
              style={{
                backgroundImage: isDark
                  ? "linear-gradient(to right, transparent, rgba(255,255,255,0.12), transparent)"
                  : "linear-gradient(to right, transparent, rgba(25,25,25,0.12), transparent)",
              }}
            />

            {steps.map((step, index) => (
              <article
                key={step.number}
                className={`relative z-10 animate-fade-in-up text-center stagger-${index + 1}`}
              >
                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] text-xl font-bold shadow-[0_18px_28px_rgba(25,25,25,0.08)]"
                  style={{
                    background:
                      index === 0
                        ? "#191919"
                        : index === 1
                          ? isDark
                            ? "rgba(255,255,255,0.08)"
                            : "rgba(255,255,255,0.82)"
                          : isDark
                            ? "rgba(200,170,120,0.14)"
                            : "#ece6da",
                    color:
                      index === 0
                        ? "#ffffff"
                        : index === 2 && isDark
                          ? "#d8c4a0"
                          : "var(--hunter-text)",
                    border: index === 1 ? `1px solid ${borderColor}` : "none",
                  }}
                >
                  {step.number}
                </div>
                <h3 className="mt-6 font-display text-xl font-medium tracking-tight">
                  {step.title}
                </h3>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-7 md:text-base" style={{ color: mutedText }}>
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 mx-auto max-w-6xl px-6 pb-12 text-sm" style={{ color: mutedText }}>
        <div
          className="flex flex-col justify-between gap-4 pt-8 sm:flex-row sm:items-center"
          style={{ borderTop: `1px solid ${borderColor}` }}
        >
          <span>(c) 2026 Hunter. Built for job seekers.</span>
          <div className="flex gap-6">
            <a href="#workflow" className="hover:underline">
              How it works
            </a>
            <button
              type="button"
              className="border-none bg-transparent p-0 hover:underline"
              style={{ color: mutedText }}
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
            <button
              type="button"
              className="border-none bg-transparent p-0 hover:underline"
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
