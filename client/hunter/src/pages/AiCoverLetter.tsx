import { type FormEvent, useEffect, useState } from "react";
import api from "../api/client";
import { Sidebar } from "../components/layout/Sidebar";
import { Icon } from "../components/ui/Icon";
import { useAuth } from "../context/AuthContext";

type Job = {
  id?: string;
  _id?: string;
  company: string;
  role: string;
};

type CoverLetter = {
  _id: string;
  content: string;
  jobId?: string | null;
  generatedAt: string;
};

type GeneratorMode = "cover-letter" | "cold-email";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(
    new Date(date)
  );

const getJobId = (job: Job) => job._id || job.id || "";

export function AiCoverLetter() {
  const { isGuest } = useAuth();
  const [mode, setMode] = useState<GeneratorMode>("cover-letter");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [letters, setLetters] = useState<CoverLetter[]>([]);
  const [jobId, setJobId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [tone, setTone] = useState("professional");
  const [recipientName, setRecipientName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [loading, setLoading] = useState(false);

  function loadData() {
    Promise.all([
      api.get("/api/v1/jobs", { params: { limit: 100 } }),
      api.get("/api/v1/ai/cover-letters"),
    ]).then(([jobsRes, lettersRes]) => {
      setJobs(jobsRes.data.data || []);
      setLetters(lettersRes.data.data || []);
    });
  }

  useEffect(() => {
    loadData();
  }, []);

  function skillsArray() {
    return skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  function handleJobSelect(nextJobId: string) {
    setJobId(nextJobId);

    const selectedJob = jobs.find((job) => getJobId(job) === nextJobId);
    if (selectedJob) {
      setCompanyName(selectedJob.company);
      setJobTitle(selectedJob.role);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint =
        mode === "cover-letter"
          ? "/api/v1/ai/cover-letter"
          : "/api/v1/ai/cold-email";

      const payload =
        mode === "cover-letter"
          ? {
              jobDescription,
              userSkills: skillsArray(),
              tone,
              jobId: jobId || undefined,
            }
          : {
              recipientName,
              companyName,
              jobTitle,
              userSkills: skillsArray(),
              tone,
            };

      const res = await api.post(endpoint, payload);
      setGeneratedContent(res.data.data.content);

      if (mode === "cover-letter") {
        loadData();
      }
    } finally {
      setLoading(false);
    }
  }

  const isColdEmail = mode === "cold-email";

  return (
    <div className="app-shell flex min-h-screen flex-col">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-auto p-4 sm:p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <header className="animate-fade-in-up flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-medium">
                AI Generator
              </h1>
              <p className="mt-1 text-sm" style={{ color: "var(--hunter-muted)" }}>
                Generate tailored cover letters and recruiter cold emails.
              </p>
            </div>

            <div className="hunter-panel inline-flex w-full gap-1 p-1 sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setMode("cover-letter");
                  setGeneratedContent("");
                }}
                className={`flex-1 rounded-[0.65rem] px-4 py-2 text-sm font-medium transition sm:flex-none ${
                  mode === "cover-letter"
                    ? "bg-[#191919] text-white"
                    : "bg-transparent"
                }`}
                style={{
                  color:
                    mode === "cover-letter" ? "#ffffff" : "var(--hunter-muted)",
                }}
              >
                Cover Letter
              </button>
              {!isGuest && <button
                type="button"
                onClick={() => {
                  setMode("cold-email");
                  setGeneratedContent("");
                }}
                className={`flex-1 rounded-[0.65rem] px-4 py-2 text-sm font-medium transition sm:flex-none ${
                  mode === "cold-email" ? "bg-[#191919] text-white" : "bg-transparent"
                }`}
                style={{
                  color: mode === "cold-email" ? "#ffffff" : "var(--hunter-muted)",
                }}
              >
                Cold Email
              </button>}
            </div>
          </header>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.85fr)]">
            <form
              onSubmit={handleSubmit}
              className="hunter-panel animate-fade-in-up space-y-4 p-5 sm:p-6"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    background: "var(--hunter-accent-soft)",
                    color: "var(--hunter-accent)",
                  }}
                >
                  <Icon name={isColdEmail ? "Mail" : "Sparkles"} size={18} />
                </div>
                <div>
                  <h2 className="font-display text-xl font-medium">
                    {isColdEmail ? "Cold Email" : "Cover Letter"}
                  </h2>
                  <p className="text-xs" style={{ color: "var(--hunter-muted)" }}>
                    {isColdEmail
                      ? "Reach out to a recruiter or hiring manager."
                      : "Draft a personalized application letter."}
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--hunter-muted)" }}>
                  Related Job
                </label>
                <select
                  value={jobId}
                  onChange={(e) => handleJobSelect(e.target.value)}
                  className="hunter-input cursor-pointer"
                >
                  <option value="">No linked job</option>
                  {jobs.map((job) => (
                    <option key={getJobId(job)} value={getJobId(job)}>
                      {job.role} at {job.company}
                    </option>
                  ))}
                </select>
              </div>

              {isColdEmail ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--hunter-muted)" }}>
                      Recipient Name
                    </label>
                    <input
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      required={isColdEmail}
                      className="hunter-input"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--hunter-muted)" }}>
                      Company Name
                    </label>
                    <input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Linear"
                      required={isColdEmail}
                      className="hunter-input"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--hunter-muted)" }}>
                      Job Title
                    </label>
                    <input
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Frontend Engineer"
                      required={isColdEmail}
                      className="hunter-input"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--hunter-muted)" }}>
                    Job Description
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    required={!isColdEmail}
                    className="hunter-input h-36"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--hunter-muted)" }}>
                    Skills
                  </label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="React, TypeScript, Node.js"
                    className="hunter-input"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--hunter-muted)" }}>
                    Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="hunter-input cursor-pointer"
                  >
                    <option value="professional">Professional</option>
                    <option value="enthusiastic">Enthusiastic</option>
                    <option value="concise">Concise</option>
                    <option value="formal">Formal</option>
                  </select>
                </div>
              </div>

              <button className="hunter-btn-primary inline-flex w-full items-center justify-center gap-2">
                <Icon name={isColdEmail ? "Mail" : "Sparkles"} size={16} />
                {loading
                  ? "Generating..."
                  : isColdEmail
                    ? "Generate Cold Email"
                    : "Generate Cover Letter"}
              </button>
            </form>

            <section className="hunter-panel animate-fade-in-up stagger-2 flex min-h-[420px] flex-col p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-medium">Output</h2>
                  <p className="text-xs" style={{ color: "var(--hunter-muted)" }}>
                    {isColdEmail
                      ? "Your cold email draft will appear here."
                      : "Your cover letter draft will appear here."}
                  </p>
                </div>
              </div>

              <div
                className="flex-1 whitespace-pre-wrap rounded-xl border p-4 text-sm leading-7"
                style={{
                  background: "rgba(240,239,235,0.55)",
                  borderColor: "var(--hunter-border)",
                  color: "var(--hunter-text)",
                }}
              >
                {generatedContent ||
                  (isColdEmail
                    ? "Generated cold email will appear here."
                    : "Generated cover letter will appear here.")}
              </div>
            </section>
          </div>

          <section className="hunter-panel overflow-hidden">
            <div className="border-b p-4" style={{ borderColor: "var(--hunter-border)" }}>
              <h2 className="font-display text-lg font-medium">Previous Letters</h2>
              <p className="text-xs" style={{ color: "var(--hunter-muted)" }}>
                Saved cover letters from your application history.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Preview</th>
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-4 py-3 text-left font-medium">Job</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {letters.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-5 text-slate-500">
                        No cover letters generated yet.
                      </td>
                    </tr>
                  ) : (
                    letters.map((letter) => {
                      const job = jobs.find(
                        (item) => getJobId(item) === letter.jobId
                      );

                      return (
                        <tr key={letter._id} className="hover:bg-slate-50">
                          <td className="max-w-[360px] truncate px-4 py-3">
                            {letter.content}
                          </td>
                          <td className="px-4 py-3 text-slate-500">
                            {formatDate(letter.generatedAt)}
                          </td>
                          <td className="px-4 py-3 text-slate-500">
                            {job ? `${job.role} at ${job.company}` : "Not linked"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
