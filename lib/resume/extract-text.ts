import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

const MINIMUM_TEXT_LENGTH = 40;

function cleanExtractedText(text: string): string {
  return text
    .replace(/\u0000/g, "")
    .replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, " ")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function extractPdfText(buffer: Buffer): Promise<string> {
  let parser: PDFParse | null = null;
  try {
    parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return cleanExtractedText(result.text || "");
  } catch (error) {
    console.error("PDF text extraction error:", error);
    throw new Error(
      "Failed to parse PDF document. The file may be corrupt, image-based, or password protected."
    );
  } finally {
    if (parser) {
      try {
        await parser.destroy();
      } catch (destroyError) {
        console.warn("Failed to destroy PDF parser instance:", destroyError);
      }
    }
  }
}

async function extractDocxText(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });

    if (result.messages.length > 0) {
      console.warn("DOCX extraction warnings:", result.messages);
    }

    return cleanExtractedText(result.value || "");
  } catch (error) {
    console.error("DOCX text extraction error:", error);
    throw new Error(
      "Failed to parse DOCX document. Please ensure the file is a valid Word document."
    );
  }
}

export async function extractResumeText(file: File): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension !== "pdf" && extension !== "docx") {
    throw new Error("Text extraction only supports PDF and DOCX files.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const extractedText =
    extension === "pdf"
      ? await extractPdfText(buffer)
      : await extractDocxText(buffer);

  if (extractedText.length < MINIMUM_TEXT_LENGTH) {
    throw new Error(
      "Very little readable text was found. The resume may be scanned, image-based, empty, or password protected."
    );
  }

  return extractedText;
}