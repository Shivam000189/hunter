import {
  type ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import api from "../api/client";
import { Sidebar } from "../components/layout/Sidebar";
import { ResumePreviewModal } from "../components/resume/ResumePreviewModal";
import {
  Upload,
  CheckCircle,
  Eye,
  Headphones,
  Trash2,
  ShieldCheck,
  TrendingUp,
  Award,
  FileText,
} from "lucide-react";

type ResumeItem = {
  _id: string;
  url?: string;
  versionName: string;
  uploadedAt: string;
  usage: number;
  interviews: number;
  offers: number;
  successRate: number;
  fileType?: "PDF" | "DOC" | "DOCX";
  size?: string;
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

const formatDate = (date: string) => {
  try {
    return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(date));
  } catch {
    return date;
  }
};

export function Resume() {
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [versionName, setVersionName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [previewResume, setPreviewResume] = useState<ResumeItem | null>(null);

  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<ResumeFeedback | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [aiLoading, setAiLoading] = useState<"feedback" | "match" | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const bestResumeId = useMemo(() => {
    if (resumes.length === 0) return null;
    return [...resumes].sort((a, b) => {
      if (b.successRate !== a.successRate) return b.successRate - a.successRate;
      if (b.offers !== a.offers) return b.offers - a.offers;
      return b.usage - a.usage;
    })[0]._id;
  }, [resumes]);

  function loadResumes() {
    api
      .get("/api/v1/resumes")
      .then((res) => {
        const nextResumes: ResumeItem[] = res.data.data;
        if (Array.isArray(nextResumes)) {
          setResumes(nextResumes);
        } else {
          setResumes([]);
        }
      })
      .catch(() => {
        setResumes([]);
      });
  }

  useEffect(() => {
    loadResumes();
  }, []);

  const processUploadedFile = async (uploadedFile: File, nameOverride?: string) => {
    const vName = nameOverride || versionName.trim() || uploadedFile.name;

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("versionName", vName);
      await api.post("/api/v1/resumes/upload", formData);
      loadResumes();
    } catch {
      // optimistic fallback
      const ext = (uploadedFile.name.split(".").pop() || "pdf").toUpperCase();
      const cleanFileType = (ext === "DOC" || ext === "DOCX" ? ext : "PDF") as "PDF" | "DOC" | "DOCX";
      const newResume: ResumeItem = {
        _id: String(Date.now()),
        versionName: vName,
        uploadedAt: new Date().toISOString(),
        usage: 0,
        interviews: 0,
        offers: 0,
        successRate: 0,
        fileType: cleanFileType,
        size: `${(uploadedFile.size / 1024).toFixed(0)} KB`,
      };
      setResumes((prev) => [newResume, ...prev]);
    }

    setVersionName("");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const deleteResume = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this resume version?")) {
      setResumes((prev) => prev.filter((r) => r._id !== id));
      try {
        await api.delete(`/api/v1/resumes/${id}`);
      } catch {
        // Handled
      }
    }
  };

  const analyzeResume = async () => {
    if (!resumeText.trim() && !selectedResumeId) {
      alert("Please select a resume version or paste resume text to audit.");
      return;
    }

    setAiLoading("feedback");
    setFeedback(null);

    try {
      const endpoint = selectedResumeId
        ? `/api/v1/resumes/${selectedResumeId}/ats`
        : "/api/v1/ai/resume-feedback";
      const res = await api.post(endpoint, {
        resumeText: resumeText || undefined,
        jobDescription: jobDescription || undefined,
      });

      if (res.data?.data) {
        setFeedback(res.data.data);
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to analyze resume with server AI.");
    } finally {
      setAiLoading(null);
    }
  };

  const scoreMatch = async () => {
    if (!jobDescription.trim()) {
      alert("Please paste target job description requirements to score match.");
      return;
    }

    setAiLoading("match");
    setMatchResult(null);

    try {
      const res = await api.post("/api/v1/ai/resume-match", {
        resumeText: resumeText || undefined,
        jobDescription: jobDescription.trim(),
      });

      if (res.data?.data) {
        setMatchResult(res.data.data);
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to score job match with server AI.");
    } finally {
      setAiLoading(null);
    }
  };

  return (
    <div className="app-shell flex min-h-screen flex-col font-sans">
      <Sidebar />

      <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ATS & Resume Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Resume Versions & ATS Audit
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Track conversion performance across resume variations and optimize keyword match.
            </p>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="hunter-btn-primary flex items-center gap-2 text-sm self-start sm:self-auto"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Resume</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>

        {/* Drag & Drop Upload Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-7 sm:p-9 text-center mb-8 cursor-pointer transition hunter-panel ${
            isDragging
              ? "border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/50"
              : "hover:border-indigo-400 border-slate-300 dark:border-slate-800"
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1">
            Drop your resume file here or click to browse
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Supports PDF, DOC, and DOCX files up to 10MB.
          </p>
        </div>

        {/* Uploaded Versions Grid */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Your Uploaded Versions ({resumes.length})
            </h3>
          </div>

          {resumes.length === 0 ? (
            <div className="p-12 text-center text-slate-400 hunter-panel border border-dashed rounded-2xl">
              <FileText className="w-10 h-10 mx-auto mb-2 opacity-40 text-indigo-500" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No resumes uploaded yet
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Upload your first resume version above to start tracking conversion analytics and ATS scoring.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {resumes.map((resume) => {
                const isBest = resume._id === bestResumeId && resume.usage > 0;
                const fType = resume.fileType || (resume.versionName.endsWith(".docx") ? "DOCX" : "PDF");

                return (
                  <div
                    key={resume._id}
                    className="hunter-card p-5 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                            fType === "PDF"
                              ? "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
                              : "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
                          }`}
                        >
                          {fType}
                        </div>

                        {isBest && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            <span>Best Performing</span>
                          </span>
                        )}
                      </div>

                      <h4
                        className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 mb-1"
                        title={resume.versionName}
                      >
                        {resume.versionName}
                      </h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
                        {resume.size || "Stored on server"} • Uploaded {formatDate(resume.uploadedAt)}
                      </p>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                        <div className="bg-slate-50 dark:bg-slate-900/80 p-2.5 rounded-xl">
                          <span className="text-slate-400 text-[10px]">Usage</span>
                          <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                            {resume.usage || 0} times
                          </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/80 p-2.5 rounded-xl">
                          <span className="text-slate-400 text-[10px]">Interviews</span>
                          <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                            {resume.interviews || 0}
                          </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/80 p-2.5 rounded-xl">
                          <span className="text-slate-400 text-[10px]">Offers</span>
                          <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                            {resume.offers || 0}
                          </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/80 p-2.5 rounded-xl">
                          <span className="text-slate-400 text-[10px]">Success Rate</span>
                          <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                            {resume.successRate || 0}%
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-slate-200/80 dark:border-slate-800">
                      <button
                        onClick={() => setPreviewResume(resume)}
                        className="flex-1 py-2 px-3 hunter-btn-ghost text-xs flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>

                      <button
                        onClick={() => deleteResume(resume._id)}
                        className="p-2 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition cursor-pointer"
                        title="Delete version"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* AI Resume Intelligence Suite */}
        <div className="grid lg:grid-cols-2 gap-7 mb-10">
          {/* Left Form */}
          <div className="hunter-panel p-6 sm:p-7 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <Headphones className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                AI Resume & Job Match Audit
              </h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Saved Resume Version
              </label>
              <select
                value={selectedResumeId || ""}
                onChange={(e) => setSelectedResumeId(e.target.value || null)}
                className="hunter-input text-sm cursor-pointer"
              >
                <option value="">Analyze pasted text directly</option>
                {resumes.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.versionName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Resume Content / Summary Text
              </label>
              <textarea
                rows={4}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste key resume experience, skills, and summary here..."
                className="hunter-input text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Job Description (for Match Scoring)
              </label>
              <textarea
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste target role requirements here..."
                className="hunter-input text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={analyzeResume}
                disabled={aiLoading !== null}
                className="hunter-btn-primary py-2.5 text-xs sm:text-sm flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{aiLoading === "feedback" ? "Auditing..." : "ATS Audit"}</span>
              </button>

              <button
                type="button"
                onClick={scoreMatch}
                disabled={aiLoading !== null}
                className="hunter-btn-ghost py-2.5 text-xs sm:text-sm flex items-center justify-center gap-1.5"
              >
                <TrendingUp className="w-4 h-4" />
                <span>{aiLoading === "match" ? "Scoring..." : "Score Match"}</span>
              </button>
            </div>
          </div>

          {/* Right Output Panel */}
          <div className="hunter-panel p-6 sm:p-7 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-200/80 dark:border-slate-800">
              Audit Insights & Recommendations
            </h3>

            {feedback ? (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-indigo-50 dark:bg-indigo-950/60 p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-900/60">
                    <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
                      Overall Score
                    </span>
                    <div className="text-2xl font-black text-indigo-900 dark:text-white mt-0.5">
                      {feedback.score}/100
                    </div>
                  </div>

                  <div className="bg-emerald-50 dark:bg-emerald-950/60 p-3.5 rounded-xl border border-emerald-100 dark:border-emerald-900/60">
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                      ATS Pass Rate
                    </span>
                    <div className="text-2xl font-black text-emerald-900 dark:text-white mt-0.5">
                      {feedback.atsScore}%
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  {feedback.strengths && feedback.strengths.length > 0 && (
                    <div>
                      <h4 className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider text-[10px] mb-1.5">
                        Key Strengths
                      </h4>
                      <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                        {feedback.strengths.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {feedback.missingKeywords && feedback.missingKeywords.length > 0 && (
                    <div>
                      <h4 className="font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider text-[10px] mb-1.5">
                        Missing Keywords
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {feedback.missingKeywords.map((k, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[11px]"
                          >
                            + {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {feedback.suggestions && feedback.suggestions.length > 0 && (
                    <div>
                      <h4 className="font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider text-[10px] mb-1.5">
                        Suggestions
                      </h4>
                      <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                        {feedback.suggestions.map((sug, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-indigo-500 font-bold">•</span>
                            <span>{sug}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : matchResult ? (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-indigo-600 text-white p-4 rounded-xl text-center shadow-md">
                  <div className="text-xs text-indigo-100 font-semibold">Job Match Compatibility</div>
                  <div className="text-3xl font-black mt-1">{matchResult.matchScore}%</div>
                </div>

                {matchResult.matchedKeywords && matchResult.matchedKeywords.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-2">
                      Matched Skill Signals
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {matchResult.matchedKeywords.map((k) => (
                        <span
                          key={k}
                          className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold"
                        >
                          ✓ {k}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {matchResult.missingSkills && matchResult.missingSkills.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-bold text-rose-600 uppercase tracking-wider mb-2">
                      Missing Target Skills
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {matchResult.missingSkills.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-semibold"
                        >
                          ! {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-60 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <ShieldCheck className="w-10 h-10 mb-2 opacity-40 text-indigo-500" />
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Ready to audit resume
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
                  Select a resume version or paste text, then click ATS Audit or Score Match.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ATS Best Practices Banner */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Headphones className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              ATS Resume Best Practices
            </h4>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="hunter-panel p-4 bg-white/80 dark:bg-slate-900/80">
              <div className="font-bold text-xs text-slate-900 dark:text-white mb-1">
                📏 Single Column Layout
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Avoid tables, text boxes, and complex multi-column wraps to pass ATS parsers cleanly.
              </p>
            </div>
            <div className="hunter-panel p-4 bg-white/80 dark:bg-slate-900/80">
              <div className="font-bold text-xs text-slate-900 dark:text-white mb-1">
                📊 Quantified Metrics
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Replace generic duties with impact: "Reduced bundle latency by 42% using code splitting".
              </p>
            </div>
            <div className="hunter-panel p-4 bg-white/80 dark:bg-slate-900/80">
              <div className="font-bold text-xs text-slate-900 dark:text-white mb-1">
                🎯 Keyword Density
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Ensure 70%+ of the key qualifications and stack requirements match each target posting.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Resume Preview Modal */}
      <ResumePreviewModal
        resume={previewResume}
        onClose={() => setPreviewResume(null)}
      />
    </div>
  );
}
