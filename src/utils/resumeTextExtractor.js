import fs from "fs/promises";
import path from "path";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";

export async function extractResumeText(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  try {
    // Read file once into a buffer to use for both types
    const buffer = await fs.readFile(filePath);

    if (ext === ".pdf") {
      const data = await pdfParse(buffer);
      // console.log(data.length);
      // console.log(data);
      return cleanText(data.text);
    }

    if (ext === ".docx") {
      // Passing the buffer is more reliable than the string path in some environments
      const result = await mammoth.extractRawText({ buffer: buffer });
      return cleanText(result.value);
    }

    if (ext === ".txt") {
      return cleanText(buffer.toString('utf-8'));
    }

    throw new Error(`Unsupported format: ${ext}`);
  } catch (err) {
    console.error(`[Extraction Error] ${filePath}:`, err.message);
    return "";
  }
}

function cleanText(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "")
    .trim();
}