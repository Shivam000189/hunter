import prisma from "../config/prisma";
import openai from "../config/openai";
import { ensureResumeText } from "./resume.service";
import { getFreshGithubData } from "./github";

const MAX_QUESTIONS = 5;

type InterviewQuestion = {
  question: string;
  idealAnswer: string;
  keywords: string[];
};

const askModel = async (prompt: string, maxTokens: number) => {
  try {
    const response = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct",
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens,
    });
    return response.choices?.[0]?.message?.content?.trim() || "";
  } catch {
    return "";
  }
};

const parseQuestionSet = (content: string): InterviewQuestion[] => {
  const match = content.match(/\[[\s\S]*\]/);
  if (!match) return [];

  try {
    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed) || parsed.length !== MAX_QUESTIONS) return [];
    return parsed.map((item) => ({
      question: String(item.question || "").trim(),
      idealAnswer: String(item.idealAnswer || "").trim(),
      keywords: Array.isArray(item.keywords)
        ? item.keywords.map((keyword: unknown) => String(keyword).trim().toLowerCase()).filter(Boolean)
        : [],
    })).filter((item) => item.question && item.idealAnswer && item.keywords.length > 0);
  } catch {
    return [];
  }
};

type InterviewVerdict = {
  score: number;
  readiness: "READY" | "NEEDS_MORE_PREP" | "NOT_READY";
  strength: string;
  improvement: string;
};

const parseVerdict = (content: string): InterviewVerdict | null => {
  const match = content.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[0]);
    const readiness = ["READY", "NEEDS_MORE_PREP", "NOT_READY"].includes(parsed.readiness)
      ? parsed.readiness
      : null;
    if (!readiness) return null;
    return {
      score: Math.min(100, Math.max(0, Number(parsed.score) || 0)),
      readiness,
      strength: String(parsed.strength || "").trim(),
      improvement: String(parsed.improvement || "").trim(),
    };
  } catch {
    return null;
  }
};

const getQuestionSet = (interview: { questionSet: unknown }): InterviewQuestion[] =>
  Array.isArray(interview.questionSet) ? interview.questionSet as InterviewQuestion[] : [];

const keywordCoverage = (answer: string, keywords: string[]) => {
  const normalizedAnswer = answer.toLowerCase();
  const matchedKeywords = keywords.filter((keyword) => normalizedAnswer.includes(keyword));
  return {
    matchedKeywords,
    missingKeywords: keywords.filter((keyword) => !matchedKeywords.includes(keyword)),
    score: keywords.length ? Math.round((matchedKeywords.length / keywords.length) * 100) : 0,
  };
};

const getInterview = async (userId: string, id: string) => {
  const interview = await prisma.interview.findFirst({
    where: { id, userId },
    include: { conversation: { orderBy: { createdAt: "asc" } } },
  });

  if (!interview) throw { status: 404, message: "Interview not found" };
  return interview;
};

export const startInterview = async (userId: string, resumeId: string, jobDescription: string) => {
  if (!resumeId) throw { status: 400, message: "resumeId is required" };
  const cleanJobDescription = jobDescription.trim().slice(0, 6000);
  if (!cleanJobDescription) throw { status: 400, message: "Job description is required" };

  const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
  if (!resume || resume.userId !== userId) {
    throw { status: 403, message: "Resume not found or not yours" };
  }

  const cleanResume = (await ensureResumeText(resume)).slice(0, 8000);
  if (!cleanResume) {
    throw { status: 422, message: "Could not read text from this resume. Try re-uploading it." };
  }

  const githubRepos = await getFreshGithubData(userId);
  const githubSummary =
    githubRepos && githubRepos.length
      ? githubRepos
          .slice()
          .sort((a, b) => b.starCount - a.starCount)
          .slice(0, 5)
          .map((r) => `- ${r.name}: ${r.description || "no description"} (${r.starCount}★)`)
          .join("\n")
      : "No GitHub projects connected.";

  const generated = await askModel(
    `Create exactly five tailored interview questions from this candidate's resume, the job description, and their real GitHub projects. Ground at least two questions in specifics from the GitHub projects when available (reference the project by name). Return only valid JSON, with no markdown, using this exact shape: [{"question":"...","idealAnswer":"...","keywords":["..."]}]. Each idealAnswer must be a concise answer the candidate could give and keywords must contain 4-8 important words or short phrases from that ideal answer. Do not invent experience not present in the resume or GitHub projects.\nRESUME:\n${cleanResume}\nJOB DESCRIPTION:\n${cleanJobDescription}\nGITHUB PROJECTS:\n${githubSummary}`,
    1500
  );

  const questionSet = parseQuestionSet(generated);
  if (questionSet.length !== MAX_QUESTIONS) {
    throw { status: 502, message: "AI could not prepare the interview questions. Please try again." };
  }
  const firstQuestion = questionSet[0]?.question;
  if (!firstQuestion) {
    throw { status: 502, message: "AI could not prepare the first interview question. Please try again." };
  }

  const interview = await prisma.interview.create({
    data: {
      userId,
      githubMetadata: githubRepos ?? [],
      resumeText: cleanResume,
      jobDescription: cleanJobDescription,
      questionSet,
      status: "PENDING",
      conversation: { create: { message: firstQuestion, type: "ASSISTANT" } },
    },
    include: { conversation: { orderBy: { createdAt: "asc" } } },
  });

  return formatInterviewResponse(interview);
};

const formatInterviewResponse = (interview: any) => ({
  ...interview,
  totalQuestions: MAX_QUESTIONS,
});

export const answerInterview = async (userId: string, id: string, answer: string) => {
  const cleanAnswer = answer.trim();
  if (!cleanAnswer) throw { status: 400, message: "Answer is required" };

  const interview = await getInterview(userId, id);
  if (interview.status !== "PENDING") throw { status: 400, message: "Interview is already complete" };

  const questionSet = getQuestionSet(interview);
  const questionIndex = interview.conversation.filter((message) => message.type === "USER").length;
  const currentQuestion = questionSet[questionIndex];
  if (!currentQuestion) throw { status: 500, message: "Interview questions are unavailable" };
  const coverage = keywordCoverage(cleanAnswer, currentQuestion.keywords);

  await prisma.message.create({ data: { interviewId: id, message: cleanAnswer.slice(0, 4000), type: "USER" } });
  const answeredQuestions = questionIndex + 1;

  if (answeredQuestions >= MAX_QUESTIONS) {
    const raw = await askModel(
      `Evaluate this completed mock interview. Return ONLY valid JSON with this exact shape: {"score": 0-100, "readiness": "READY" | "NEEDS_MORE_PREP" | "NOT_READY", "strength": "one sentence", "improvement": "one sentence"}. Base "readiness" on whether this candidate's answers would hold up in a real interview for this role: READY means strong enough to interview now, NEEDS_MORE_PREP means promising but with real gaps, NOT_READY means significant gaps that would likely fail a real interview. Keyword coverage on the final answer was ${coverage.score}/100.\n${interview.conversation.map((message) => `${message.type}: ${message.message}`).join("\n")}\nUSER: ${cleanAnswer}`,
      220
    );

    const verdict = parseVerdict(raw) || {
      score: 60,
      readiness: "NEEDS_MORE_PREP" as const,
      strength: "You communicated clearly and showed relevant practical thinking.",
      improvement: "Add more measurable impact and structure answers with context, action, and result.",
    };

    const feedback = `${verdict.strength} ${verdict.improvement}`;

    const completed = await prisma.interview.update({
      where: { id },
      data: {
        status: "COMPLETED",
        score: verdict.score,
        readiness: verdict.readiness,
        feedback,
        answerFeedback: coverage,
      },
      include: { conversation: { orderBy: { createdAt: "asc" } } },
    });
    return formatInterviewResponse(completed);
  }

  const question = questionSet[answeredQuestions]?.question;
  if (!question) throw { status: 500, message: "The next interview question is unavailable" };
  await prisma.message.create({ data: { interviewId: id, message: question, type: "ASSISTANT" } });
  await prisma.interview.update({ where: { id }, data: { answerFeedback: coverage } });
  const updated = await getInterview(userId, id);
  return formatInterviewResponse(updated);
};

export const getInterviewById = async (userId: string, id: string) => {
  const interview = await getInterview(userId, id);
  return formatInterviewResponse(interview);
};