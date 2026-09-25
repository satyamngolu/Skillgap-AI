import {
  extractText,
  getDocumentProxy,
} from "unpdf";

export async function extractPdfText(
  fileData: Buffer
): Promise<string> {
  const pdf = await getDocumentProxy(
    new Uint8Array(fileData)
  );

  const result = await extractText(pdf, {
    mergePages: true,
  });

  return typeof result.text === "string"
    ? result.text.trim()
    : "";
}