import openai from "../config/openai";
import prisma from "../config/prisma";
import { JobStatus } from "@prisma/client";

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