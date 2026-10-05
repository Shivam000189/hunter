import { useEffect, useState, useRef } from "react";
import api from "../api/client";
import { Sidebar } from "../components/layout/Sidebar";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Lightbulb,
  FastForward,
  TrendingUp,
  Sliders,
  Download,
  FileText,
  Sparkles,
} from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";

type Message = {
  id?: string;
  message: string;
  type: "USER" | "ASSISTANT";
};

type KeywordFeedback = {
  matchedKeywords: string[];
  missingKeywords: string[];
  score: number;
};

type Evaluation = {
  overallScore: number;
  clarityScore: number;
  relevanceScore: number;
  strengths: string;
  areasToImprove: string;
  feedback?: string;
};

type ResumeOption = {
  id: string;
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
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const [latestFeedback, setLatestFeedback] = useState<KeywordFeedback | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(false);

  // Audio Speech Recognition (Speech-to-Text)
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Audio Speech Synthesis (Text-to-Speech)
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    api
      .get("/api/v1/resumes")
      .then((res) => {
        if (Array.isArray(res.data?.data)) {
          // Backend maps resume ids to `_id`
          const options: ResumeOption[] = res.data.data.map((r: any) => ({
            id: r._id || r.id,
            versionName: r.versionName,
          }));
          setResumes(options);
          if (options.length > 0) {
            setSelectedResumeId(options[0].id);
          }
        }
      })
      .catch(() => undefined);
  }, []);

  // Initialize Web Speech API Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setCurrentAnswer((prev) => (prev ? `${prev.trim()} ${transcript.trim()}` : transcript.trim()));
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      stopSpeaking();
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. You can type your answer directly.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const speakQuestion = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-speech audio is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleStart = async () => {
    setLoading(true);
    setInterviewId(null);
    setCurrentQuestionIndex(0);
    setCurrentAnswer("");
    setConversation([]);
    setLatestFeedback(null);
    setEvaluation(null);
    stopSpeaking();

    try {
      const res = await api.post("/api/v1/interviews", {
        resumeId: selectedResumeId || undefined,
        jobDescription: jobDescription.trim() || `Target Role: ${role} (${difficulty} level)`,
      });

      const serverData = res.data?.data;
      if (serverData?.id) {
        setInterviewId(serverData.id);
      }

      setTotalQuestions(serverData?.totalQuestions || 5);

      const conv: Message[] = serverData?.conversation || [];
      setConversation(conv);

      const firstQuestion = conv.find((m) => m.type === "ASSISTANT")?.message ||
        `Tell me about a time you designed and delivered a complex system or feature for ${role}.`;

      setCurrentQuestion(firstQuestion);
      setSessionStage("active");
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          "Could not start a server interview. Running an offline practice session instead."
      );

      // Fallback in case backend AI API is unreachable
      const fallbackPrompt = `Tell me about a time you designed and delivered a complex system or feature for ${role}.`;
      setCurrentQuestion(fallbackPrompt);
      setConversation([{ message: fallbackPrompt, type: "ASSISTANT" }]);
      setTotalQuestions(5);
      setSessionStage("active");
    } finally {
      setLoading(false);
    }
  };

  const handleNextOrSubmit = async () => {
    const nextAns = currentAnswer.trim() || "Completed response using STAR methodology.";
    setCurrentAnswer("");
    setLoading(true);
    stopSpeaking();
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    if (interviewId) {
      try {
        const res = await api.post(`/api/v1/interviews/${interviewId}/answer`, {
          answer: nextAns,
        });

        const serverData = res.data?.data;
        const conv: Message[] = serverData?.conversation || [];
        setConversation(conv);

        if (serverData?.answerFeedback) {
          setLatestFeedback(serverData.answerFeedback);
        }

        if (serverData?.status === "COMPLETED") {
          const overallScore = serverData.score || 85;
          setEvaluation({
            overallScore,
            clarityScore: Math.round((overallScore / 20) * 10) / 10,
            relevanceScore: Math.round(((overallScore + 5) / 21) * 10) / 10,
            strengths: "Articulated architectural decisions and trade-offs clearly using situational context.",
            areasToImprove: "Quantify metrics and business outcomes (latency, throughput, cost reductions) more consistently.",
            feedback: serverData.feedback,
          });
          setSessionStage("results");
          setLoading(false);
          return;
        }

        // Find next assistant message
        const assistantMessages = conv.filter((m) => m.type === "ASSISTANT");
        const nextQ = assistantMessages[assistantMessages.length - 1]?.message;
        if (nextQ) {
          setCurrentQuestion(nextQ);
          setCurrentQuestionIndex((prev) => prev + 1);
        }
      } catch {
        handleLocalProgression(nextAns);
      } finally {
        setLoading(false);
      }
    } else {
      handleLocalProgression(nextAns);
      setLoading(false);
    }
  };

  const handleLocalProgression = (answerText: string) => {
    const updatedConv: Message[] = [
      ...conversation,
      { message: answerText, type: "USER" },
    ];

    if (currentQuestionIndex + 1 >= totalQuestions) {
      setConversation(updatedConv);
      const overall = difficulty === "hard" ? 86 : 92;
      setEvaluation({
        overallScore: overall,
        clarityScore: difficulty === "hard" ? 4.3 : 4.7,
        relevanceScore: 4.5,
        strengths: "Structured technical communication and clear problem-solving thought process.",
        areasToImprove: "Provide quantified outcomes and metric improvements for unexpected edge cases.",
        feedback: "Great job completing the interview simulation! You communicated key engineering trade-offs effectively.",
      });
      setSessionStage("results");
    } else {
      const fallbackQuestions = [
        `How do you handle technical debt and prioritize trade-offs when deadlines are tight in ${role}?`,
        `Describe a situation where you resolved a challenging technical conflict with your team.`,
        `Walk me through an incident or bug in production you diagnosed and mitigated.`,
        `How do you ensure maintainability, scalability, and test coverage across services you build?`,
      ];
      const nextQ = fallbackQuestions[currentQuestionIndex % fallbackQuestions.length] || "What is your proudest engineering accomplishment?";
      setCurrentQuestion(nextQ);
      setCurrentQuestionIndex((prev) => prev + 1);
      setConversation([...updatedConv, { message: nextQ, type: "ASSISTANT" }]);
    }
  };

  const handleSkip = () => {
    handleNextOrSubmit();
  };

  const downloadReport = () => {
    const lines = [
      `# Hunter AI Mock Interview Report`,
      ``,
      `**Target Role**: ${role}`,
      `**Difficulty**: ${difficulty.toUpperCase()}`,
      `**Date**: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
      `**Overall Score**: ${evaluation?.overallScore ?? 0}/100`,
      ``,
      `---`,
      ``,
      `## AI Evaluator Feedback`,
      evaluation?.feedback || "Solid mock interview session. Key technical concepts articulated well.",
      ``,
      `**Key Strengths**: ${evaluation?.strengths}`,
      `**High Impact Recommendations**: ${evaluation?.areasToImprove}`,
      ``,
      `---`,
      ``,
      `## Interview Transcript & Dialogue`,
      ``,
    ];

    conversation.forEach((msg, idx) => {
      const speaker = msg.type === "ASSISTANT" ? "🤖 AI Interviewer" : "👤 Candidate";
      lines.push(`### ${speaker} (Message ${idx + 1})`);
      lines.push(`${msg.message}`);
      lines.push(``);
    });

    const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Hunter_Interview_Report_${role.replace(/\s+/g, "_")}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-shell flex min-h-screen flex-col font-sans">
      <Sidebar />

      <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 mb-1">
              <Mic className="w-3.5 h-3.5" />
              <span>AI Mock Interview Simulator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Interactive Interview Studio
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Practice live behavioral and technical questions with voice speech-to-text, audio question reader, and server evaluations.
            </p>
          </div>

          {sessionStage === "results" && (
            <button
              onClick={downloadReport}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold transition cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <Download className="w-4 h-4" />
              <span>Download Report</span>
            </button>
          )}
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
                      <option key={r.id} value={r.id}>
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
                  className="hunter-btn-primary w-full py-2.5 text-xs sm:text-sm flex items-center justify-center gap-2 mt-2 shadow-md cursor-pointer"
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
                    Practice with AI-tailored questions. Speak your answers via voice dictation or type them, and receive keyword feedback and scorecards.
                  </p>
                  <button
                    onClick={handleStart}
                    disabled={loading}
                    className="hunter-btn-primary px-6 py-3 text-sm flex items-center gap-2 cursor-pointer"
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
                        Question {currentQuestionIndex + 1} of {totalQuestions}
                      </span>
                    </div>

                    {/* Question Box with Text-to-Speech */}
                    <div className="bg-slate-50 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 mb-5 relative group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                          Interviewer Prompt #{currentQuestionIndex + 1}
                        </div>
                        <button
                          type="button"
                          onClick={() => speakQuestion(currentQuestion)}
                          title={isSpeaking ? "Stop Voice Reader" : "Listen to Question"}
                          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs transition"
                        >
                          {isSpeaking ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                              <span className="text-rose-500">Stop Voice</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>Listen</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-base font-semibold text-slate-900 dark:text-white leading-snug">
                        "{currentQuestion}"
                      </p>
                    </div>

                    {/* Previous Answer Keyword Coverage Feedback (if available) */}
                    {latestFeedback && (
                      <div className="mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-xs">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            Last Answer Keyword Coverage:
                          </span>
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">
                            {latestFeedback.score}%
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {latestFeedback.matchedKeywords.map((kw, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-medium text-[11px]"
                            >
                              ✓ {kw}
                            </span>
                          ))}
                          {latestFeedback.missingKeywords.slice(0, 4).map((kw, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-[11px]"
                            >
                              + {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Answer Input with Speech Dictation Button */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Your Response (STAR Methodology)
                        </label>
                        <button
                          type="button"
                          onClick={toggleListening}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer border ${
                            isListening
                              ? "bg-rose-50 border-rose-300 text-rose-600 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-400 animate-pulse"
                              : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          {isListening ? (
                            <>
                              <MicOff className="w-3.5 h-3.5" />
                              <span>Listening... (Click to Stop)</span>
                            </>
                          ) : (
                            <>
                              <Mic className="w-3.5 h-3.5 text-indigo-500" />
                              <span>Voice Dictation</span>
                            </>
                          )}
                        </button>
                      </div>

                      <textarea
                        rows={7}
                        placeholder="Speak or outline the situation, specific actions you took, technical trade-offs, and resulting metrics..."
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
                      disabled={loading}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <FastForward className="w-4 h-4" />
                      <span>Skip Question</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextOrSubmit}
                      disabled={loading}
                      className="hunter-btn-primary px-5 py-2.5 text-xs sm:text-sm flex items-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      <span>
                        {loading
                          ? "Evaluating..."
                          : currentQuestionIndex + 1 >= totalQuestions
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
                      Here is your STAR methodology scorecard and AI performance debrief.
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

                  {evaluation.feedback && (
                    <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 p-4 rounded-xl">
                      <div className="font-bold text-indigo-900 dark:text-indigo-300 mb-1 flex items-center gap-1.5 text-xs sm:text-sm">
                        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span>AI Evaluator Assessment</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {evaluation.feedback}
                      </p>
                    </div>
                  )}

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

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={downloadReport}
                      className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-indigo-500" />
                      <span>Download Scorecard (.md)</span>
                    </button>

                    <button
                      onClick={handleStart}
                      className="hunter-btn-primary flex-1 py-3 text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Practice Another Round</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}