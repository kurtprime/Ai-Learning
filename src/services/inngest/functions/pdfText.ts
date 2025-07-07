export const cleanResumeText = (text: string) => {
  return text
    .replace(/\s+/g, " ")
    .replace(/[^\x00-\x7F]/g, "")
    .substring(0, 15000);
};

export const extractTextFromBuffer = async (
  fileURL: string
): Promise<string> => {
  const resumeResponse = await fetch(fileURL);
  if (!resumeResponse.ok) throw new Error(`HTTP ${resumeResponse.status}`);

  const pdfBlob = await resumeResponse.blob();

  const formData = new FormData();
  formData.append("file", pdfBlob, "resume.pdf");

  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) throw new Error("RAPIDAPI_KEY is not defined");
  const url = "https://pdf-text-extractor.p.rapidapi.com/extract_text";
  const headers = new Headers();
  headers.append("X-RapidAPI-Key", apiKey);
  headers.append("X-RapidAPI-Host", "pdf-text-extractor.p.rapidapi.com");

  try {
    const options = {
      method: "POST",
      headers,
      body: formData,
    };

    const response = await fetch(url, options);
    const result = await response.json();
    if (result.text && Array.isArray(result.text)) {
      const fullText = result.text.join("\n");
      return cleanResumeText(fullText);
    }
    return result;
  } catch (error) {
    return `ERROR ERROR ${error} `;
  }
};
