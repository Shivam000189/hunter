import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { Icon } from "../components/ui/Icon";

const features = [
  {
    title: "AI Cover Letters",
    description:
      "Generate tailored cover letters in seconds using the data Hunter already helps you organize.",
    icon: "Sparkles" as const,
  },
  {
    title: "Kanban Tracking",
    description:
      "Visualize every application stage in a clear board so your search stays structured and easy to manage.",
    icon: "Briefcase" as const,
  },
  {
    title: "Smart Analytics",
    description:
      "Review response patterns, interview progress, and search momentum with a cleaner visual summary.",
    icon: "BarChart3" as const,
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

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${
        isDark ? "text-white" : "text-[#191919]"
      }`}
      style={{ background: isDark ? "#0f0f11" : "var(--hunter-bg)" }}
    >
      {/* Ambient Orbs */}
      <div
        className="orb pointer-events-none absolute"
        style={{
          width: 420,
          height: 420,
          background: "var(--hunter-accent)",
          top: -120,
          right: -80,
          opacity: isDark ? 0.12 : 0.22,
          filter: "blur(90px)",
        }}
      />
      <div
        className="orb pointer-events-none absolute"
        style={{
          width: 340,
          height: 340,
          background: "var(--hunter-info)",
          bottom: 40,
          left: -100,
          opacity: isDark ? 0.08 : 0.18,
          filter: "blur(90px)",
        }}
      />

      <div className="relative z-10">
        {/* Navigation */}
        <nav
          className={`sticky top-0 z-30 backdrop-blur-xl  ${
            isDark
              ? "border-white/10 bg-[#171717]/78"
              : "border-black/6 bg-[#f4f4f3]/88"
          }`}
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 md:px-8">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-2xl shadow-[0_14px_30px_rgba(25,25,25,0.14)]"
                style={{ background: "var(--hunter-primary)" }}
              >
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <div>
                <div
                  className={`font-display text-2xl font-bold italic leading-none ${
                    isDark ? "text-white" : ""
                  }`}
                >
                  Hunter
                </div>
                <div
                  className={`text-[10px] uppercase tracking-[0.22em] ${
                    isDark ? "text-white/40" : "text-black/40"
                  }`}
                >
                  Job Search Command
                </div>
              </div>
            </div>

            <div
              className={`hidden items-center gap-8 text-sm font-medium md:flex ${
                isDark ? "text-white/58" : "text-black/58"
              }`}
            >
              <a
                href="#features"
                className={`transition hover:${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                Features
              </a>
              <a
                href="#workflow"
                className={`transition hover:${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                How it works
              </a>
              <a
                href="#launch"
                className={`transition hover:${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                Get started
              </a>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={() => navigate("/login")}
                className={`hunter-btn-ghost text-sm ${
                  isDark ? "text-white/72 border-white/12 hover:bg-white/8" : ""
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/signup")}
                className={`hunter-btn-accent text-sm ${
                  isDark ? "bg-white/12 hover:bg-white/18" : ""
                }`}
              >
                Get Started
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 pb-20 pt-16 md:px-8 md:pb-28 md:pt-20">
          <div className="mx-auto max-w-5xl text-center">
            <div className="animate-fade-in-up">
              {/* <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8"
                style={{
                  background: isDark
                    ? "rgba(111,127,118,0.15)"
                    : "var(--hunter-accent-soft)",
                  color: isDark ? "#a6beb4" : "var(--hunter-accent)",
                  border: isDark ? "1px solid rgba(255,255,255,0.08)" : "none",
                }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8ba29a] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5f766d]" />
                </span>
                AI-powered job search workflow
              </div> */}

              <h1
                className={`mx-auto max-w-4xl font-display text-4xl font-medium leading-[1.08] tracking-tight md:text-6xl ${
                  isDark ? "text-white" : "text-[#191919]"
                }`}
              >
                Land your next role with a calmer,{" "}
                <span
                  style={{
                    color: isDark ? "#a6beb4" : "var(--hunter-accent)",
                  }}
                >
                  cleaner
                </span>{" "}
                Hunter experience.
              </h1>

              <p
                className={`mx-auto mt-6 max-w-2xl text-base leading-7 md:text-lg ${
                  isDark ? "text-white/64" : "text-black/60"
                }`}
              >
                Track applications, create personalized cover letters, and
                review search insights with the same Hunter product, now in a
                more polished layout using your current color direction.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => navigate("/login")}
                  className={`hunter-btn-accent inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold shadow-[0_18px_36px_rgba(25,25,25,0.16)] transition hover:-translate-y-0.5 sm:w-auto ${
                    isDark ? "bg-white/12 hover:bg-white/18" : ""
                  }`}
                >
                  Start Tracking for Free
                  <Icon name="ArrowRight" size={16} />
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className={`hunter-btn-ghost inline-flex w-full items-center justify-center rounded-full px-7 py-3.5 text-base font-semibold transition sm:w-auto ${
                    isDark
                      ? "border-white/12 bg-white/6 text-white hover:bg-white/10"
                      : ""
                  }`}
                >
                  Create Account
                </button>
              </div>
            </div>

            {/* Dashboard Mockup */}
            <div className="mt-14 animate-fade-in-up stagger-2">
              <div
                className="hunter-panel overflow-hidden rounded-[28px] p-3 md:p-5"
                style={{
                  background: isDark
                    ? "rgba(255,255,255,0.04)"
                    : "var(--hunter-surface)",
                }}
              >
                <div
                  className={`rounded-[24px] ${
                    isDark
                      ? "border border-white/8 bg-[#1b1b20]"
                      : "border border-black/6 bg-[#fbfbfa]"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 px-4 py-3 md:px-5 ${
                      isDark
                        ? "border-b border-white/8"
                        : "border-b border-black/6"
                    }`}
                  >
                    <div className="h-3 w-3 rounded-full bg-[#d2b7a0]" />
                    <div className="h-3 w-3 rounded-full bg-[#ddd0a5]" />
                    <div className="h-3 w-3 rounded-full bg-[#b8cdbf]" />
                    <div
                      className={`ml-3 h-8 w-28 rounded-full md:w-52 ${
                        isDark
                          ? "border border-white/8 bg-white/10"
                          : "border border-black/6 bg-white/80"
                      }`}
                    />
                  </div>

                  <div className="grid gap-4 p-4 md:grid-cols-12 md:p-6">
                    <div
                      className={`rounded-[20px] p-4 md:col-span-3 ${
                        isDark ? "bg-white/6" : "bg-white"
                      }`}
                      style={{
                        border: isDark
                          ? "1px solid rgba(255,255,255,0.06)"
                          : "1px solid var(--hunter-border)",
                      }}
                    >
                      <div className="h-9 w-24 rounded-2xl bg-[#e7eaef]" />
                      <div className="mt-4 space-y-3">
                        <div
                          className={`h-3 rounded-full ${
                            isDark ? "bg-white/8" : "bg-[#f0efeb]"
                          }`}
                        />
                        <div
                          className={`h-3 w-4/5 rounded-full ${
                            isDark ? "bg-white/8" : "bg-[#f0efeb]"
                          }`}
                        />
                        <div
                          className={`h-3 w-2/3 rounded-full ${
                            isDark ? "bg-white/8" : "bg-[#f0efeb]"
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:col-span-9 md:grid-cols-3">
                      <div
                        className="rounded-[20px] p-4"
                        style={{ background: "var(--hunter-accent-soft)" }}
                      >
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5a7265]">
                          Applied
                        </div>
                        <div className="mt-6 h-12 rounded-2xl bg-white/75" />
                      </div>
                      <div
                        className="rounded-[20px] p-4"
                        style={{ background: "#e7eaef" }}
                      >
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5f6d82]">
                          Interview
                        </div>
                        <div className="mt-6 h-12 rounded-2xl bg-white/75" />
                      </div>
                      <div
                        className="rounded-[20px] p-4"
                        style={{ background: "#ece6da" }}
                      >
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6f45]">
                          Offers
                        </div>
                        <div className="mt-6 h-12 rounded-2xl bg-white/75" />
                      </div>

                      <div
                        className={`rounded-[22px] p-4 shadow-[0_16px_30px_rgba(25,25,25,0.04)] md:col-span-2 ${
                          isDark
                            ? "border border-white/8 bg-white/6"
                            : "border border-black/6 bg-white"
                        }`}
                      >
                        <div
                          className={`mb-4 text-sm font-semibold ${
                            isDark ? "text-white/70" : "text-black/62"
                          }`}
                        >
                          Application momentum
                        </div>
                        <div className="flex h-40 items-end gap-3">
                          <div className="h-[42%] flex-1 rounded-t-[14px] bg-[#d9e1e0]" />
                          <div className="h-[58%] flex-1 rounded-t-[14px] bg-[#c8d4d1]" />
                          <div className="h-[46%] flex-1 rounded-t-[14px] bg-[#b8c7d0]" />
                          <div className="h-[78%] flex-1 rounded-t-[14px] bg-[#94a5b6]" />
                          <div className="h-[68%] flex-1 rounded-t-[14px] bg-[#191919]" />
                        </div>
                      </div>

                      <div
                        className={`rounded-[22px] p-4 shadow-[0_16px_30px_rgba(25,25,25,0.04)] ${
                          isDark
                            ? "border border-white/8 bg-white/6"
                            : "border border-black/6 bg-white"
                        }`}
                      >
                        <div
                          className={`text-sm font-semibold ${
                            isDark ? "text-white/70" : "text-black/62"
                          }`}
                        >
                          Response rate
                        </div>
                        <div
                          className={`mx-auto mt-6 flex h-28 w-28 items-center justify-center rounded-full border-[12px] text-xl font-semibold ${
                            isDark
                              ? "border-[#7f9a8d] text-white"
                              : "border-[#9cb7aa] text-[#191919]"
                          }`}
                        >
                          72%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`mx-auto mt-5 max-w-xs rounded-[20px] p-4 shadow-[0_18px_30px_rgba(25,25,25,0.05)] md:mr-2 md:ml-auto ${
                    isDark
                      ? "border border-white/8 bg-white/8"
                      : "border border-black/6 bg-white/86"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5f766d] text-sm font-bold text-white">
                      OK
                    </div>
                    <div className="text-left">
                      <div
                        className={`text-sm font-semibold ${
                          isDark ? "text-white" : "text-[#191919]"
                        }`}
                      >
                        Offer stage updated
                      </div>
                      <div
                        className={`text-xs ${
                          isDark ? "text-white/50" : "text-black/50"
                        }`}
                      >
                        Frontend role at a saved company
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="border-t border-black/6 px-6 py-20 md:px-8 md:py-24"
          style={{
            background: isDark
              ? "rgba(255,255,255,0.02)"
              : "rgba(255,255,255,0.42)",
          }}
        >
          <div className="mx-auto max-w-6xl">
            <div className="text-center animate-fade-in-up">
              <h2 className="font-display text-3xl font-medium tracking-tight md:text-5xl">
                Everything you need, just presented better
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-black/56 md:text-lg">
                Same Hunter workflow, same product direction, improved balance,
                spacing, and visual clarity.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {features.map((feature, i) => (
                <article
                  key={feature.title}
                  className={`hunter-panel rounded-[24px] p-7 animate-fade-in-up stagger-${
                    i + 1
                  }`}
                  style={{
                    background: isDark
                      ? "rgba(255,255,255,0.04)"
                      : "var(--hunter-surface)",
                  }}
                >
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl mb-5"
                    style={{
                      background: isDark
                        ? "rgba(111,127,118,0.15)"
                        : "var(--hunter-accent-soft)",
                      color: isDark ? "#a6beb4" : "var(--hunter-accent)",
                    }}
                  >
                    <Icon name={feature.icon} size={20} />
                  </div>
                  <h3 className="font-display text-xl font-medium tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-black/58 md:text-base">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section
          id="workflow"
          className={`border-t px-6 py-20 md:px-8 md:py-24 ${
            isDark ? "border-white/8" : "border-black/6"
          }`}
        >
          <div className="mx-auto max-w-6xl">
            <div className="text-center animate-fade-in-up">
              <h2
                className={`font-display text-3xl font-medium tracking-tight md:text-5xl ${
                  isDark ? "text-white" : "text-[#191919]"
                }`}
              >
                How Hunter works
              </h2>
              <p
                className={`mt-4 text-base md:text-lg ${
                  isDark ? "text-white/56" : "text-black/56"
                }`}
              >
                A familiar flow, with cleaner section sizing and hierarchy.
              </p>
            </div>

            <div className="relative mt-12 grid gap-8 md:grid-cols-3">
              <div
                className={`absolute left-0 top-8 hidden h-px w-full bg-gradient-to-r from-transparent to-transparent md:block ${
                  isDark ? "via-white/12" : "via-black/12"
                }`}
              />
              {steps.map((step, index) => (
                <article
                  key={step.number}
                  className={`relative z-10 text-center animate-fade-in-up stagger-${
                    index + 1
                  }`}
                >
                  <div
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] text-xl font-bold shadow-[0_18px_28px_rgba(25,25,25,0.08)] ${
                      index === 0
                        ? "bg-[#191919] text-white"
                        : index === 1
                          ? isDark
                            ? "border border-white/10 bg-white/8 text-white"
                            : "border border-black/10 bg-white text-[#191919]"
                          : isDark
                            ? "bg-[#3a3226] text-[#d8c4a0]"
                            : "bg-[#ece6da] text-[#191919]"
                    }`}
                  >
                    {step.number}
                  </div>
                  <h3
                    className={`mt-6 font-display text-xl font-medium tracking-tight ${
                      isDark ? "text-white" : "text-[#191919]"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`mx-auto mt-3 max-w-xs text-sm leading-7 md:text-base ${
                      isDark ? "text-white/58" : "text-black/58"
                    }`}
                  >
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          id="launch"
          className="border-t border-black/6 px-6 py-20 md:px-8 md:py-24"
        >
          <div className="mx-auto max-w-5xl animate-fade-in-up">
            <div
              className="overflow-hidden rounded-[32px] px-6 py-12 text-center text-white md:px-10 md:py-16"
              style={{ background: "var(--hunter-primary)" }}
            >
              <h2 className="font-display text-3xl font-medium tracking-tight md:text-5xl">
                Ready to level up your search?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/68 md:text-lg">
                Hunter keeps the same tools you already built. This update just
                brings the landing page back to a cleaner, better-sized version
                using your current colors.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => navigate("/signup")}
                  className="hunter-btn-accent rounded-full bg-white px-7 py-3.5 text-base font-semibold text-[#191919] transition hover:bg-[#f1f1ed]"
                >
                  Get Started
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="hunter-btn-ghost rounded-full border border-white/16 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/8"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          className={`border-t px-6 py-10 md:px-8 ${
            isDark ? "border-white/8" : "border-black/6"
          }`}
        >
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 md:flex-row">
            <div className="text-center md:text-left">
              <div
                className={`font-display text-2xl font-bold italic ${
                  isDark ? "text-white" : "text-[#191919]"
                }`}
              >
                Hunter
              </div>
              <div
                className={`mt-1 text-[11px] uppercase tracking-[0.2em] ${
                  isDark ? "text-white/40" : "text-black/40"
                }`}
              >
                Job tracking, AI drafting, analytics
              </div>
            </div>
            <div
              className={`flex gap-6 text-sm ${
                isDark ? "text-white/48" : "text-black/48"
              }`}
            >
              <a
                href="#features"
                className={`transition ${
                  isDark ? "hover:text-white" : "hover:text-black"
                }`}
              >
                Features
              </a>
              <a
                href="https://github.com/Shivam000189/hunter"
                className={`transition ${
                  isDark ? "hover:text-white" : "hover:text-black"
                }`}
              >
                Support
              </a>
              <a
                href="https://x.com/shivam_s0"
                className={`transition ${
                  isDark ? "hover:text-white" : "hover:text-black"
                }`}
              >
                Twitter
              </a>
            </div>
            <div
              className={`text-sm ${
                isDark ? "text-white/36" : "text-black/36"
              }`}
            >
              © 2026 Hunter
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
