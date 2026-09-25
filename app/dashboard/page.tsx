"use client";

import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Code2,
  FileText,
  Loader2,
  RefreshCw,
  Target,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

type SkillGapItem = {
  skill: string;
  status: "matched" | "partial" | "missing";
  importance: "High" | "Medium" | "Low";
  action: string;
};

type SkillGapResponse = {
  role: {
    name: string;
    description: string;
  };
  resume: {
    id: string;
    fileName: string;
  };
  summary: {
    totalSkills: number;
    matched: number;
    partial: number;
    missing: number;
    readinessScore: number;
  };
  skills: SkillGapItem[];
};

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
  completedSkills: string[];
  remainingSkills: RemainingSkill[];
};

const JOB_ROLES = [
  "AI/ML Engineer",
  "Data Scientist",
  "Backend Developer",
  "Frontend Developer",
  "Data Analyst",
  "Full Stack Developer",
];

function getSkillWidth(status: SkillGapItem["status"]) {
  if (status === "matched") return "100%";
  if (status === "partial") return "50%";
  return "8%";
}

function getStatusClass(status: SkillGapItem["status"]) {
  if (status === "matched") {
    return "bg-green-500/10 text-green-400";
  }

  if (status === "partial") {
    return "bg-yellow-500/10 text-yellow-400";
  }

  return "bg-red-500/10 text-red-400";
}

function getBarClass(status: SkillGapItem["status"]) {
  if (status === "matched") return "bg-green-400";
  if (status === "partial") return "bg-yellow-400";
  return "bg-red-400";
}

function getProgressStatus(item: RemainingSkill) {
  return item.status === "partial" ? 50 : 8;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");

  const requestedRole =
    roleParam && JOB_ROLES.includes(roleParam) ? roleParam : null;

  const [progressData, setProgressData] =
    useState<ProgressResponse | null>(null);

  const [skillGapData, setSkillGapData] =
    useState<SkillGapResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const progressUrl = requestedRole
        ? `/api/progress?role=${encodeURIComponent(requestedRole)}`
        : "/api/progress";

      const progressResponse = await fetch(progressUrl, {
        method: "GET",
        cache: "no-store",
      });

      const progressResult = await progressResponse.json();

      if (!progressResponse.ok) {
        throw new Error(
          progressResult.message || "Failed to load dashboard progress."
        );
      }

      setProgressData(progressResult);

      const roleName = progressResult.role?.name;

      if (!roleName) {
        setSkillGapData(null);
        return;
      }

      try {
        const skillGapResponse = await fetch(
          `/api/skill-gap?role=${encodeURIComponent(roleName)}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const skillGapResult = await skillGapResponse.json();

        if (skillGapResponse.ok) {
          setSkillGapData(skillGapResult);
        } else {
          setSkillGapData(null);
        }
      } catch (skillGapError) {
        console.error("DASHBOARD_SKILL_GAP_ERROR:", skillGapError);
        setSkillGapData(null);
      }
    } catch (dashboardError) {
      console.error("DASHBOARD_ERROR:", dashboardError);

      setError(
        dashboardError instanceof Error
          ? dashboardError.message
          : "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedRole]);

  const visibleSkills = useMemo(() => {
    if (!skillGapData?.skills) return [];

    return skillGapData.skills.slice(0, 5);
  }, [skillGapData]);

  const roadmapPreview = useMemo(() => {
    if (!progressData) return [];

    const completed = progressData.completedSkills.slice(0, 2).map((skill) => ({
      skill,
      status: "completed" as const,
      importance: "Completed",
    }));

    const remaining = progressData.remainingSkills.slice(0, 4).map((item) => ({
      skill: item.skill,
      status: item.status,
      importance: item.importance,
    }));

    return [...completed, ...remaining].slice(0, 4);
  }, [progressData]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b1a] text-white">
        <div className="text-center">
          <Loader2
            size={40}
            className="mx-auto animate-spin text-violet-400"
          />
          <p className="mt-4 text-sm text-gray-400">
            Loading your career dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error || !progressData) {
    return (
      <div className="min-h-screen bg-[#070b1a] p-6 text-white lg:p-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <CircleAlert
              size={42}
              className="mx-auto text-red-400"
            />

            <h1 className="mt-5 text-xl font-semibold">
              Dashboard Unavailable
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              {error || "Unable to load your dashboard data."}
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={loadDashboard}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white"
              >
                <RefreshCw size={16} />
                Try Again
              </button>

              <Link
                href="/dashboard/job-roles"
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-gray-300"
              >
                Choose Job Role
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const roleName = progressData.role.name;
  const skillCoverage =
    skillGapData?.summary.readinessScore ??
    progressData.summary.progressPercentage;

  const roadmapPercentage = progressData.summary.progressPercentage;
  const totalSkills = skillGapData?.summary.totalSkills ?? 0;
  const matchedSkills = skillGapData?.summary.matched ?? 0;
  const missingSkills = skillGapData?.summary.missing ?? 0;
  const partialSkills = skillGapData?.summary.partial ?? 0;

  const totalSteps = progressData.summary.totalSteps;
  const completedSteps = progressData.summary.completedSteps;
  const remainingSteps = progressData.summary.remainingSteps;

  return (
    <div className="min-h-screen bg-[#070b1a] text-white">
      {/* Header */}
      <header className="flex min-h-20 items-center justify-between gap-5 border-b border-white/10 px-6 py-5 lg:px-8">
        <div>
          <p className="text-sm text-gray-500">Dashboard</p>

          <h1 className="mt-1 text-xl font-semibold text-white md:text-2xl">
            Welcome back 👋
          </h1>

          <p className="mt-1 text-xs text-gray-600">
            Your career progress is updated from your saved resume and roadmap.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/resume-analyzer"
            className="hidden rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white sm:block"
          >
            Analyze Resume
          </Link>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/15 text-sm font-semibold text-violet-300">
            SG
          </div>
        </div>
      </header>

      <div className="space-y-8 p-6 lg:p-8">
        {/* Intro */}
        <section>
          <p className="text-gray-400">
            Here&apos;s your live overview for{" "}
            <span className="font-medium text-violet-300">
              {roleName}
            </span>
            .
          </p>
        </section>

        {/* Dynamic Stats */}
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {/* Skill Coverage */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Skill Coverage</p>

                <p className="mt-2 text-3xl font-bold text-white">
                  {skillCoverage}%
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                <Target size={18} className="text-violet-400" />
              </div>
            </div>

            <div className="mt-4 h-1.5 rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
                style={{ width: `${skillCoverage}%` }}
              />
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Based on your latest skill-gap analysis
            </p>
          </div>

          {/* Completed Skills */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed Skills</p>

                <p className="mt-2 text-3xl font-bold text-white">
                  {completedSteps}
                  <span className="text-lg text-gray-500">
                    /{totalSteps}
                  </span>
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                <CheckCircle2 size={18} className="text-green-400" />
              </div>
            </div>

            <p className="mt-5 text-xs text-green-400">
              {remainingSteps} roadmap step{remainingSteps === 1 ? "" : "s"} remaining
            </p>
          </div>

          {/* Roadmap Progress */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Roadmap Progress</p>

                <p className="mt-2 text-3xl font-bold text-white">
                  {roadmapPercentage}%
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                <Trophy size={18} className="text-blue-400" />
              </div>
            </div>

            <div className="mt-4 h-1.5 rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
                style={{ width: `${roadmapPercentage}%` }}
              />
            </div>

            <p className="mt-3 text-xs text-gray-500">
              {completedSteps} of {totalSteps} learning steps completed
            </p>
          </div>

          {/* Target Role */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Target Role</p>

                <p className="mt-2 truncate text-xl font-bold text-white">
                  {roleName}
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
                <TrendingUpIcon />
              </div>
            </div>

            <Link
              href="/dashboard/job-roles"
              className="mt-5 inline-flex items-center gap-1 text-xs text-blue-400"
            >
              Change role
              <ArrowRight size={13} />
            </Link>
          </div>
        </section>

        {/* Main Grid */}
        <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          {/* Skill Gap Overview */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Skill Gap Overview
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your current skills against your target role
                </p>
              </div>

              <Link
                href={`/dashboard/skill-gap?role=${encodeURIComponent(roleName)}`}
                className="text-sm text-violet-400 hover:text-violet-300"
              >
                View details
              </Link>
            </div>

            {skillGapData ? (
              <div className="mt-8 grid gap-8 md:grid-cols-[170px_1fr] md:items-center">
                {/* Circle */}
                <div
                  className="mx-auto flex h-40 w-40 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(rgb(139 92 246) ${skillCoverage}%, rgba(255,255,255,0.07) ${skillCoverage}% 100%)`,
                  }}
                >
                  <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-[#0b1022] text-center">
                    <p className="text-3xl font-bold text-white">
                      {totalSkills}
                    </p>
                    <p className="text-xs text-gray-500">Total Skills</p>
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-5">
                  {visibleSkills.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No skill-gap data available yet.
                    </p>
                  ) : (
                    visibleSkills.map((skill) => (
                      <div key={skill.skill}>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="text-sm text-gray-300">
                            {skill.skill}
                          </span>

                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] ${getStatusClass(
                              skill.status
                            )}`}
                          >
                            {skill.status}
                          </span>
                        </div>

                        <div className="h-2 rounded-full bg-white/10">
                          <div
                            className={`h-full rounded-full ${getBarClass(
                              skill.status
                            )}`}
                            style={{
                              width: getSkillWidth(skill.status),
                            }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-8 rounded-xl border border-white/10 bg-black/10 p-6 text-center">
                <p className="text-sm text-gray-500">
                  Complete a resume analysis to populate your skill gap.
                </p>

                <Link
                  href="/dashboard/resume-analyzer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-violet-400"
                >
                  Analyze Resume
                  <ArrowRight size={15} />
                </Link>
              </div>
            )}

            {skillGapData && (
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-green-500/10 bg-green-500/5 p-4">
                  <p className="text-2xl font-bold text-green-400">
                    {matchedSkills}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Matched skills
                  </p>
                </div>

                <div className="rounded-xl border border-yellow-500/10 bg-yellow-500/5 p-4">
                  <p className="text-2xl font-bold text-yellow-400">
                    {partialSkills}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Partial skills
                  </p>
                </div>

                <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-4">
                  <p className="text-2xl font-bold text-red-400">
                    {missingSkills}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Missing skills
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Resume + Quick Actions */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Career Actions
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Continue from where you left off.
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-blue-500/10 bg-blue-500/5 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                  <FileText size={18} className="text-blue-400" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">
                    Latest Resume
                  </p>

                  <p className="mt-1 truncate text-sm text-gray-400">
                    {progressData.resume.fileName}
                  </p>

                  <p className="mt-2 text-xs text-gray-600">
                    Used for your current skill analysis
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <Link
                href={`/dashboard/roadmap?role=${encodeURIComponent(roleName)}`}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-gray-300 transition hover:bg-white/[0.04] hover:text-white"
              >
                <span>Continue Roadmap</span>
                <ArrowRight size={15} />
              </Link>

              <Link
                href={`/dashboard/progress?role=${encodeURIComponent(roleName)}`}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-gray-300 transition hover:bg-white/[0.04] hover:text-white"
              >
                <span>View Progress</span>
                <ArrowRight size={15} />
              </Link>

              <Link
                href="/dashboard/job-roles"
                className="flex items-center justify-between rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-gray-300 transition hover:bg-white/[0.04] hover:text-white"
              >
                <span>Analyze Another Role</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>

        {/* Learning Roadmap */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Your Learning Roadmap
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Keep moving toward your {roleName} goal.
              </p>
            </div>

            <Link
              href={`/dashboard/roadmap?role=${encodeURIComponent(roleName)}`}
              className="inline-flex items-center gap-2 text-sm text-violet-400"
            >
              Open roadmap
              <ArrowRight size={15} />
            </Link>
          </div>

          {roadmapPreview.length === 0 ? (
            <div className="mt-8 rounded-xl border border-white/10 bg-black/10 p-6 text-center">
              <p className="text-sm text-gray-500">
                Your roadmap will appear here after skill analysis.
              </p>
              <Link
                href={`/dashboard/roadmap?role=${encodeURIComponent(roleName)}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-violet-400"
              >
                Open Roadmap
                <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 lg:grid-cols-4">
              {roadmapPreview.map((item, index) => {
                const completed = item.status === "completed";
                const partial =
                  item.status === "partial" && !completed;

                const width = completed
                  ? "100%"
                  : partial
                    ? "50%"
                    : `${getProgressStatus(item)}%`;

                return (
                  <div
                    key={`${item.skill}-${index}`}
                    className={`rounded-xl border p-5 ${
                      completed
                        ? "border-green-500/20 bg-green-500/5"
                        : "border-white/10 bg-black/10"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-gray-500">
                        Step {index + 1}
                      </span>

                      <span
                        className={`rounded-full px-2 py-1 text-[10px] ${
                          completed
                            ? "bg-green-500/10 text-green-400"
                            : partial
                              ? "bg-yellow-500/10 text-yellow-400"
                              : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {completed
                          ? "Completed"
                          : item.status}
                      </span>
                    </div>

                    <h3 className="mt-4 line-clamp-2 font-medium text-white">
                      {item.skill}
                    </h3>

                    {!completed && (
                      <p className="mt-2 text-xs text-gray-600">
                        {item.importance} priority
                      </p>
                    )}

                    <div className="mt-4 h-1.5 rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full ${
                          completed
                            ? "bg-green-400"
                            : "bg-gradient-to-r from-violet-500 to-blue-500"
                        }`}
                        style={{ width }}
                      />
                    </div>

                    <p className="mt-2 text-xs text-gray-500">
                      {completed
                        ? "Completed"
                        : partial
                          ? "Partial skill"
                          : "Needs learning"}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Footer */}
        <div className="pb-4 text-center text-xs text-gray-600">
          Dashboard data is generated from your latest analyzed resume,
          target role, skill-gap analysis, and saved roadmap progress.
        </div>
      </div>
    </div>
  );
}

function TrendingUpIcon() {
  return (
    <div className="text-cyan-400">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    </div>
  );
}

export default function DashboardPage() {
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
      <DashboardContent />
    </Suspense>
  );
}
