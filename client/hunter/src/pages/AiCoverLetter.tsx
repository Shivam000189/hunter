import { useEffect, useState } from "react";
import api from "../api/client";
import { Sidebar } from "../components/layout/Sidebar";
import {
  FileText,
  Mail,
  Headphones,
  Copy,
  Check,
  Download,
  RotateCcw,
  Building2,
  Briefcase,
  History,
  Sliders,
  CheckCircle2,
} from "lucide-react";

type Tone = "professional" | "confident" | "enthusiastic" | "technical";
type Mode = "cover-letter" | "cold-email";

type SavedLetter = {
  id: string;
  type: string;
  company: string;
  role: string;
  date: string;
  content: string;
};

export function AiCoverLetter() {
  const [mode, setMode] = useState<Mode>("cover-letter");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [jobDescription, setJobDescription] = useState("");
  const [recipient, setRecipient] = useState("");

  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<SavedLetter[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    const savedComp = sessionStorage.getItem("hunter-cl-company");
    const savedRole = sessionStorage.getItem("hunter-cl-role");
    if (savedComp) {
      setCompany(savedComp);
      sessionStorage.removeItem("hunter-cl-company");
    }
    if (savedRole) {
      setRole(savedRole);
      sessionStorage.removeItem("hunter-cl-role");
    }

    // Fetch saved letters from server
    api
      .get("/api/v1/ai/cover-letters")
      .then((res) => {
        if (Array.isArray(res.data?.data)) {
          const apiLetters = res.data.data.map((l: any) => ({
            id: l._id || l.id || String(Date.now()),
            type: l.type === "cold-email" ? "Cold Email" : "Cover Letter",
            company: l.company || "Target Company",
            role: l.role || "Target Role",
            date: l.createdAt ? new Date(l.createdAt).toLocaleDateString() : "Recent",
            content: l.content || l.coverLetter || l.email || "",
          }));
          setHistory(apiLetters);
        }
      })
      .catch(() => {
        setHistory([]);
      });
  }, []);

  const handleGenerate = async () => {
    if (!company.trim() || !role.trim()) {
      alert("Please specify the target company and role position.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = mode === "cover-letter" ? "/api/v1/ai/cover-letter" : "/api/v1/ai/cold-email";
      const payload = {
        company: company.trim(),
        role: role.trim(),
        skills: skills.trim() ? skills.split(",").map((s) => s.trim()) : undefined,
        tone,
        jobDescription: jobDescription.trim() || undefined,
        recipient: recipient.trim() || undefined,
      };

      const res = await api.post(endpoint, payload);
      const generatedText = res.data?.data?.coverLetter || res.data?.data?.email || res.data?.data?.content;

      if (generatedText) {
        setOutput(generatedText);
        setHistory((prev) => [
          {
            id: String(Date.now()),
            type: mode === "cover-letter" ? "Cover Letter" : "Cold Email",
            company,
            role,
            date: "Just now",
            content: generatedText,
          },
          ...prev,
        ]);
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to generate document with AI server.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${company.toLowerCase()}-${role.toLowerCase()}-${mode}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-shell flex min-h-screen flex-col font-sans">
      <Sidebar />

      <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 mb-1">
              <Headphones className="w-3.5 h-3.5" />
              <span>AI Tailored Outreach Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              AI Cover Letter & Cold Email Studio
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Generate role-specific cover letters and personalized recruiter cold emails in seconds.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="hunter-panel p-1 inline-flex rounded-xl gap-1 self-start sm:self-auto">
            <button
              onClick={() => setMode("cover-letter")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                mode === "cover-letter"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Cover Letter</span>
            </button>

            <button
              onClick={() => setMode("cold-email")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                mode === "cold-email"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Cold Email</span>
            </button>
          </div>
        </div>

        {/* 2-Column Generator Workspace */}
        <div className="grid lg:grid-cols-12 gap-7">
          {/* Left Form: Parameters */}
          <div className="lg:col-span-5 space-y-5">
            <div className="hunter-panel p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Application Parameters
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Server History ({history.length})</span>
                </button>
              </div>

              {/* Target Company */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Target Company *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google, Stripe, Linear"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="hunter-input pl-10 text-sm"
                  />
                </div>
              </div>

              {/* Target Role */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Job Position / Role *
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Frontend Engineer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="hunter-input pl-10 text-sm"
                  />
                </div>
              </div>

              {mode === "cold-email" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Recipient Name / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Jenkins (Head of Engineering)"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="hunter-input text-sm"
                  />
                </div>
              )}

              {/* Key Highlights / Stack */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Key Skills & Highlights to Feature
                </label>
                <input
                  type="text"
                  placeholder="e.g. React 19, TypeScript, Distributed Systems"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="hunter-input text-sm"
                />
              </div>

              {/* Tone Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Writing Tone
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["professional", "confident", "enthusiastic", "technical"] as Tone[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTone(t)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition border cursor-pointer ${
                        tone === t
                          ? "bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                          : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Job Description (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Job Description / Requirements (Optional Context)
                </label>
                <textarea
                  rows={3}
                  placeholder="Paste snippet of requirements or mission to tailor keyword density..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="hunter-input text-sm resize-none"
                />
              </div>

              {/* Generate Button */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="hunter-btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 shadow-md"
              >
                <Headphones className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                <span>{loading ? "Generating Output..." : `Generate ${mode === "cover-letter" ? "Cover Letter" : "Cold Email"}`}</span>
              </button>
            </div>

            {/* History Drawer / Panel */}
            {isHistoryOpen && (
              <div className="hunter-panel p-5 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Saved Server Documents ({history.length})
                  </h4>
                  <button
                    onClick={() => setIsHistoryOpen(false)}
                    className="text-xs text-slate-400 hover:text-slate-700"
                  >
                    Close
                  </button>
                </div>

                {history.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No documents saved on server yet.</p>
                ) : (
                  <div className="space-y-2.5 max-h-60 overflow-y-auto">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setOutput(item.content);
                          setCompany(item.company);
                          setRole(item.role);
                        }}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-900/50 cursor-pointer transition"
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                          <span>{item.company}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{item.date}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">{item.role}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Live Document Preview */}
          <div className="lg:col-span-7">
            <div className="hunter-panel p-6 sm:p-7 min-h-[560px] flex flex-col justify-between">
              <div>
                {/* Document Header Controls */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Document Workspace
                    </span>
                    {output && (
                      <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        {output.split(/\s+/).filter(Boolean).length} words
                      </span>
                    )}
                  </div>

                  {output && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopy}
                        className="hunter-btn-ghost py-1.5 px-3 text-xs flex items-center gap-1.5"
                        title="Copy to clipboard"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleDownload}
                        className="hunter-btn-ghost py-1.5 px-3 text-xs flex items-center gap-1.5"
                        title="Download .txt"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export</span>
                      </button>

                      <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="hunter-btn-ghost py-1.5 px-3 text-xs flex items-center gap-1.5"
                        title="Regenerate variant"
                      >
                        <RotateCcw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                        <span>Regenerate</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Document Paper Content */}
                {output ? (
                  <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-7 min-h-[420px] font-sans text-sm text-slate-900 dark:text-slate-100 leading-relaxed whitespace-pre-line shadow-inner animate-fade-in">
                    {output}
                  </div>
                ) : (
                  <div className="h-[420px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center text-center p-8 text-slate-400">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                      <Headphones className="w-7 h-7 opacity-80" />
                    </div>
                    <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
                      No document generated yet
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm">
                      Fill in your target company and role parameters on the left, then click Generate to craft your tailored outreach with server AI.
                    </p>
                  </div>
                )}
              </div>

              {output && (
                <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Formatted & optimized for ATS readability</span>
                  </span>
                  <span>Tone: <strong className="capitalize text-slate-700 dark:text-slate-300">{tone}</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
