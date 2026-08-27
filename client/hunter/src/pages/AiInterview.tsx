import { type FormEvent, useEffect, useState } from "react";
import api from "../api/client";
import { Sidebar } from "../components/layout/Sidebar";
import { Icon } from "../components/ui/Icon";

type Message = {
  id: string;
  message: string;
  type: "USER" | "ASSISTANT";
};

type Interview = {
  id: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  score: number;
  feedback: string | null;
  conversation: Message[];
  answerFeedback?: {
    score: number;
    matchedKeywords: string[];
    missingKeywords: string[];
  } | null;
};

export function AiInterview() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [answer, setAnswer] = useState("");
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedId = sessionStorage.getItem("hunter-interview-id");
    if (!savedId) return;
    api.get(`/api/v1/interviews/${savedId}`).then((res) => setInterview(res.data.data)).catch(() => {
      sessionStorage.removeItem("hunter-interview-id");
    });
  }, []);

  async function startInterview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/api/v1/interviews", {
        resumeText,
        jobDescription,
      });
      setInterview(res.data.data);
      sessionStorage.setItem("hunter-interview-id", res.data.data.id);
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not start the interview");
    } finally {
      setLoading(false);
    }
  }

  async function submitAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!interview || !answer.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.post(`/api/v1/interviews/${interview.id}/answer`, { answer });
      setInterview(res.data.data);
      setAnswer("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not submit your answer");
    } finally {
      setLoading(false);
    }
  }

  function resetInterview() {
    sessionStorage.removeItem("hunter-interview-id");
    setInterview(null);
    setAnswer("");
    setError("");
  }

  const lastAssistantMessage = [...(interview?.conversation || [])].reverse().find((message) => message.type === "ASSISTANT");

  return (
    <div className="app-shell flex min-h-screen flex-col">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-auto p-4 sm:p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <header className="animate-fade-in-up flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--hunter-accent)" }}>
                <Icon name="FileQuestion" size={17} /> Practice room
              </div>
              <h1 className="font-display text-3xl font-medium">AI Interview</h1>
              <p className="mt-1 text-sm" style={{ color: "var(--hunter-muted)" }}>
                Practice with questions shaped around your resume and target role.
              </p>
            </div>
            {interview && <button type="button" className="hunter-btn-ghost self-start text-sm sm:self-auto" onClick={resetInterview}>Start over</button>}
          </header>

          {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          {!interview ? (
            <section className="hunter-panel animate-fade-in-up grid gap-8 p-6 md:grid-cols-[1fr_0.8fr] md:p-8">
              <div>
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: "var(--hunter-accent-soft)", color: "var(--hunter-accent)" }}>
                  <Icon name="Users" size={23} />
                </div>
                <h2 className="font-display text-2xl font-medium">Prepare for the role you want</h2>
                <p className="mt-3 max-w-lg text-sm leading-7" style={{ color: "var(--hunter-muted)" }}>
                  Hunter creates five focused questions from your experience and the role requirements, then checks each answer for the key ideas an excellent answer should contain.
                </p>
              </div>
              <form onSubmit={startInterview} className="space-y-4">
                <label className="block text-sm font-semibold" htmlFor="resume-text">Resume text</label>
                <textarea id="resume-text" value={resumeText} onChange={(event) => setResumeText(event.target.value)} placeholder="Paste your resume text here..." rows={7} className="w-full resize-y rounded-xl border border-slate-200 bg-white p-4 text-sm outline-none focus:border-slate-500" required />
                <label className="block text-sm font-semibold" htmlFor="job-description">Job description</label>
                <textarea id="job-description" value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Paste the job description here..." rows={7} className="w-full resize-y rounded-xl border border-slate-200 bg-white p-4 text-sm outline-none focus:border-slate-500" required />
                <button type="submit" disabled={loading} className="hunter-btn-accent inline-flex w-full items-center justify-center gap-2 disabled:cursor-wait disabled:opacity-60">
                  <Icon name="Sparkles" size={16} /> {loading ? "Preparing interview..." : "Begin interview"}
                </button>
              </form>
            </section>
          ) : (
            <section className="grid gap-6 lg:grid-cols-[1fr_0.72fr]">
              <div className="hunter-panel p-5 sm:p-8">
                <div className="mb-6 flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--hunter-border)" }}>
                  <span className="text-sm font-semibold">Question {Math.min(interview.conversation.filter((message) => message.type === "USER").length + 1, 5)} of 5</span>
                  <span className="text-xs uppercase tracking-[0.16em]" style={{ color: "var(--hunter-muted)" }}>{interview.status === "COMPLETED" ? "Complete" : "Live"}</span>
                </div>
                <div className="space-y-4">
                  {interview.conversation.map((message) => (
                    <div key={message.id} className={`flex ${message.type === "USER" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-7 ${message.type === "USER" ? "bg-[#191919] text-white" : "bg-slate-100 text-slate-800"}`}>
                        {message.message}
                      </div>
                    </div>
                  ))}
                </div>
                {interview.answerFeedback && (
                  <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                    <div className="flex items-center justify-between font-semibold"><span>Keyword coverage</span><span>{interview.answerFeedback.score}%</span></div>
                    {interview.answerFeedback.matchedKeywords.length > 0 && <p className="mt-2 text-emerald-700">Included: {interview.answerFeedback.matchedKeywords.join(", ")}</p>}
                    {interview.answerFeedback.missingKeywords.length > 0 && <p className="mt-2 text-amber-700">Try to include: {interview.answerFeedback.missingKeywords.join(", ")}</p>}
                  </div>
                )}
                {interview.status === "PENDING" && lastAssistantMessage && (
                  <form onSubmit={submitAnswer} className="mt-6 space-y-3">
                    <textarea value={answer} onChange={(event) => setAnswer(event.target.value)} rows={5} placeholder="Write your answer..." className="w-full resize-y rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 outline-none focus:border-slate-500" required />
                    <button type="submit" disabled={loading} className="hunter-btn-accent w-full disabled:cursor-wait disabled:opacity-60">{loading ? "Thinking..." : "Submit answer"}</button>
                  </form>
                )}
              </div>
              <aside className="hunter-panel h-fit p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--hunter-muted)" }}>Interview feedback</p>
                {interview.status === "COMPLETED" ? (
                  <>
                    <div className="mt-5 flex items-end gap-2"><span className="font-display text-5xl font-medium">{interview.score}</span><span className="pb-2 text-sm" style={{ color: "var(--hunter-muted)" }}>/ 100</span></div>
                    <p className="mt-5 whitespace-pre-line text-sm leading-7" style={{ color: "var(--hunter-muted)" }}>{interview.feedback}</p>
                  </>
                ) : <p className="mt-4 text-sm leading-7" style={{ color: "var(--hunter-muted)" }}>Answer each question thoughtfully. Your summary and score will appear here when you finish.</p>}
              </aside>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}