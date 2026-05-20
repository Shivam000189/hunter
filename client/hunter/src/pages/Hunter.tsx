import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "AI Cover Letters",
    description:
      "Generate tailored cover letters in seconds using the data Hunter already helps you organize.",
    tone: "bg-[#e4ebea] text-[#5a7265]",
  },
  {
    title: "Kanban Tracking",
    description:
      "Visualize every application stage in a clear board so your search stays structured and easy to manage.",
    tone: "bg-[#e7eaef] text-[#5f6d82]",
  },
  {
    title: "Smart Analytics",
    description:
      "Review response patterns, interview progress, and search momentum with a cleaner visual summary.",
    tone: "bg-[#ece6da] text-[#8a6f45]",
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
      "Use Hunter’s insights and reminders to follow up better and focus on what gets results.",
  },
];

export function Hunter() {
  const navigate = useNavigate();

  return (
    <div className="hunter-landing min-h-screen bg-[#f4f4f3] text-[#191919]">
      <div className="hunter-mesh pointer-events-none fixed inset-0 opacity-70" />
      <div className="relative">
        <nav className="sticky top-0 z-30 border-b border-black/6 bg-[#f4f4f3]/88 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#191919] shadow-[0_14px_30px_rgba(25,25,25,0.14)]">
                <svg width="22" height="22" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="64" height="64" rx="16" fill="#191919" />
                  <rect x="16" y="26" width="32" height="20" rx="4" stroke="#dde7f8" strokeWidth="2" />
                  <path d="M24 26V22C24 20.8954 24.8954 20 26 20H38C39.1046 20 40 20.8954 40 22V26" stroke="#dde7f8" strokeWidth="2" />
                  <path d="M26 38L32 32L38 38" stroke="#cce3d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M32 32V44" stroke="#cce3d4" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="48" cy="16" r="3" fill="#d8b56a" />
                </svg>
              </div>
              <div>
                <div className="font-serif text-2xl font-bold italic leading-none">Hunter</div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-black/40">Job Search Command</div>
              </div>
            </div>

            <div className="hidden items-center gap-6 text-sm font-medium text-black/58 md:flex">
              <a href="#features" className="transition hover:text-black">Features</a>
              <a href="#workflow" className="transition hover:text-black">How it works</a>
              <a href="#launch" className="transition hover:text-black">Get started</a>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="rounded-full px-4 py-2 text-sm font-medium text-black/62 transition hover:bg-white/70"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="rounded-full bg-[#191919] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
              >
                Get Started
              </button>
            </div>
          </div>
        </nav>

        <section className="relative overflow-hidden px-5 pb-18 pt-14 md:px-8 md:pb-24 md:pt-18">
          <div className="hunter-orb hunter-orb-left" />
          <div className="hunter-orb hunter-orb-right" />

          <div className="mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/82 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-black/55 shadow-[0_12px_24px_rgba(25,25,25,0.05)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8ba29a] opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#5f766d]" />
              </span>
              AI-powered job search workflow
            </div>

            <h1 className="mx-auto mt-7 max-w-4xl font-serif text-4xl font-bold leading-[1.04] tracking-tight text-[#191919] md:text-6xl">
              Land your next role with a calmer,
              <span className="mx-2 inline-block text-[#6a7c73]">cleaner</span>
              Hunter experience.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-black/60 md:text-lg">
              Track applications, create personalized cover letters, and review search insights with the
              same Hunter product, now in a more polished layout using your current color direction.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={() => navigate("/login")}
                className="inline-flex w-full items-center justify-center rounded-full bg-[#191919] px-7 py-3.5 text-base font-semibold text-white shadow-[0_18px_36px_rgba(25,25,25,0.16)] transition hover:-translate-y-0.5 hover:bg-black sm:w-auto"
              >
                Start Tracking for Free
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="inline-flex w-full items-center justify-center rounded-full border border-black/10 bg-white/80 px-7 py-3.5 text-base font-semibold text-[#191919] transition hover:bg-white sm:w-auto"
              >
                Create Account
              </button>
            </div>

            <div className="mt-14">
              <div className="hunter-panel overflow-hidden rounded-[30px] p-3 md:p-5">
                <div className="rounded-[26px] border border-black/6 bg-[#fbfbfa]">
                  <div className="flex items-center gap-2 border-b border-black/6 px-4 py-3 md:px-5">
                    <div className="h-3 w-3 rounded-full bg-[#d2b7a0]" />
                    <div className="h-3 w-3 rounded-full bg-[#ddd0a5]" />
                    <div className="h-3 w-3 rounded-full bg-[#b8cdbf]" />
                    <div className="ml-3 h-8 w-28 rounded-full border border-black/6 bg-white/80 md:w-52" />
                  </div>

                  <div className="grid gap-4 p-4 md:grid-cols-12 md:p-6">
                    <div className="rounded-[22px] bg-white p-4 md:col-span-3">
                      <div className="h-9 w-24 rounded-2xl bg-[#e7eaef]" />
                      <div className="mt-4 space-y-3">
                        <div className="h-3 rounded-full bg-[#f0efeb]" />
                        <div className="h-3 w-4/5 rounded-full bg-[#f0efeb]" />
                        <div className="h-3 w-2/3 rounded-full bg-[#f0efeb]" />
                      </div>
                    </div>

                    <div className="grid gap-4 md:col-span-9 md:grid-cols-3">
                      <div className="rounded-[22px] bg-[#e7eaef] p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5f6d82]">Applied</div>
                        <div className="mt-6 h-12 rounded-2xl bg-white/75" />
                      </div>
                      <div className="rounded-[22px] bg-[#e4ebea] p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5a7265]">Interview</div>
                        <div className="mt-6 h-12 rounded-2xl bg-white/75" />
                      </div>
                      <div className="rounded-[22px] bg-[#ece6da] p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6f45]">Offers</div>
                        <div className="mt-6 h-12 rounded-2xl bg-white/75" />
                      </div>

                      <div className="rounded-[24px] border border-black/6 bg-white p-4 shadow-[0_16px_30px_rgba(25,25,25,0.04)] md:col-span-2">
                        <div className="mb-4 text-sm font-semibold text-black/62">Application momentum</div>
                        <div className="flex h-40 items-end gap-3">
                          <div className="h-[42%] flex-1 rounded-t-[16px] bg-[#d9e1e0]" />
                          <div className="h-[58%] flex-1 rounded-t-[16px] bg-[#c8d4d1]" />
                          <div className="h-[46%] flex-1 rounded-t-[16px] bg-[#b8c7d0]" />
                          <div className="h-[78%] flex-1 rounded-t-[16px] bg-[#94a5b6]" />
                          <div className="h-[68%] flex-1 rounded-t-[16px] bg-[#191919]" />
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-black/6 bg-white p-4 shadow-[0_16px_30px_rgba(25,25,25,0.04)]">
                        <div className="text-sm font-semibold text-black/62">Response rate</div>
                        <div className="mx-auto mt-6 flex h-28 w-28 items-center justify-center rounded-full border-[12px] border-[#9cb7aa] text-xl font-semibold text-[#191919]">
                          72%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mx-auto mt-5 max-w-xs rounded-[22px] border border-black/6 bg-white/86 p-4 shadow-[0_18px_30px_rgba(25,25,25,0.05)] md:mr-2 md:ml-auto">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5f766d] text-sm font-bold text-white">
                      OK
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-[#191919]">Offer stage updated</div>
                      <div className="text-xs text-black/50">Frontend role at a saved company</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-t border-black/6 bg-white/42 px-5 py-18 md:px-8 md:py-22">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="font-serif text-3xl font-bold tracking-tight text-[#191919] md:text-5xl">
                Everything you need, just presented better
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-black/56 md:text-lg">
                Same Hunter workflow, same product direction, improved balance, spacing, and visual clarity.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <article key={feature.title} className="hunter-panel rounded-[28px] p-7">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold ${feature.tone}`}>
                    H
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-tight text-[#191919]">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-black/58 md:text-base">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="border-t border-black/6 px-5 py-18 md:px-8 md:py-22">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="font-serif text-3xl font-bold tracking-tight text-[#191919] md:text-5xl">
                How Hunter works
              </h2>
              <p className="mt-4 text-base text-black/56 md:text-lg">A familiar flow, with cleaner section sizing and hierarchy.</p>
            </div>

            <div className="relative mt-12 grid gap-6 md:grid-cols-3">
              <div className="absolute left-0 top-8 hidden h-px w-full bg-gradient-to-r from-transparent via-black/12 to-transparent md:block" />
              {steps.map((step, index) => (
                <article key={step.number} className="relative z-10 text-center">
                  <div
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] text-xl font-bold shadow-[0_18px_28px_rgba(25,25,25,0.08)] ${
                      index === 0
                        ? "bg-[#191919] text-white"
                        : index === 1
                          ? "border border-black/10 bg-white text-[#191919]"
                          : "bg-[#ece6da] text-[#191919]"
                    }`}
                  >
                    {step.number}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight text-[#191919]">{step.title}</h3>
                  <p className="mx-auto mt-3 max-w-xs text-sm leading-7 text-black/58 md:text-base">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="launch" className="border-t border-black/6 px-5 py-18 md:px-8 md:py-22">
          <div className="mx-auto max-w-5xl">
            <div className="overflow-hidden rounded-[34px] bg-[#191919] px-6 py-10 text-center text-white md:px-10 md:py-14">
              <h2 className="font-serif text-3xl font-bold tracking-tight md:text-5xl">
                Ready to level up your search?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/68 md:text-lg">
                Hunter keeps the same tools you already built. This update just brings the landing page back
                to a cleaner, better-sized version using your current colors.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <button
                  onClick={() => navigate("/signup")}
                  className="rounded-full bg-white px-7 py-3.5 text-base font-semibold text-[#191919] transition hover:bg-[#f1f1ed]"
                >
                  Get Started
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="rounded-full border border-white/16 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/8"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-black/6 px-5 py-10 md:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 md:flex-row">
            <div className="text-center md:text-left">
              <div className="font-serif text-2xl font-bold italic text-[#191919]">Hunter</div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-black/40">
                Job tracking, AI drafting, analytics
              </div>
            </div>
            <div className="flex gap-6 text-sm text-black/48">
              <a href="#features" className="transition hover:text-black">Features</a>
              <a href="https://github.com/Shivam000189/hunter" className="transition hover:text-black">Support</a>
              <a href="https://x.com/shivam_s0" className="transition hover:text-black">Twitter</a>
            </div>
            <div className="text-sm text-black/36">© 2026 Hunter</div>
          </div>
        </footer>
      </div>
    </div>
  );
}
