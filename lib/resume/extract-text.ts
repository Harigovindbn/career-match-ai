import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

const MINIMUM_TEXT_LENGTH = 40;

function cleanExtractedText(text: string): string {
  return text
    .replace(/\u0000/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function extractPdfText(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({
    data: buffer,
  });

  try {
    const result = await parser.getText();

    return cleanExtractedText(result.text);
  } finally {
    await parser.destroy();
  }
}

async function extractDocxText(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({
    buffer,
  });

  if (result.messages.length > 0) {
    console.warn("DOCX extraction warnings:", result.messages);
  }

  return cleanExtractedText(result.value);
}

export async function extractResumeText(
  file: File,
): Promise<string> {
  const extension = file.name
    .split(".")
    .pop()
    ?.toLowerCase();

  if (extension !== "pdf" && extension !== "docx") {
    throw new Error(
      "Text extraction only supports PDF and DOCX files.",
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const extractedText =
    extension === "pdf"
      ? await extractPdfText(buffer)
      : await extractDocxText(buffer);

  if (extractedText.length < MINIMUM_TEXT_LENGTH) {
    throw new Error(
      "Very little readable text was found. The resume may be scanned, image-based, empty, or password protected.",
    );
  }

  return extractedText;
}