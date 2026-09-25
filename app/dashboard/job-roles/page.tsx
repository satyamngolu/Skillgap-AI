"use client";

import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  CircleAlert,
  Code2,
  Database,
  FileText,
  Globe,
  Layers3,
  Loader2,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useState } from "react";

type JobRole = {
  name: string;
  description: string;
  icon: React.ElementType;
};

type AnalysisResult = {
  resume: {
    fileName: string;
    skills: string[];
  };

  jobDescription: {
    detectedSkills: string[];
  };

  summary: {
    matched: number;
    partial: number;
    missing: number;
    readinessScore: number;
  };

  skills: {
    skill: string;
    status: "matched" | "partial" | "missing";
    importance: "High" | "Medium";
    action: string;
  }[];
};

const JOB_ROLES: JobRole[] = [
  {
    name: "AI/ML Engineer",
    description:
      "Build and deploy machine learning systems",
    icon: Brain,
  },
  {
    name: "Data Scientist",
    description:
      "Analyze data and derive insights",
    icon: BarChart3,
  },
  {
    name: "Backend Developer",
    description:
      "Build server-side applications and APIs",
    icon: Database,
  },
  {
    name: "Frontend Developer",
    description:
      "Build modern web interfaces",
    icon: Globe,
  },
  {
    name: "Data Analyst",
    description:
      "Analyze data and create reports",
    icon: BarChart3,
  },
  {
    name: "Full Stack Developer",
    description:
      "Work across frontend and backend systems",
    icon: Layers3,
  },
];

export default function JobRolesPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] =
    useState<"popular" | "custom">(
      "popular"
    );

  const [selectedRole, setSelectedRole] =
    useState("AI/ML Engineer");

  const [customJobDescription, setCustomJobDescription] =
    useState("");

  const [analysis, setAnalysis] =
    useState<AnalysisResult | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleRoleSelect = (
    role: string
  ) => {
    setSelectedRole(role);
    setError("");
  };

  const handlePopularContinue = () => {
    if (!selectedRole) {
      setError(
        "Please select a job role."
      );
      return;
    }

    router.push(
      `/dashboard/skill-gap?role=${encodeURIComponent(
        selectedRole
      )}`
    );
  };

  const handleCustomAnalysis =
    async () => {
      const description =
        customJobDescription.trim();

      setError("");
      setAnalysis(null);

      if (!description) {
        setError(
          "Please paste a job description first."
        );
        return;
      }

      if (description.length < 50) {
        setError(
          "Please enter at least 50 characters."
        );
        return;
      }

      try {
        setLoading(true);

        const response = await fetch(
          "/api/job-description",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              description,
            }),
          }
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to analyze job description."
          );
        }

        setAnalysis(result);
      } catch (err) {
        console.error(
          "CUSTOM_ANALYSIS_ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-[#070b1a] p-6 text-white lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm font-medium text-violet-400">
            <Sparkles size={16} />
            Career Intelligence
          </div>

          <h1 className="mt-2 text-3xl font-bold">
            Choose Your Target Job Role
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Select a role or analyze a custom job
            description against your resume.
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:p-8">
          {/* Tabs */}
          <div className="mb-8 flex w-fit rounded-xl border border-white/10 bg-black/20 p-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab("popular");
                setError("");
                setAnalysis(null);
              }}
              className={`rounded-lg px-5 py-2.5 text-sm font-medium ${
                activeTab === "popular"
                  ? "bg-violet-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Popular Roles
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("custom");
                setError("");
              }}
              className={`rounded-lg px-5 py-2.5 text-sm font-medium ${
                activeTab === "custom"
                  ? "bg-violet-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Custom Job Description
            </button>
          </div>

          {/* Popular Roles */}
          {activeTab === "popular" && (
            <div>
              <h2 className="text-lg font-semibold">
                Popular Job Roles
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Choose the role you are preparing for.
              </p>

              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {JOB_ROLES.map((role) => {
                  const Icon = role.icon;
                  const selected =
                    selectedRole === role.name;

                  return (
                    <button
                      key={role.name}
                      type="button"
                      onClick={() =>
                        handleRoleSelect(
                          role.name
                        )
                      }
                      className={`rounded-2xl border p-6 text-left transition ${
                        selected
                          ? "border-violet-500 bg-violet-500/10"
                          : "border-white/10 bg-black/10 hover:border-white/20"
                      }`}
                    >
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                          selected
                            ? "bg-violet-500/20"
                            : "bg-white/5"
                        }`}
                      >
                        <Icon
                          size={24}
                          className={
                            selected
                              ? "text-violet-400"
                              : "text-gray-400"
                          }
                        />
                      </div>

                      <h3 className="mt-5 text-lg font-semibold">
                        {role.name}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-gray-500">
                        {role.description}
                      </p>

                      {selected && (
                        <div className="mt-4 flex items-center gap-2 text-xs text-violet-400">
                          <Target size={14} />
                          Selected
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom JD */}
          {activeTab === "custom" && (
            <div>
              <div className="flex items-center gap-2">
                <FileText
                  size={18}
                  className="text-violet-400"
                />

                <h2 className="text-lg font-semibold">
                  Custom Job Description
                </h2>
              </div>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Paste a real job description and
                compare it with your resume.
              </p>

              <textarea
                value={customJobDescription}
                onChange={(event) =>
                  setCustomJobDescription(
                    event.target.value
                  )
                }
                placeholder="Paste the job description here..."
                className="mt-6 min-h-[300px] w-full rounded-2xl border border-white/10 bg-black/20 p-5 text-sm leading-7 text-white outline-none placeholder:text-gray-600 focus:border-violet-500/50"
              />

              <div className="mt-3 text-xs text-gray-600">
                {customJobDescription.length} characters
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Custom Result */}
          {activeTab === "custom" &&
            analysis && (
              <div className="mt-8 space-y-6">
                {/* Score */}
                <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
                  <div className="flex items-center gap-2 text-violet-400">
                    <Sparkles size={18} />

                    <span className="text-sm font-medium">
                      Resume Readiness
                    </span>
                  </div>

                  <p className="mt-3 text-4xl font-bold">
                    {
                      analysis.summary
                        .readinessScore
                    }%
                  </p>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-green-500/10 bg-green-500/5 p-5">
                    <CheckCircle2
                      size={20}
                      className="text-green-400"
                    />

                    <p className="mt-3 text-2xl font-bold text-green-400">
                      {
                        analysis.summary
                          .matched
                      }
                    </p>

                    <p className="text-sm text-gray-500">
                      Matched
                    </p>
                  </div>

                  <div className="rounded-xl border border-yellow-500/10 bg-yellow-500/5 p-5">
                    <CircleAlert
                      size={20}
                      className="text-yellow-400"
                    />

                    <p className="mt-3 text-2xl font-bold text-yellow-400">
                      {
                        analysis.summary
                          .partial
                      }
                    </p>

                    <p className="text-sm text-gray-500">
                      Partial
                    </p>
                  </div>

                  <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-5">
                    <XCircle
                      size={20}
                      className="text-red-400"
                    />

                    <p className="mt-3 text-2xl font-bold text-red-400">
                      {
                        analysis.summary
                          .missing
                      }
                    </p>

                    <p className="text-sm text-gray-500">
                      Missing
                    </p>
                  </div>
                </div>

                {/* Detected Skills */}
                <div className="rounded-2xl border border-white/10 bg-black/10 p-6">
                  <h3 className="font-semibold">
                    Skills Detected From JD
                  </h3>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {analysis.jobDescription.detectedSkills.map(
                      (skill) => (
                        <span
                          key={skill}
                          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* Comparison */}
                <div className="rounded-2xl border border-white/10 bg-black/10 p-6">
                  <h3 className="font-semibold">
                    Skill Comparison
                  </h3>

                  <div className="mt-4 divide-y divide-white/10">
                    {analysis.skills.map(
                      (item) => (
                        <div
                          key={item.skill}
                          className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center"
                        >
                          <div className="flex items-center gap-3">
                            {item.status ===
                              "matched" && (
                              <CheckCircle2
                                size={18}
                                className="text-green-400"
                              />
                            )}

                            {item.status ===
                              "partial" && (
                              <CircleAlert
                                size={18}
                                className="text-yellow-400"
                              />
                            )}

                            {item.status ===
                              "missing" && (
                              <XCircle
                                size={18}
                                className="text-red-400"
                              />
                            )}

                            <div>
                              <p className="text-sm font-medium">
                                {item.skill}
                              </p>

                              <p className="mt-1 text-xs text-gray-600">
                                {item.importance} priority
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`rounded-full px-3 py-1.5 text-xs ${
                                item.status ===
                                "matched"
                                  ? "bg-green-500/10 text-green-400"
                                  : item.status ===
                                    "partial"
                                  ? "bg-yellow-500/10 text-yellow-400"
                                  : "bg-red-500/10 text-red-400"
                              }`}
                            >
                              {item.status}
                            </span>

                            <span className="text-xs text-gray-500">
                              {item.action}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Resume */}
                <div className="rounded-xl border border-white/10 bg-black/10 p-5">
                  <p className="text-xs uppercase tracking-widest text-gray-600">
                    Resume Used
                  </p>

                  <p className="mt-2 text-sm text-gray-300">
                    {analysis.resume.fileName}
                  </p>
                </div>
              </div>
            )}

          {/* Bottom Button */}
          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-600">
                {activeTab === "popular"
                  ? "Selected Role"
                  : "Custom Analysis"}
              </p>

              <p className="mt-1 text-sm text-gray-300">
                {activeTab === "popular"
                  ? selectedRole
                  : analysis
                  ? "Analysis completed"
                  : "Job description"}
              </p>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={
                activeTab === "popular"
                  ? handlePopularContinue
                  : handleCustomAnalysis
              }
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 text-sm font-semibold disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Analyzing...
                </>
              ) : activeTab === "popular" ? (
                <>
                  Continue
                  <ArrowRight size={17} />
                </>
              ) : (
                <>
                  Analyze Job Description
                  <Sparkles size={17} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <Brain
              size={20}
              className="text-violet-400"
            />

            <h3 className="mt-4 font-semibold">
              Resume Analysis
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Your latest analyzed resume is used
              for comparison.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <Code2
              size={20}
              className="text-blue-400"
            />

            <h3 className="mt-4 font-semibold">
              Skill Comparison
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Required skills are compared with
              your existing skills.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <Target
              size={20}
              className="text-cyan-400"
            />

            <h3 className="mt-4 font-semibold">
              Career Roadmap
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Missing skills can become your
              personalized learning roadmap.
            </p>
          </div>
        </div>
        {/* Build Custom Roadmap Button */}
<div className="mt-6 flex justify-end">
  <button
    type="button"
    onClick={async () => {
      if (!analysis) return;

      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/custom-roadmap", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            skills: analysis.skills,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to generate roadmap."
          );
        }

        sessionStorage.setItem(
          "customRoadmap",
          JSON.stringify(result)
        );

        router.push("/dashboard/roadmap?custom=true");
      } catch (err) {
        console.error("CUSTOM_ROADMAP_ERROR:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to generate roadmap."
        );
      } finally {
        setLoading(false);
      }
    }}
    disabled={loading}
    className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60"
  >
    Build Custom Roadmap
    <ArrowRight size={16} />
  </button>
</div>
      </div>
    </div>
  );
}
