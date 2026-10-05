import axios from "axios";
// Import internal module directly to bypass pdf-parse's module.parent debug code
// @ts-ignore
import pdfParse from "pdf-parse/lib/pdf-parse.js";

const MAX_RESUME_CHARS = 8000;

export const extractResumeTextFromUrl = async (url: string): Promise<string> => {
  try {
    const response = await axios.get<ArrayBuffer>(url, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);
    const parsed = await pdfParse(buffer);
    return parsed.text.replace(/\s+/g, " ").trim().slice(0, MAX_RESUME_CHARS);
  } catch (err) {
    console.error("Resume PDF parse failed:", err);
    return "";
  }
};
