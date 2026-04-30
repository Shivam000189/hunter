import openai from "../config/openai";
import prisma from "../config/prisma";

// sleep helper
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

// retry wrapper
const generateWithRetry = async (fn: any, retries = 3): Promise<any> => {
    try {
        return await fn();
    } catch (err: any) {
        if (err?.status === 429 && retries > 0) {
        console.log("Retrying OpenRouter request...");
        await sleep(1000);
        return generateWithRetry(fn, retries - 1);
        }
        throw err;
    }
    };

// main function
export const generateCoverLetter = async (
userId: string,
data: any
) => {
    const {
        jobDescription,
        userSkills = [],
        tone = "formal",
        jobId,
    } = data;

    // validation
    if (!jobDescription || typeof jobDescription !== "string") {
        throw { status: 400, message: "jobDescription is required" };
    }

    // trim  input 
    const trimmedJD = jobDescription.slice(0, 1000);

    
    const prompt = `
    Write a ${tone} and personalized cover letter.

    Rules:
    - No placeholders like [Your Name] or [Number]
    - Use real tone (human-like, not robotic)
    - Keep it under 180 words
    - Mention relevant skills clearly
    - Make it specific to the job

    Job Description:
    ${trimmedJD}

    Candidate Skills:
    ${userSkills.join(", ")}

    Output format:
    Start with "Dear Hiring Manager,"
    End professionally (no placeholders)
    `;

    // multimode fetch
    const models = [
        "meta-llama/llama-3-8b-instruct",
        "mistralai/mistral-7b-instruct",
    ];

    let content = "";

    for (const model of models) {
        try {
        const response = await generateWithRetry(() =>
            openai.chat.completions.create({
            model,
            messages: [{ role: "user", content: prompt }],
            max_tokens: 300, // limit output
            })
        );

        content = response.choices?.[0]?.message?.content || "";

        if (content) {
            console.log(` Success with model: ${model}`);
            break;
        }
        } catch (err) {
        console.log(` Model failed: ${model}`);
        }
    }
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            name: true,
        },
        });

    const userName = user?.name || "Candidate";
    
    if (!content) {
        content = `Dear Hiring Manager,

    I am excited to apply for this role. With my skills in ${userSkills.join(
        ", "
        )}, I believe I can contribute effectively to your team.

    Thank you for your time and consideration.

    Sincerely,
    ${userName}`;
    }

    
    const coverLetter = await prisma.coverLetter.create({
        data: {
        content,
        userId,
        jobId,
        tone,
        },
    });

    return coverLetter;
    };

//  get all
export const getCoverLetters = async (userId: string) => {
    return prisma.coverLetter.findMany({
        where: { userId },
        orderBy: { generatedAt: "desc" },
    });
    };

// get one
export const getCoverLetterById = async (
userId: string,
id: string
) => {
    const letter = await prisma.coverLetter.findUnique({
        where: { id },
    });

    if (!letter || letter.userId !== userId) {
        throw { status: 403, message: "Not allowed" };
    }

    return letter;
    };

const parseJsonObject = (content: string) => {
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
        return null;
    }

    try {
        return JSON.parse(jsonMatch[0]);
    } catch {
        return null;
    }
};

const normalizeWords = (text: string) => {
    const stopWords = new Set([
        "and",
        "the",
        "with",
        "for",
        "from",
        "that",
        "this",
        "are",
        "you",
        "your",
        "will",
        "have",
        "has",
        "our",
        "job",
        "role",
        "work",
        "team",
        "experience",
    ]);

    return Array.from(
        new Set(
        text
            .toLowerCase()
            .replace(/[^a-z0-9+#.\s-]/g, " ")
            .split(/\s+/)
            .map((word) => word.trim())
            .filter((word) => word.length > 2 && !stopWords.has(word))
        )
    );
};

const keywordMatch = (resumeText: string, jobDescription: string) => {
    const resumeWords = new Set(normalizeWords(resumeText));
    const jobKeywords = normalizeWords(jobDescription);
    const matchedKeywords = jobKeywords.filter((word) => resumeWords.has(word));
    const missingSkills = jobKeywords.filter((word) => !resumeWords.has(word));

    return {
        matchScore: jobKeywords.length
        ? Math.round((matchedKeywords.length / jobKeywords.length) * 100)
        : 0,
        matchedKeywords,
        missingSkills: missingSkills.slice(0, 20),
    };
};

export const getResumeFeedback = async (_userId: string, data: any) => {
    const { resumeText, jobDescription = "" } = data;

    if (!resumeText || typeof resumeText !== "string") {
        throw { status: 400, message: "resumeText is required" };
    }

    const prompt = `
    Analyze this resume${jobDescription ? " against the provided job description" : ""}.

    Return only valid JSON with this shape:
    {
      "score": number,
      "strengths": string[],
      "weaknesses": string[],
      "missingKeywords": string[],
      "suggestions": string[],
      "atsScore": number
    }

    Rules:
    - score and atsScore must be 0-100
    - keep each array to 3-6 practical items
    - if a job description is provided, tailor missingKeywords and suggestions to it

    Resume:
    ${resumeText.slice(0, 4000)}

    Job Description:
    ${String(jobDescription).slice(0, 2500)}
    `;

    let content = "";

    try {
        const response = await generateWithRetry(() =>
        openai.chat.completions.create({
            model: "mistralai/mistral-7b-instruct",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 500,
        })
        );

        content = response.choices?.[0]?.message?.content || "";
    } catch {
        content = "";
    }

    const parsed = parseJsonObject(content);

    if (parsed) {
        return {
        score: Number(parsed.score ?? parsed.atsScore ?? 0),
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
        missingKeywords: Array.isArray(parsed.missingKeywords)
            ? parsed.missingKeywords
            : [],
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
        atsScore: Number(parsed.atsScore ?? parsed.score ?? 0),
        };
    }

    const match = jobDescription
        ? keywordMatch(resumeText, jobDescription)
        : { matchScore: 70, missingSkills: [], matchedKeywords: [] };

    return {
        score: match.matchScore,
        strengths: ["Clear resume text provided", "Relevant experience can be identified"],
        weaknesses: ["AI analysis unavailable, using keyword fallback"],
        missingKeywords: match.missingSkills,
        suggestions: [
        "Add measurable impact with numbers",
        "Mirror the most important job description keywords",
        "Keep bullets specific to outcomes and tools used",
        ],
        atsScore: match.matchScore,
    };
};

export const getResumeMatchScore = async (_userId: string, data: any) => {
    const { resumeText, jobDescription } = data;

    if (!resumeText || typeof resumeText !== "string") {
        throw { status: 400, message: "resumeText is required" };
    }

    if (!jobDescription || typeof jobDescription !== "string") {
        throw { status: 400, message: "jobDescription is required" };
    }

    return keywordMatch(resumeText, jobDescription);
};
