import { useEffect, useRef, useState } from "react";
import api from "../api/client";
import { Sidebar } from "../components/layout/Sidebar";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  ArrowRight,
  FastForward,
  RefreshCw,
  Download,
  Sparkles,
  CheckCircle2,
  PhoneOff,
  Keyboard,
  Calendar,
  FileText,
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
  readiness: string | null;
  feedback: string;
};

type ResumeOption = {
  id: string;
  versionName: string;
};

type OrbState = "speaking" | "listening" | "thinking" | "idle";

const formatClock = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
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
  const [typedMode, setTypedMode] = useState(false);

  // Call-style UI state
  const [elapsed, setElapsed] = useState(0);
  const [interim, setInterim] = useState("");
  const [speakerOn, setSpeakerOn] = useState(true);

  // Speech recognition (speech-to-text)
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Speech synthesis (text-to-speech)
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speakerOnRef = useRef(true);

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

  // Elapsed call timer
  useEffect(() => {
    if (sessionStage !== "active") return;

    setElapsed(0);
    const interval = window.setInterval(() => setElapsed((prev) => prev + 1), 1000);
    return () => window.clearInterval(interval);
  }, [sessionStage]);

  // Web Speech API Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let finalText = "";
        let interimText = "";

        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalText += result[0].transcript;
          } else {
            interimText += result[0].transcript;
          }
        }

        if (finalText) {
          setCurrentAnswer((prev) =>
            prev ? `${prev.trim()} ${finalText.trim()}` : finalText.trim()
          );
        }
        setInterim(interimText);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setInterim("");
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterim("");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-read each new question aloud, like a live interviewer
  useEffect(() => {
    if (sessionStage === "active" && currentQuestion) {
      speakQuestion(currentQuestion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, sessionStage]);

  const orbState: OrbState = loading
    ? "thinking"
    : isSpeaking
    ? "speaking"
    : isListening
    ? "listening"
    : "idle";

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. You can type your answer instead.");
      setTypedMode(true);
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
      return;
    }

    if (!speakerOnRef.current) {
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

  const toggleSpeaker = () => {
    const next = !speakerOn;
    speakerOnRef.current = next;
    setSpeakerOn(next);

    if (!next) {
      stopSpeaking();
    } else if (sessionStage === "active" && currentQuestion) {
      // Re-read the current question when the speaker is turned back on
      window.setTimeout(() => speakQuestion(currentQuestion), 0);
    }
  };

  const handleStart = async () => {
    setLoading(true);
    setInterviewId(null);
    setCurrentQuestionIndex(0);
    setCurrentAnswer("");
    setInterim("");
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
    setInterim("");
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
          setEvaluation({
            overallScore: serverData.score || 0,
            readiness: serverData.readiness || null,
            feedback: serverData.feedback || "Interview completed.",
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
      setEvaluation({
        overallScore: 0,
        readiness: null,
        feedback: "Offline practice session completed. Server evaluation was unavailable, so no score was recorded.",
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

  const endSession = () => {
    if (window.confirm("End the interview now? Your answers so far will not be evaluated.")) {
      stopSpeaking();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      setSessionStage("idle");
      setInterviewId(null);
    }
  };

  const downloadReport = () => {
    const lines = [
      `# Hunter AI Mock Interview Report`,
      ``,
      `**Target Role**: ${role}`,
      `**Difficulty**: ${difficulty.toUpperCase()}`,
      `**Date**: ${new Date().toLocaleString()}`,
      `**Overall Score**: ${evaluation?.overallScore ?? 0}/100`,
      `**Readiness**: ${evaluation?.readiness || "Not evaluated"}`,
      ``,
      `---`,
      ``,
      `## AI Evaluator Feedback`,
      evaluation?.feedback || "Solid mock interview session. Key technical concepts articulated well.",
      ``,
      `---`,
      ``,
      `## Interview Transcript`,
      ``,
    ];

    conversation.forEach((msg, idx) => {
      const speaker = msg.type === "ASSISTANT" ? "AI Interviewer" : "Candidate";
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

  /* ── Interviewer orb ─────────────────────────────────────────── */

  const orbRing =
    orbState === "speaking"
      ? "bg-emerald-400/30 animate-ping"
      : orbState === "listening"
      ? "bg-rose-400/30 animate-ping"
      : orbState === "thinking"
      ? "bg-amber-300/25 animate-pulse"
      : "bg-indigo-400/15";

  const orbCore =
    orbState === "speaking"
      ? "from-emerald-400 to-teal-600"
      : orbState === "listening"
      ? "from-rose-400 to-rose-600"
      : orbState === "thinking"
      ? "from-amber-300 to-amber-500"
      : "from-indigo-500 to-purple-600";

  const orbLabel =
    orbState === "speaking"
      ? "Interviewer is speaking…"
      : orbState === "listening"
      ? "Listening to you…"
      : orbState === "thinking"
      ? "Evaluating your answer…"
      : "Ready when you are";

  /* ── Setup screen ────────────────────────────────────────────── */

  if (sessionStage === "idle") {
    return (
      <div className="app-shell flex min-h-screen flex-col font-sans">
        <Sidebar />

        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8 max-w-2xl mx-auto w-full">
          <div className="hunter-panel p-7 sm:p-9 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-sm">
                <Mic className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                AI Mock Interview
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                A live one-on-one with your AI interviewer. Questions are spoken
                aloud — answer by voice or text, one question at a time.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Target Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="hunter-input text-sm"
                />
              </div>

              {resumes.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    <span className="inline-flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      Resume the interviewer will use
                    </span>
                  </label>
                  <select
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
                  Job Description (optional — improves question quality)
                </label>
                <textarea
                  rows={3}
                  placeholder="Paste the role's requirements or focus areas…"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="hunter-input text-xs resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Intensity
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className={`py-2 px-2 rounded-lg text-xs font-bold capitalize transition border cursor-pointer ${
                        difficulty === d
                          ? "bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                          : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <span>
                5 questions, roughly 10–15 minutes. Your voice is transcribed
                live — speak naturally, then submit each answer when you're done.
              </span>
            </div>

            <button
              onClick={handleStart}
              disabled={loading}
              className="hunter-btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{loading ? "Connecting…" : "Start Interview"}</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  /* ── Live call stage ─────────────────────────────────────────── */

  if (sessionStage === "active") {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white font-sans">
        {/* Call header */}
        <header className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-white/90 truncate">
              AI Interview — {role}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalQuestions }).map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx < currentQuestionIndex
                      ? "w-4 bg-emerald-400"
                      : idx === currentQuestionIndex
                      ? "w-6 bg-white"
                      : "w-4 bg-white/20"
                  }`}
                />
              ))}
            </div>

            <span className="text-xs font-mono font-bold text-white/80 tabular-nums">
              {formatClock(elapsed)}
            </span>

            <button
              type="button"
              onClick={endSession}
              title="End interview"
              className="p-2 rounded-xl text-white/60 hover:text-rose-300 hover:bg-rose-500/10 transition cursor-pointer"
            >
              <PhoneOff className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Stage */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 relative">
          {/* Interviewer orb */}
          <div className="relative flex items-center justify-center mb-8">
            <div className={`absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full ${orbRing}`} />
            <div className={`absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full blur-2xl ${orbRing}`} />
            <div
              className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br ${orbCore} shadow-2xl transition-all duration-500 ${
                orbState === "speaking" ? "scale-105" : ""
              }`}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-white/10" />
              <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-white/90" />
            </div>
          </div>

          {/* State label */}
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 mb-4">
            {orbLabel}
          </p>

          {/* Question text */}
          <div className="max-w-2xl w-full text-center mb-6 min-h-[5rem] flex items-center justify-center">
            {loading ? (
              <p className="text-sm text-white/50">One moment…</p>
            ) : (
              <p className="text-lg sm:text-2xl font-semibold leading-snug text-white">
                "{currentQuestion}"
              </p>
            )}
          </div>

          {/* Live transcription caption */}
          {isListening && interim && (
            <p className="max-w-2xl text-center text-sm italic text-white/60 mb-4 line-clamp-2">
              "{interim}"
            </p>
          )}

          {/* Keyword coverage of previous answer */}
          {latestFeedback && !loading && (
            <div className="max-w-2xl w-full mb-6 p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-white/70">Last answer keyword coverage</span>
                <span className="font-bold text-indigo-300">{latestFeedback.score}%</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {latestFeedback.matchedKeywords.slice(0, 6).map((kw, i) => (
                  <span
                    key={`m-${i}`}
                    className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-400/20 font-medium text-[11px]"
                  >
                    ✓ {kw}
                  </span>
                ))}
                {latestFeedback.missingKeywords.slice(0, 4).map((kw, i) => (
                  <span
                    key={`k-${i}`}
                    className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-400/20 text-[11px]"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Typed answer fallback */}
          <div className="max-w-2xl w-full">
            {typedMode ? (
              <textarea
                rows={4}
                autoFocus
                placeholder="Type your answer… (voice dictation still works while this is open)"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-sm text-white placeholder-white/40 resize-none focus:outline-none focus:border-indigo-400/60"
              />
            ) : (
              <button
                type="button"
                onClick={() => setTypedMode(true)}
                className="mx-auto flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-white/80 transition cursor-pointer"
              >
                <Keyboard className="w-3.5 h-3.5" />
                <span>Prefer typing? Open the text answer box</span>
              </button>
            )}
          </div>
        </main>

        {/* Call control dock */}
        <footer className="px-4 pb-6 sm:pb-8">
          <div className="mx-auto max-w-fit flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3 shadow-2xl">
            <button
              type="button"
              onClick={toggleListening}
              title={isListening ? "Stop dictation" : "Start dictation"}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition cursor-pointer ${
                isListening
                  ? "bg-rose-500 text-white shadow-lg shadow-rose-500/40 animate-pulse"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={toggleSpeaker}
              title={speakerOn ? "Mute interviewer voice" : "Unmute interviewer voice"}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition cursor-pointer ${
                speakerOn
                  ? "bg-white/10 text-white hover:bg-white/20"
                  : "bg-white/10 text-white/40 hover:bg-white/20"
              }`}
            >
              {speakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={handleSkip}
              disabled={loading}
              title="Skip question"
              className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition cursor-pointer disabled:opacity-40"
            >
              <FastForward className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleNextOrSubmit}
              disabled={loading}
              className="h-12 px-5 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-bold flex items-center gap-2 transition cursor-pointer disabled:opacity-50 shadow-lg shadow-indigo-500/30"
            >
              <span>
                {loading
                  ? "Evaluating…"
                  : currentQuestionIndex + 1 >= totalQuestions
                  ? "Finish & Evaluate"
                  : "Submit Answer"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </footer>
      </div>
    );
  }

  /* ── Results scorecard ───────────────────────────────────────── */

  const score = evaluation?.overallScore ?? 0;
  const scoreCircumference = 2 * Math.PI * 52;
  const scoreOffset = scoreCircumference - (score / 100) * scoreCircumference;
  const scoreColor =
    score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : score > 0 ? "#f43f5e" : "#64748b";

  return (
    <div className="app-shell flex min-h-screen flex-col font-sans">
      <Sidebar />

      <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        <div className="hunter-panel p-7 sm:p-9 space-y-7">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Interview Complete
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {role} · {difficulty.toUpperCase()} · {formatClock(elapsed)} · {conversation.filter((m) => m.type === "USER").length} answers
            </p>
          </div>

          {/* Score ring + readiness */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="currentColor"
                  className="text-slate-100 dark:text-slate-800"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke={scoreColor}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={scoreCircumference}
                  strokeDashoffset={scoreOffset}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900 dark:text-white">{score}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">/ 100</span>
              </div>
            </div>

            {evaluation?.readiness && (
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  evaluation.readiness === "READY"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                    : evaluation.readiness === "NEEDS_MORE_PREP"
                    ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                    : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
                }`}
              >
                {evaluation.readiness === "READY"
                  ? "Ready to interview"
                  : evaluation.readiness === "NEEDS_MORE_PREP"
                  ? "Needs more prep"
                  : "Not ready yet"}
              </span>
            )}
          </div>

          {/* Evaluator feedback */}
          <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 p-4 rounded-xl">
            <div className="font-bold text-indigo-900 dark:text-indigo-300 mb-1 flex items-center gap-1.5 text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>AI Evaluator Assessment</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {evaluation?.feedback}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={downloadReport}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 cursor-pointer"
            >
              <Download className="w-4 h-4 text-indigo-500" />
              <span>Download Report (.md)</span>
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
      </main>
    </div>
  );
}
