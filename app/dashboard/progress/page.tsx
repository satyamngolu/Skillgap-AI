"use client";

import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Code2,
  Loader2,
  RefreshCw,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type CompletedSkill = string;

type RemainingSkill = {
  skill: string;
  status: "missing" | "partial";
  importance: "High" | "Medium" | "Low";
};

type ProgressResponse = {
  message: string;
  role: {
    name: string;
    description: string;
  };
  resume: {
    id: string;
    fileName: string;
  };
  summary: {
    totalSteps: number;
    completedSteps: number;
    remainingSteps: number;
    progressPercentage: number;
  };
  completedSkills: CompletedSkill[];
  remainingSkills: RemainingSkill[];
};

type CustomRoadmapItem = {
  order: number;
  skill: string;
  status: "missing" | "partial";
  importance: "High" | "Medium" | "Low";
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  topics: string[];
  project: string;
  resources: {
    title: string;
    type: "Documentation" | "Practice" | "Course";
    url: string;
  }[];
};

type CustomRoadmapStorage = {
  message?: string;
  summary?: {
    totalSteps?: number;
    missingSkills?: number;
    partialSkills?: number;
    estimatedDays?: number;
  };
  roadmap?: CustomRoadmapItem[];
  resume?: {
    id: string;
    fileName: string;
  };
};

const JOB_ROLES = [
  "AI/ML Engineer",
  "Data Scientist",
  "Backend Developer",
  "Frontend Developer",
  "Data Analyst",
  "Full Stack Developer",
];

function buildCustomRoadmapKey(roadmap: CustomRoadmapItem[]) {
  return `CUSTOM_JD:${roadmap
    .map((item) => item.skill)
    .sort()
    .join("|")}`;
}

function ProgressContent() {
  const searchParams = useSearchParams();

  const isCustom = searchParams.get("custom") === "true";

  const roleParam = searchParams.get("role");

  const selectedRole =
    roleParam && JOB_ROLES.includes(roleParam)
      ? roleParam
      : "AI/ML Engineer";

  const [data, setData] = useState<ProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProgress = async () => {
    try {
      setLoading(true);
      setError("");

      // Custom Job Description roadmap progress
      if (isCustom) {
        const stored = sessionStorage.getItem("customRoadmap");

        if (!stored) {
          throw new Error(
            "Custom roadmap not found. Please build the custom roadmap again."
          );
        }

        let parsed: CustomRoadmapStorage;

        try {
          parsed = JSON.parse(stored);
        } catch {
          throw new Error(
            "Saved custom roadmap is invalid. Please build it again."
          );
        }

        const roadmap = Array.isArray(parsed.roadmap)
          ? parsed.roadmap
          : [];

        if (roadmap.length === 0) {
          throw new Error(
            "Custom roadmap is empty. Please analyze the job description again."
          );
        }

        const customRoadmapKey = buildCustomRoadmapKey(roadmap);
        let savedCompletedSkills: string[] = [];

        try {
          const progressResponse = await fetch(
            `/api/roadmap/progress?role=${encodeURIComponent(
              customRoadmapKey
            )}`,
            {
              method: "GET",
              cache: "no-store",
            }
          );

          const progressResult = await progressResponse.json();

          if (progressResponse.ok) {
            savedCompletedSkills = Array.isArray(
              progressResult.completedSkills
            )
              ? progressResult.completedSkills
              : [];
          }
        } catch (progressError) {
          console.error(
            "CUSTOM_PROGRESS_LOAD_ERROR:",
            progressError
          );
        }

        const roadmapSkillSet = new Set(
          roadmap.map((item) => item.skill)
        );

        const completedSkills = savedCompletedSkills.filter((skill) =>
          roadmapSkillSet.has(skill)
        );

        const remainingItems = roadmap.filter(
          (item) => !completedSkills.includes(item.skill)
        );

        const customData: ProgressResponse = {
          message:
            parsed.message ||
            "Custom roadmap progress loaded successfully.",
          role: {
            name: "Custom Job Description",
            description:
              "Progress for the personalized roadmap generated from your custom job description.",
          },
          resume: parsed.resume || {
            id: "",
            fileName: "Latest analyzed resume",
          },
          summary: {
            totalSteps: roadmap.length,
            completedSteps: completedSkills.length,
            remainingSteps: remainingItems.length,
            progressPercentage:
              roadmap.length === 0
                ? 0
                : Math.round(
                    (completedSkills.length / roadmap.length) * 100
                  ),
          },
          completedSkills,
          remainingSkills: remainingItems.map((item) => ({
            skill: item.skill,
            status: item.status,
            importance: item.importance,
          })),
        };

        setData(customData);
        return;
      }

      // Normal role-based progress
      const response = await fetch(
        `/api/progress?role=${encodeURIComponent(selectedRole)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load progress."
        );
      }

      setData(result);
    } catch (error) {
      console.error("PROGRESS_PAGE_ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load progress."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgress();
  }, [selectedRole, isCustom]);

  const handleRoleChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const role = event.target.value;

    window.location.href =
      `/dashboard/progress?role=${encodeURIComponent(role)}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b1a] text-white">
        <div className="text-center">
          <Loader2
            size={40}
            className="mx-auto animate-spin text-violet-400"
          />
          <p className="mt-4 text-sm text-gray-400">
            {isCustom
              ? "Loading your custom roadmap progress..."
              : "Loading your progress..."}
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#070b1a] p-6 text-white lg:p-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <CircleAlert
              size={42}
              className="mx-auto text-red-400"
            />
            <h1 className="mt-5 text-xl font-semibold">
              Progress Unavailable
            </h1>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              {error || "Unable to load progress."}
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={loadProgress}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
              <Link
                href="/dashboard/job-roles"
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-gray-300"
              >
                {isCustom ? "Analyze Job Description" : "Choose Job Role"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const percentage = data.summary.progressPercentage;

  return (
    <div className="min-h-screen bg-[#070b1a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
            <div>
              <div className="flex items-center gap-2 text-sm text-violet-400">
                <Trophy size={16} />
                Learning Progress
              </div>
              <h1 className="mt-2 text-2xl font-bold md:text-3xl">
                Your Progress
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                {isCustom
                  ? "Track your progress through the custom roadmap generated from the job description."
                  : "Track your completed learning steps for your target role."}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {!isCustom && (
                <select
                  value={data.role.name}
                  onChange={handleRoleChange}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-gray-200 outline-none focus:border-violet-500/50"
                >
                  {JOB_ROLES.map((role) => (
                    <option
                      key={role}
                      value={role}
                      className="bg-[#10162b] text-white"
                    >
                      {role}
                    </option>
                  ))}
                </select>
              )}

              <Link
                href={
                  isCustom
                    ? "/dashboard/roadmap?custom=true"
                    : `/dashboard/roadmap?role=${encodeURIComponent(
                        data.role.name
                      )}`
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-semibold"
              >
                Continue Learning
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 p-6 lg:p-8">
        {/* Target Role */}
        <section className="rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-blue-500/5 p-6">
          <div className="flex items-center gap-3">
            <Target size={21} className="text-violet-400" />
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500">
                {isCustom ? "Custom Roadmap" : "Target Role"}
              </p>
              <h2 className="mt-1 text-2xl font-bold">
                {data.role.name}
              </h2>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-400">
            {data.role.description}
          </p>
        </section>

        {/* Main Progress */}
        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Percentage */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Overall Progress</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Based on your roadmap
                </p>
              </div>
              <Trophy size={18} className="text-violet-400" />
            </div>

            <div className="mt-8 flex justify-center">
              <div
                className="relative flex h-52 w-52 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(rgb(139 92 246) ${percentage}%, rgba(255,255,255,0.07) ${percentage}% 100%)`,
                }}
              >
                <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full bg-[#0b1022]">
                  <span className="text-5xl font-bold">
                    {percentage}%
                  </span>
                  <span className="mt-2 text-sm text-gray-500">
                    Completed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
                <BookOpenIcon />
              </div>
              <p className="mt-5 text-3xl font-bold">
                {data.summary.totalSteps}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Total Learning Steps
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10">
                <CheckCircle2
                  size={21}
                  className="text-green-400"
                />
              </div>
              <p className="mt-5 text-3xl font-bold">
                {data.summary.completedSteps}
              </p>
              <p className="mt-1 text-sm text-gray-500">Completed</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/10">
                <CircleAlert
                  size={21}
                  className="text-yellow-400"
                />
              </div>
              <p className="mt-5 text-3xl font-bold">
                {data.summary.remainingSteps}
              </p>
              <p className="mt-1 text-sm text-gray-500">Remaining</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                <Code2 size={21} className="text-blue-400" />
              </div>
              <p className="mt-5 text-lg font-semibold">
                {data.resume.fileName}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Resume used for analysis
              </p>
            </div>
          </div>
        </section>

        {/* Progress Bar */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Learning Completion</h2>
              <p className="mt-1 text-sm text-gray-500">
                {data.summary.completedSteps} of {data.summary.totalSteps} steps completed
              </p>
            </div>
            <span className="font-semibold text-violet-400">
              {percentage}%
            </span>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-blue-600 transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </section>

        {/* Completed Skills */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Completed Skills</h2>
              <p className="mt-1 text-sm text-gray-500">
                Skills you have marked as completed.
              </p>
            </div>
            <span className="rounded-full bg-green-500/10 px-3 py-1.5 text-xs text-green-400">
              {data.completedSkills.length} completed
            </span>
          </div>

          {data.completedSkills.length === 0 ? (
            <div className="mt-6 rounded-xl border border-white/10 bg-black/10 p-6 text-center">
              <p className="text-sm text-gray-500">
                No skills completed yet.
              </p>
              <Link
                href={
                  isCustom
                    ? "/dashboard/roadmap?custom=true"
                    : `/dashboard/roadmap?role=${encodeURIComponent(
                        data.role.name
                      )}`
                }
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-violet-400"
              >
                Start Learning
                <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {data.completedSkills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-3 rounded-xl border border-green-500/10 bg-green-500/5 p-4"
                >
                  <CheckCircle2
                    size={18}
                    className="text-green-400"
                  />
                  <span className="text-sm font-medium">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Remaining Skills */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Remaining Skills</h2>
              <p className="mt-1 text-sm text-gray-500">
                Continue these skills to complete your roadmap.
              </p>
            </div>
            <span className="rounded-full bg-red-500/10 px-3 py-1.5 text-xs text-red-400">
              {data.remainingSkills.length} remaining
            </span>
          </div>

          {data.remainingSkills.length === 0 ? (
            <div className="mt-6 rounded-xl border border-green-500/10 bg-green-500/5 p-6 text-center">
              <Trophy
                size={30}
                className="mx-auto text-green-400"
              />
              <p className="mt-3 font-medium text-green-400">
                All roadmap skills completed!
              </p>
              <p className="mt-2 text-sm text-gray-500">
                You have completed every learning step in this roadmap.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {data.remainingSkills.map((item) => (
                <div
                  key={item.skill}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-white/10 bg-black/10 p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-3">
                    <XCircle size={18} className="text-red-400" />
                    <div>
                      <p className="text-sm font-medium">
                        {item.skill}
                      </p>
                      <p className="mt-1 text-xs text-gray-600">
                        {item.status} · {item.importance} priority
                      </p>
                    </div>
                  </div>

                  <Link
                    href={
                      isCustom
                        ? "/dashboard/roadmap?custom=true"
                        : `/dashboard/roadmap?role=${encodeURIComponent(
                            data.role.name
                          )}`
                    }
                    className="inline-flex items-center gap-2 text-xs font-medium text-violet-400"
                  >
                    Continue
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Completion */}
        {percentage === 100 && (
          <section className="rounded-2xl border border-green-500/20 bg-green-500/5 p-8 text-center">
            <Trophy
              size={42}
              className="mx-auto text-green-400"
            />
            <h2 className="mt-4 text-2xl font-bold">
              Roadmap Completed!
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              You completed all roadmap steps.
            </p>
            {isCustom && (
              <Link
                href="/dashboard/job-roles"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-500"
              >
                Analyze Another Job
                <ArrowRight size={15} />
              </Link>
            )}
          </section>
        )}

        {/* Footer */}
        <div className="pb-4 text-center text-xs text-gray-600">
          {isCustom
            ? "Progress is saved against your custom job-description roadmap and your latest analyzed resume."
            : "Progress is based on your saved roadmap completion data and latest analyzed resume."}
        </div>
      </main>
    </div>
  );
}

function BookOpenIcon() {
  return (
    <div className="text-violet-400">
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a4 4 0 0 0-4-4H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a4 4 0 0 1 4-4h6z" />
      </svg>
    </div>
  );
}

export default function ProgressPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#070b1a]">
          <Loader2
            size={36}
            className="animate-spin text-violet-400"
          />
        </div>
      }
    >
      <ProgressContent />
    </Suspense>
  );
}
