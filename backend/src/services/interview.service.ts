import prisma from "../config/prisma";
import openai from "../config/openai";

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

export const startInterview = async (userId: string, resumeText: string, jobDescription: string) => {
  const cleanResume = resumeText.trim().slice(0, 8000);
  const cleanJobDescription = jobDescription.trim().slice(0, 6000);
  if (!cleanResume) throw { status: 400, message: "Resume text is required" };
  if (!cleanJobDescription) throw { status: 400, message: "Job description is required" };

  const generated = await askModel(
    `Create exactly five tailored interview questions from this resume and job description. Return only valid JSON, with no markdown, using this exact shape: [{"question":"...","idealAnswer":"...","keywords":["..."]}]. Each idealAnswer must be a concise answer the candidate could give and keywords must contain 4-8 important words or short phrases from that ideal answer. Do not invent experience not present in the resume.\nRESUME:\n${cleanResume}\nJOB DESCRIPTION:\n${cleanJobDescription}`,
    1400
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
      githubMetadata: {},
      resumeText: cleanResume,
      jobDescription: cleanJobDescription,
      questionSet,
      status: "PENDING",
      conversation: { create: { message: firstQuestion, type: "ASSISTANT" } },
    },
    include: { conversation: { orderBy: { createdAt: "asc" } } },
  });

  return interview;
};

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
    const feedback =
      (await askModel(
        `Evaluate this mock interview in 3 concise sentences. Mention one strength, one improvement, and a score from 0 to 100. The candidate's keyword coverage scores were ${coverage.score}/100 for the final answer.\n${interview.conversation.map((message) => `${message.type}: ${message.message}`).join("\n")}\nUSER: ${cleanAnswer}`,
        180
      )) || "You communicated clearly and showed useful practical thinking. Add more measurable impact and structure your answers with context, action, and result. Score: 75/100.";
    const scoreMatch = feedback.match(/(\d{1,3})\s*\/\s*100/);
    const score = Math.min(100, Math.max(0, Number(scoreMatch?.[1] || 75)));
    return prisma.interview.update({
      where: { id },
      data: {
        status: "COMPLETED",
        score,
        feedback,
        answerFeedback: coverage,
      },
      include: { conversation: { orderBy: { createdAt: "asc" } } },
    });
  }

  const question = questionSet[answeredQuestions]?.question;
  if (!question) throw { status: 500, message: "The next interview question is unavailable" };
  await prisma.message.create({ data: { interviewId: id, message: question, type: "ASSISTANT" } });
  await prisma.interview.update({ where: { id }, data: { answerFeedback: coverage } });
  return getInterview(userId, id);
};

export const getInterviewById = (userId: string, id: string) => getInterview(userId, id);