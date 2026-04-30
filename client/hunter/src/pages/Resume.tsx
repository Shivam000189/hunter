import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { Sidebar } from "../components/layout/Sidebar";

type ResumeItem = {
  _id: string;
  url: string;
  versionName: string;
  uploadedAt: string;
  usage: number;
  interviews: number;
  offers: number;
  successRate: number;
};

type ResumeFeedback = {
  score: number;
  atsScore: number;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  suggestions: string[];
};

type MatchResult = {
  matchScore: number;
  matchedKeywords: string[];
  missingSkills: string[];
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

export function Resume() {
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [versionName, setVersionName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [feedback, setFeedback] = useState<ResumeFeedback | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [aiLoading, setAiLoading] = useState<"feedback" | "match" | null>(null);

  const bestResumeId = useMemo(() => {
    if (resumes.length === 0) return null;

    return [...resumes].sort((a, b) => {
      if (b.successRate !== a.successRate) return b.successRate - a.successRate;
      if (b.offers !== a.offers) return b.offers - a.offers;
      return b.usage - a.usage;
    })[0]._id;
  }, [resumes]);

  function loadResumes() {
    setLoading(true);
    api
      .get("/api/v1/resumes")
      .then((res) => setResumes(res.data.data || []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadResumes();
  }, []);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] || null);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file || !versionName) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("versionName", versionName);

    await api.post("/api/v1/resumes/upload", formData);
    setFile(null);
    setVersionName("");
    loadResumes();
  }

  async function deleteResume(id: string) {
    await api.delete(`/api/v1/resumes/${id}`);
    loadResumes();
  }

  async function analyzeResume() {
    if (!resumeText.trim()) return;

    setAiLoading("feedback");
    setFeedback(null);

    try {
      const res = await api.post("/api/v1/ai/resume-feedback", {
        resumeText,
        jobDescription: jobDescription || undefined,
      });

      setFeedback(res.data.data);
    } finally {
      setAiLoading(null);
    }
  }

  async function scoreMatch() {
    if (!resumeText.trim() || !jobDescription.trim()) return;

    setAiLoading("match");
    setMatchResult(null);

    try {
      const res = await api.post("/api/v1/ai/resume-match", {
        resumeText,
        jobDescription,
      });

      setMatchResult(res.data.data);
    } finally {
      setAiLoading(null);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 lg:flex-row">
      <Sidebar />

      <div className="min-w-0 flex-1 space-y-6 p-4 sm:p-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Resume Intelligence
          </h2>
          <p className="text-sm text-slate-500">
            Optimize resume versions with performance data and AI feedback.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-6 shadow-sm transition-colors hover:border-indigo-400 sm:p-8"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
            <svg
              className="h-8 w-8 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m9-13V3a2 2 0 00-2-2H9a2 2 0 00-2 2v1"
              />
            </svg>
          </div>

          <h3 className="mb-3 text-center font-medium">Upload Resume</h3>
          <div className="mx-auto grid max-w-2xl gap-3 sm:grid-cols-[1fr_auto]">
            <input
              value={versionName}
              onChange={(e) => setVersionName(e.target.value)}
              placeholder="Version name"
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-600"
            />
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm"
            />
            <button className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700 sm:col-span-2">
              Upload
            </button>
          </div>
        </form>

        {loading ? (
          <div className="rounded-2xl bg-white p-5 text-sm text-slate-500 shadow-sm">
            Loading resumes...
          </div>
        ) : resumes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No resumes uploaded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-slate-900">
                      {resume.versionName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Uploaded {formatDate(resume.uploadedAt)}
                    </p>
                  </div>

                  {resume._id === bestResumeId && resume.usage > 0 && (
                    <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                      Best Performing
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Used</div>
                    <div className="mt-1 font-semibold">
                      {resume.usage} times
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Interviews</div>
                    <div className="mt-1 font-semibold">{resume.interviews}</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Offers</div>
                    <div className="mt-1 font-semibold">{resume.offers}</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Success Rate</div>
                    <div className="mt-1 font-semibold">
                      {resume.successRate}%
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
                  <a
                    href={resume.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-indigo-600 hover:underline"
                  >
                    View
                  </a>
                  <button
                    onClick={() => deleteResume(resume._id)}
                    className="text-sm font-medium text-rose-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold">AI Resume Feedback</h3>
            <div className="space-y-3">
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste resume text..."
                className="h-40 w-full resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-600"
              />
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job description..."
                className="h-32 w-full resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-600"
              />
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={analyzeResume}
                  className="rounded-xl bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  {aiLoading === "feedback" ? "Analyzing..." : "Analyze Resume"}
                </button>
                <button
                  type="button"
                  onClick={scoreMatch}
                  className="rounded-xl border border-slate-300 py-2 text-sm font-medium hover:bg-slate-50"
                >
                  {aiLoading === "match" ? "Scoring..." : "Score Match"}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold">AI Output</h3>

            {feedback ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-indigo-50 p-3">
                    <div className="text-xs text-indigo-700">Score</div>
                    <div className="text-2xl font-bold text-indigo-900">
                      {feedback.score}
                    </div>
                  </div>
                  <div className="rounded-xl bg-emerald-50 p-3">
                    <div className="text-xs text-emerald-700">ATS Score</div>
                    <div className="text-2xl font-bold text-emerald-900">
                      {feedback.atsScore}
                    </div>
                  </div>
                </div>

                <OutputList title="Strengths" items={feedback.strengths} />
                <OutputList title="Weaknesses" items={feedback.weaknesses} />
                <OutputList
                  title="Missing Keywords"
                  items={feedback.missingKeywords}
                />
                <OutputList title="Suggestions" items={feedback.suggestions} />
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                Resume feedback will appear here.
              </p>
            )}

            {matchResult && (
              <div className="border-t border-slate-100 pt-4">
                <div className="mb-3 rounded-xl bg-slate-900 p-4 text-white">
                  <div className="text-xs text-slate-300">Match Score</div>
                  <div className="text-3xl font-bold">
                    {matchResult.matchScore}%
                  </div>
                </div>
                <OutputList
                  title="Missing Skills"
                  items={matchResult.missingSkills}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function OutputList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase text-slate-500">
        {title}
      </h4>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">No items returned.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
