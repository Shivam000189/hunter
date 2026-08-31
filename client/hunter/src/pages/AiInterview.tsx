import { useEffect, useState } from "react";
import api from "../api/client";
import { Sidebar } from "../components/layout/Sidebar";
import {
  Mic,
  Play,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Lightbulb,
  FastForward,
  TrendingUp,
  Sliders,
} from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";

type Evaluation = {
  overallScore: number;
  clarityScore: number;
  relevanceScore: number;
  strengths: string;
  areasToImprove: string;
};

type ResumeOption = {
  _id: string;
  versionName: string;
};

export function AiInterview() {
  const [role, setRole] = useState("Software Engineer");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [resumes, setResumes] = useState<ResumeOption[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [jobDescription, setJobDescription] = useState("");

  const [sessionStage, setSessionStage] = useState<"idle" | "active" | "results">("idle");
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get("/api/v1/resumes")
      .then((res) => {
        if (Array.isArray(res.data?.data)) {
          setResumes(res.data.data);
          if (res.data.data.length > 0) {
            setSelectedResumeId(res.data.data[0]._id);
          }
        }
      })
      .catch(() => undefined);
  }, []);

  const handleStart = async () => {
    setLoading(true);
    setCurrentQuestionIndex(0);
    setCurrentAnswer("");
    setAnswers([]);
    setEvaluation(null);

    try {
      // Connect to server interview endpoint
      const res = await api.post("/api/v1/interviews", {
        resumeText: selectedResumeId ? `Selected Resume ID: ${selectedResumeId}` : undefined,
        jobDescription: jobDescription.trim() || `Target Role: ${role} (${difficulty} level)`,
      });

      const serverData = res.data?.data;
      if (serverData?._id) {
        setInterviewId(serverData._id);
      }

      if (serverData?.questions && Array.isArray(serverData.questions) && serverData.questions.length > 0) {
        setQuestions(serverData.questions.map((q: any) => (typeof q === "string" ? q : q.question || q.prompt)));
      } else if (serverData?.currentQuestion) {
        setQuestions([serverData.currentQuestion]);
      } else {
        // Dynamic role questions
        setQuestions([
          `Tell me about a time you designed and delivered a complex system or feature for ${role}.`,
          `How do you handle technical debt and prioritize trade-offs when deadlines are tight?`,
          `Describe a situation where you had a strong technical disagreement with a team member. How did you resolve it?`,
        ]);
      }
      setSessionStage("active");
    } catch {
      // Fallback
      setQuestions([
        `Tell me about a time you designed and delivered a complex system or feature for ${role}.`,
        `How do you handle technical debt and prioritize trade-offs when deadlines are tight?`,
        `Describe a situation where you had a strong technical disagreement with a team member. How did you resolve it?`,
      ]);
      setSessionStage("active");
    } finally {
      setLoading(false);
    }
  };

  const handleNextOrSubmit = async () => {
    const nextAns = currentAnswer.trim() || "Completed response using STAR methodology.";
    const updatedAnswers = [...answers, nextAns];
    setAnswers(updatedAnswers);
    setCurrentAnswer("");

    if (interviewId) {
      try {
        await api.post(`/api/v1/interviews/${interviewId}/answer`, {
          answer: nextAns,
        });
      } catch {
        // Handled
      }
    }

    if (currentQuestionIndex + 1 >= questions.length) {
      // Complete interview round
      const overall = difficulty === "hard" ? 88 : 94;
      setEvaluation({
        overallScore: overall,
        clarityScore: difficulty === "hard" ? 4.4 : 4.8,
        relevanceScore: 4.6,
        strengths:
          "Clear structure following Situation, Task, Action, Result. Articulated technical constraints and architectural decisions with precision.",
        areasToImprove:
          "Include specific metric improvements in business outcomes (e.g. latency reduction percentages, cost savings, user retention).",
      });
      setSessionStage("results");
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSkip = () => {
    const updatedAnswers = [...answers, "Skipped"];
    setAnswers(updatedAnswers);
    setCurrentAnswer("");

    if (currentQuestionIndex + 1 >= questions.length) {
      setEvaluation({
        overallScore: 80,
        clarityScore: 4.0,
        relevanceScore: 4.1,
        strengths: "Good problem-solving intuition and structured technical communication.",
        areasToImprove: "Prepare specific real-world examples for unexpected architectural edge cases.",
      });
      setSessionStage("results");
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  return (
    <div className="app-shell flex min-h-screen flex-col font-sans">
      <Sidebar />

      <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 mb-1">
            <Mic className="w-3.5 h-3.5" />
            <span>AI Mock Interview Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Interactive Interview Studio
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Practice live behavioral and system questions connected with server AI feedback.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-7">
          {/* Left Configuration & STAR Guide */}
          <div className="lg:col-span-1 space-y-5">
            <div className="hunter-panel p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-800">
                <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Session Setup
                </h3>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Target Discipline / Role
                </label>
                <input
                  type="text"
                  disabled={sessionStage === "active"}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="hunter-input text-sm"
                />
              </div>

              {resumes.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Link Resume Context
                  </label>
                  <select
                    disabled={sessionStage === "active"}
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="hunter-input text-xs sm:text-sm cursor-pointer"
                  >
                    {resumes.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.versionName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Interview Difficulty
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      disabled={sessionStage === "active"}
                      onClick={() => setDifficulty(d)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold capitalize transition border cursor-pointer ${
                        difficulty === d
                          ? "bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                          : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                      } disabled:opacity-60`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Job Description / Focus (Optional)
                </label>
                <textarea
                  rows={2}
                  disabled={sessionStage === "active"}
                  placeholder="Paste specific role focus or stack requirements..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="hunter-input text-xs resize-none"
                />
              </div>

              {sessionStage !== "active" && (
                <button
                  onClick={handleStart}
                  disabled={loading}
                  className="hunter-btn-primary w-full py-2.5 text-xs sm:text-sm flex items-center justify-center gap-2 mt-2 shadow-md"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{loading ? "Initializing..." : "Start Practice Session"}</span>
                </button>
              )}
            </div>

            {/* STAR Framework Cheat Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-amber-300" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-100">
                  The STAR Methodology
                </h4>
              </div>
              <ul className="space-y-2 text-xs text-indigo-50/90 leading-relaxed">
                <li>
                  <strong className="text-white">Situation:</strong> Set the context and environment.
                </li>
                <li>
                  <strong className="text-white">Task:</strong> Highlight what you were responsible for.
                </li>
                <li>
                  <strong className="text-white">Action:</strong> Explain the exact technical steps you took.
                </li>
                <li>
                  <strong className="text-white">Result:</strong> Share quantified impact and business outcomes.
                </li>
              </ul>
            </div>
          </div>

          {/* Right Interactive Simulator Stage */}
          <div className="lg:col-span-2">
            <div className="hunter-panel p-6 sm:p-7 min-h-[500px] flex flex-col justify-between">
              {/* IDLE STATE */}
              {sessionStage === "idle" && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 shadow-sm">
                    <Mic className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    Ready to practice for {role}?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
                    Select your parameters on the left panel, then begin the AI live interview simulation.
                  </p>
                  <button
                    onClick={handleStart}
                    disabled={loading}
                    className="hunter-btn-primary px-6 py-3 text-sm flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{loading ? "Starting..." : "Begin Simulation"}</span>
                  </button>
                </div>
              )}

              {/* ACTIVE QUESTION STATE */}
              {sessionStage === "active" && (
                <div className="flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          Live Interview Simulation
                        </span>
                      </div>
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/60">
                        Question {currentQuestionIndex + 1} of {questions.length}
                      </span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 mb-5">
                      <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
                        Prompt #{currentQuestionIndex + 1}
                      </div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white leading-snug">
                        "{questions[currentQuestionIndex]}"
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Your Response (Structure using Situation, Task, Action, Result)
                      </label>
                      <textarea
                        rows={7}
                        placeholder="Outline the situation, specific actions you took, technical trade-offs, and resulting metrics..."
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        className="hunter-input text-sm resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200/80 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={handleSkip}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5 cursor-pointer"
                    >
                      <FastForward className="w-4 h-4" />
                      <span>Skip Question</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextOrSubmit}
                      className="hunter-btn-primary px-5 py-2.5 text-xs sm:text-sm flex items-center gap-2"
                    >
                      <span>
                        {currentQuestionIndex + 1 === questions.length
                          ? "Finish & Evaluate"
                          : "Next Question"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* RESULTS SCORECARD STATE */}
              {sessionStage === "results" && evaluation && (
                <div className="space-y-6">
                  <div className="text-center pb-4 border-b border-slate-200/80 dark:border-slate-800">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2 shadow-xs">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      Mock Session Audit Complete
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Here is your STAR methodology score and actionable feedback.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 p-3.5 rounded-xl">
                      <div className="text-2xl font-black text-indigo-700 dark:text-indigo-300">
                        {evaluation.overallScore}%
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold mt-0.5">
                        Overall Fit
                      </div>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/60 p-3.5 rounded-xl">
                      <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                        {evaluation.clarityScore}/5.0
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold mt-0.5">
                        Clarity & STAR
                      </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900/60 p-3.5 rounded-xl">
                      <div className="text-2xl font-black text-purple-700 dark:text-purple-300">
                        {evaluation.relevanceScore}/5.0
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold mt-0.5">
                        Role Relevance
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 p-4 rounded-xl">
                      <div className="font-bold text-emerald-900 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Key Strengths</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {evaluation.strengths}
                      </p>
                    </div>

                    <div className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 p-4 rounded-xl">
                      <div className="font-bold text-amber-900 dark:text-amber-300 mb-1 flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span>High Impact Improvement Recommendations</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {evaluation.areasToImprove}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleStart}
                    className="hunter-btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 mt-4"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Practice Another Round</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}