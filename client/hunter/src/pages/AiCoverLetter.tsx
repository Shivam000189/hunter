import { type FormEvent, useEffect, useState } from "react";
import api from "../api/client";
import { Sidebar } from "../components/layout/Sidebar";

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

const formatDate = (date: string) =>
  new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(
    new Date(date)
  );

export function AiCoverLetter() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [letters, setLetters] = useState<CoverLetter[]>([]);
  const [jobId, setJobId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [tone, setTone] = useState("professional");
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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/api/v1/ai/cover-letter", {
        jobDescription,
        userSkills: skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        tone,
        jobId: jobId || undefined,
      });

      setGeneratedContent(res.data.data.content);
      loadData();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell flex min-h-screen flex-col">
      <Sidebar />

      <div className="min-w-0 flex-1 overflow-auto p-4 sm:p-6">
        <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-xl font-bold">AI Cover Letter Generator</h2>

          <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5"
            >
              <h3 className="mb-3 text-sm font-semibold">Input</h3>

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Related Job
                  </label>
                  <select
                    value={jobId}
                    onChange={(e) => setJobId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="">No linked job</option>
                    {jobs.map((job) => (
                      <option key={job._id || job.id} value={job._id || job.id}>
                        {job.role} at {job.company}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Job Description
                  </label>

                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    required
                    className="h-28 w-full resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Skills
                  </label>

                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="React, TypeScript, Node.js"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Tone
                  </label>

                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="professional">Professional</option>
                    <option value="enthusiastic">Enthusiastic</option>
                    <option value="concise">Concise</option>
                  </select>
                </div>

                <button className="w-full rounded-xl bg-[#191919] py-2 text-sm font-medium text-white transition-colors hover:bg-[#2d2d2b]">
                  {loading ? "Generating..." : "Generate"}
                </button>
              </div>
            </form>

            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
              <h3 className="mb-3 text-sm font-semibold">Output</h3>

              <div className="h-48 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                {generatedContent || "Generated cover letter will appear here."}
              </div>
            </div>
          </div>

          <h3 className="mb-3 text-sm font-semibold">Previous Letters</h3>

          <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
            <table className="w-full min-w-[520px] text-sm">
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
                      (item) => (item._id || item.id) === letter.jobId
                    );

                    return (
                      <tr key={letter._id} className="hover:bg-slate-50">
                        <td className="max-w-[320px] truncate px-4 py-3">
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
        </div>
      </div>
    </div>
  );
}
