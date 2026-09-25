"use client";

import {
  CheckCircle2,
  FileText,
  Loader2,
  Sparkles,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { ChangeEvent, useState } from "react";

type UploadStatus =
  | "idle"
  | "uploading"
  | "success"
  | "error"
  | "analyzing";

export default function ResumeAnalyzerPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [status, setStatus] = useState<UploadStatus>("idle");

  const [message, setMessage] = useState("");

  const [resumeId, setResumeId] = useState<string | null>(null);

  const [extractedText, setExtractedText] = useState("");
const [skills, setSkills] = useState<string[]>([]);
  // ---------------------------------------
  // File selection
  // ---------------------------------------

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // Frontend validation
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setSelectedFile(null);
      setStatus("error");
      setMessage("Only PDF, DOC, and DOCX files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSelectedFile(null);
      setStatus("error");
      setMessage("Resume must be smaller than 5 MB.");
      return;
    }

    setSelectedFile(file);
    setStatus("idle");
    setMessage("");
    setResumeId(null);
    setExtractedText("");
  }

  // ---------------------------------------
  // Remove selected file
  // ---------------------------------------

  function removeFile() {
    setSelectedFile(null);
    setResumeId(null);
    setExtractedText("");
    setStatus("idle");
    setMessage("");
  }

  // ---------------------------------------
  // Upload resume
  // ---------------------------------------

  async function handleUpload() {
    if (!selectedFile) {
      setMessage("Please select a resume first.");
      setStatus("error");
      return;
    }

    setStatus("uploading");
    setMessage("");

    try {
      const formData = new FormData();

      formData.append("resume", selectedFile);

      const response = await fetch("/api/resumes", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log("UPLOAD STATUS:", response.status);
      console.log("UPLOAD RESPONSE:", data);

      if (!response.ok) {
        setStatus("error");

        setMessage(
          data.error
            ? `${data.message} ${data.error}`
            : data.message || "Upload failed."
        );

        return;
      }

      const uploadedResumeId = data.resume?.id;

      if (!uploadedResumeId) {
        setStatus("error");
        setMessage(
          "Resume uploaded, but no resume ID was returned."
        );
        return;
      }

      setResumeId(uploadedResumeId);

      setStatus("success");

      setMessage(
        data.message || "Resume uploaded successfully."
      );
    } catch (error) {
      console.error("UPLOAD_ERROR:", error);

      setStatus("error");

      setMessage(
        "Unable to connect to the server. Please try again."
      );
    }
  }

  // ---------------------------------------
  // Analyze resume
  // ---------------------------------------

const handleAnalyze = async () => {
  if (!resumeId) {
    setStatus("error");
    setMessage("Please upload a resume first.");
    return;
  }

  if (!selectedFile) {
    setStatus("error");
    setMessage("Resume file is missing.");
    return;
  }

  if (selectedFile.type !== "application/pdf") {
    setStatus("error");
    setMessage("PDF analysis is available now. Please upload a PDF.");
    return;
  }

  try {
    setStatus("analyzing");
    setMessage("Analyzing your resume...");

    const response = await fetch(`/api/resumes/${resumeId}/analyze`, {
      method: "POST",
    });

    const raw = await response.text();

    console.log("ANALYZE STATUS:", response.status);
    console.log("ANALYZE RAW RESPONSE:", raw);

    let data: {
      message?: string;
      resume?: {
        extractedText?: string;
        skills?: string[];
      };
      error?: string;
    };

    try {
      data = JSON.parse(raw);
    } catch {
      console.error("SERVER RETURNED NON-JSON RESPONSE:", raw);

      setStatus("error");
      setMessage(
        `Server returned an invalid response (${response.status}). Check the terminal for the real API error.`
      );
      return;
    }

    if (!response.ok) {
      setStatus("error");
      setMessage(data.message || data.error || "Resume analysis failed.");
      return;
    }

    setExtractedText(data.resume?.extractedText || "");
    setSkills(data.resume?.skills || []);

    setStatus("success");
    setMessage(data.message || "Resume analyzed successfully.");
  } catch (error) {
    console.error("ANALYZE_ERROR:", error);

    setStatus("error");
    setMessage("Unable to connect to the analysis server.");
  }
}




  return (
    <div className="min-h-screen bg-[#070b1a] p-6 text-white lg:p-8">

      <div className="mx-auto max-w-5xl">

        {/* --------------------------------------- */}
        {/* Header */}
        {/* --------------------------------------- */}

        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm font-medium text-violet-400">
            <Sparkles size={16} />
            Career Intelligence
          </div>

          <h1 className="mt-2 text-3xl font-bold">
            Resume Analyzer
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Upload your resume and SkillGap-AI will use it as the
            foundation for your skill analysis.
          </p>
        </div>

        {/* --------------------------------------- */}
        {/* Upload Card */}
        {/* --------------------------------------- */}

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

          {/* No file selected */}
          {!selectedFile ? (
            <label className="flex min-h-[340px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-black/10 px-6 text-center transition hover:border-violet-500/40 hover:bg-violet-500/[0.03]">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10">
                <UploadCloud
                  size={30}
                  className="text-violet-400"
                />
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                Upload Your Resume
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                Click below to choose your resume from your
                computer.
              </p>

              <span className="mt-6 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 text-sm font-semibold">
                Choose File
              </span>

              <p className="mt-4 text-xs text-gray-600">
                PDF, DOC or DOCX · Maximum 5 MB
              </p>

              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (

            /* File selected */
            <div className="rounded-2xl border border-white/10 bg-black/10 p-6">

              {/* File information */}
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex min-w-0 items-center gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                    <FileText
                      size={22}
                      className="text-violet-400"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">
                      {selectedFile.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {(
                        selectedFile.size /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  disabled={
                    status === "uploading" ||
                    status === "analyzing"
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-400 transition hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  Remove
                </button>

              </div>

              {/* --------------------------------------- */}
              {/* Status Messages */}
              {/* --------------------------------------- */}

              {status === "success" && message && (
                <div className="mt-6 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                  <CheckCircle2 size={18} />
                  <span>{message}</span>
                </div>
              )}

              {status === "error" && message && (
                <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-400">
                  {message}
                </div>
              )}

              {/* --------------------------------------- */}
              {/* Upload Button */}
              {/* --------------------------------------- */}

              {!resumeId && (
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={status === "uploading"}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3.5 text-sm font-semibold transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "uploading" ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <UploadCloud size={18} />
                      Upload Resume
                    </>
                  )}
                </button>
              )}

              {/* --------------------------------------- */}
              {/* Analyze Button */}
              {/* --------------------------------------- */}

              {resumeId && !extractedText && (
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={status === "analyzing"}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3.5 text-sm font-semibold transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "analyzing" ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Analyzing Resume...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Analyze Resume
                    </>
                  )}
                </button>
              )}

            </div>
          )}

        </div>

        {/* --------------------------------------- */}
        {/* Extracted Text */}
        {/* --------------------------------------- */}

        {extractedText && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                <CheckCircle2
                  size={20}
                  className="text-green-400"
                />
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-green-400">
                  Analysis Complete
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  Resume text extracted successfully
                </h2>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-5">
              <pre className="max-h-[550px] overflow-y-auto whitespace-pre-wrap font-sans text-sm leading-7 text-gray-400">
                {extractedText}
              </pre>
            </div>

          </div>
        )}

        {/* --------------------------------------- */}
        {/* What Happens Next */}
        {/* --------------------------------------- */}

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div
            className={`rounded-2xl border p-5 ${
              selectedFile
                ? "border-green-500/20 bg-green-500/5"
                : "border-white/10 bg-white/[0.03]"
            }`}
          >
            <p className="text-xs uppercase tracking-widest text-violet-400">
              Step 1
            </p>

            <h3 className="mt-3 font-semibold">
              Resume Upload
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Upload your PDF, DOC or DOCX resume.
            </p>

            {selectedFile && (
              <p className="mt-3 text-xs text-green-400">
                ✓ File selected
              </p>
            )}
          </div>

          <div
            className={`rounded-2xl border p-5 ${
              extractedText
                ? "border-green-500/20 bg-green-500/5"
                : "border-white/10 bg-white/[0.03]"
            }`}
          >
            <p className="text-xs uppercase tracking-widest text-blue-400">
              Step 2
            </p>

            <h3 className="mt-3 font-semibold">
              Text Extraction
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              SkillGap-AI extracts readable content from your
              PDF resume.
            </p>

            {extractedText && (
              <p className="mt-3 text-xs text-green-400">
                ✓ Text extracted
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

            <p className="text-xs uppercase tracking-widest text-cyan-400">
              Step 3
            </p>

            <h3 className="mt-3 font-semibold">
              Skill Extraction
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Next, AI will identify your skills, projects,
              experience and technologies.
            </p>

            <p className="mt-3 text-xs text-gray-600">
              Coming next
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}