"use client";

import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Info,
  Loader2,
  Search,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

type SkillStatus = "matched" | "partial" | "missing";
type FilterType = "all" | SkillStatus;

type SkillItem = {
  skill: string;
  status: SkillStatus;
  importance: "High" | "Medium" | "Low";
  action: string;
};

type SkillGapResponse = {
  message: string;
  role: {
    name: string;
    description: string;
  };
  resume: {
    id: string;
    fileName: string;
    skills: string[];
  };
  summary: {
    totalSkills: number;
    matched: number;
    partial: number;
    missing: number;
    readinessScore: number;
  };
  skills: SkillItem[];
};

const JOB_ROLES = [
  "AI/ML Engineer",
  "Data Scientist",
  "Backend Developer",
  "Frontend Developer",
  "Data Analyst",
  "Full Stack Developer",
];

function SkillGapContent() {
  const searchParams = useSearchParams();

  const roleFromUrl =
    searchParams.get("role") || "AI/ML Engineer";

  const [selectedRole, setSelectedRole] =
    useState(roleFromUrl);

  const [data, setData] =
    useState<SkillGapResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [activeFilter, setActiveFilter] =
    useState<FilterType>("all");

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setSelectedRole(roleFromUrl);
  }, [roleFromUrl]);

  useEffect(() => {
    const fetchSkillGap = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/skill-gap?role=${encodeURIComponent(
            roleFromUrl
          )}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const rawResponse = await response.text();

        let result: SkillGapResponse | { message?: string };

        try {
          result = JSON.parse(rawResponse);
        } catch {
          throw new Error(
            "Server returned an invalid response."
          );
        }

        if (!response.ok) {
          throw new Error(
            "message" in result && result.message
              ? result.message
              : "Failed to generate skill gap analysis."
          );
        }

        setData(result as SkillGapResponse);
      } catch (err) {
        console.error("SKILL_GAP_ERROR:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading the analysis."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSkillGap();
  }, [roleFromUrl]);

  const filteredSkills = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.skills.filter((skill) => {
      const matchesFilter =
        activeFilter === "all" ||
        skill.status === activeFilter;

      const matchesSearch =
        skill.skill
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [data, activeFilter, searchTerm]);

  const handleRoleChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newRole = event.target.value;

    window.location.href = `/dashboard/skill-gap?role=${encodeURIComponent(
      newRole
    )}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b1a] text-white">
        <div className="border-b border-white/10 px-6 py-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-2 text-sm text-violet-400">
              <Sparkles size={16} />
              AI Career Analysis
            </div>

            <h1 className="mt-2 text-2xl font-bold md:text-3xl">
              Skill Gap Analysis
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Analyzing your resume against your target role...
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-8">
          <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="text-center">
              <Loader2
                size={40}
                className="mx-auto animate-spin text-violet-400"
              />

              <p className="mt-4 text-sm text-gray-400">
                Generating your personalized analysis...
              </p>

              <p className="mt-2 text-xs text-gray-600">
                Target role: {selectedRole}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#070b1a] p-6 text-white lg:p-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <XCircle
              size={42}
              className="mx-auto text-red-400"
            />

            <h1 className="mt-5 text-xl font-semibold">
              Unable to load Skill Gap Analysis
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              {error ||
                "No analysis data was returned."}
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold transition hover:bg-violet-500"
              >
                Try Again
              </button>

              <Link
                href="/dashboard/job-roles"
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/5 hover:text-white"
              >
                Choose Another Role
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const readinessScore = data.summary.readinessScore;

  return (
    <div className="min-h-screen bg-[#070b1a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-violet-400">
                <Sparkles size={16} />
                AI Career Analysis
              </div>

              <h1 className="mt-2 text-2xl font-bold md:text-3xl">
                Skill Gap Analysis
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                See how your current skills compare with
                the skills required for your target role.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Role selector */}
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

              <Link
                href={`/dashboard/roadmap?role=${encodeURIComponent(
                  data.role.name
                )}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-semibold transition hover:scale-[1.02]"
              >
                Build My Roadmap
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 p-6 lg:p-8">
        {/* Target Role */}
        <section className="rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-blue-500/5 p-6">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500">
                Target Role
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {data.role.name}
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                {data.role.description}
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3">
              <Target
                size={19}
                className="text-violet-400"
              />

              <div>
                <p className="text-xs text-gray-500">
                  Requirements analyzed
                </p>

                <p className="font-semibold text-white">
                  {data.summary.totalSkills} skills
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Score + Summary */}
        <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Readiness Score */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">
                  Career Readiness
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Based on your current resume skills
                </p>
              </div>

              <Info
                size={17}
                className="text-gray-500"
              />
            </div>

            <div className="mt-8 flex justify-center">
              <div
                className="relative flex h-56 w-56 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(rgb(139 92 246) ${readinessScore}%, rgba(255,255,255,0.07) ${readinessScore}% 100%)`,
                }}
              >
                <div className="flex h-44 w-44 flex-col items-center justify-center rounded-full bg-[#0b1022]">
                  <p className="text-5xl font-bold">
                    {readinessScore}%
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Readiness Score
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-green-500/5 p-4 text-center">
                <p className="text-2xl font-bold text-green-400">
                  {data.summary.matched}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Matched
                </p>
              </div>

              <div className="rounded-xl bg-yellow-500/5 p-4 text-center">
                <p className="text-2xl font-bold text-yellow-400">
                  {data.summary.partial}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Partial
                </p>
              </div>

              <div className="rounded-xl bg-red-500/5 p-4 text-center">
                <p className="text-2xl font-bold text-red-400">
                  {data.summary.missing}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Missing
                </p>
              </div>
            </div>
          </div>

          {/* Analysis Summary */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="font-semibold">
              AI Analysis Summary
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              What SkillGap-AI found from your profile
            </p>

            <div className="mt-7 space-y-4">
              <div className="rounded-xl border border-green-500/10 bg-green-500/5 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0 text-green-400"
                  />

                  <div>
                    <p className="font-medium text-white">
                      Existing skill foundation
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-400">
                      You currently match{" "}
                      <span className="font-medium text-green-400">
                        {data.summary.matched}
                      </span>{" "}
                      of the analyzed requirements.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-yellow-500/10 bg-yellow-500/5 p-4">
                <div className="flex items-start gap-3">
                  <CircleAlert
                    size={19}
                    className="mt-0.5 shrink-0 text-yellow-400"
                  />

                  <div>
                    <p className="font-medium text-white">
                      Skills that need improvement
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-400">
                      {data.summary.partial} skills have
                      partial coverage and may need stronger
                      practical evidence or deeper knowledge.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-4">
                <div className="flex items-start gap-3">
                  <XCircle
                    size={19}
                    className="mt-0.5 shrink-0 text-red-400"
                  />

                  <div>
                    <p className="font-medium text-white">
                      Important gaps identified
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-400">
                      {data.summary.missing} skills are
                      currently missing from your analyzed
                      resume and should be considered for your
                      learning roadmap.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resume Skills */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-lg font-semibold">
                Skills Detected in Your Resume
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Extracted from: {data.resume.fileName}
              </p>
            </div>

            <span className="rounded-full bg-violet-500/10 px-3 py-1.5 text-xs text-violet-400">
              {data.resume.skills.length} detected
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {data.resume.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-gray-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Skill Table */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-semibold">
                Skill-by-Skill Analysis
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Compare every required skill for{" "}
                {data.role.name}.
              </p>
            </div>

            <div className="relative w-full lg:w-72">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search skills..."
                className="w-full rounded-xl border border-white/10 bg-black/20 py-2.5 pl-9 pr-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-violet-500/50"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-wrap gap-2">
            {(
              [
                ["all", "All"],
                ["matched", "Matched"],
                ["partial", "Partial"],
                ["missing", "Missing"],
              ] as [FilterType, string][]
            ).map(([filter, label]) => (
              <button
                key={filter}
                type="button"
                onClick={() =>
                  setActiveFilter(filter)
                }
                className={`rounded-lg px-4 py-2 text-xs font-medium transition ${
                  activeFilter === filter
                    ? "bg-violet-600 text-white"
                    : "border border-white/10 bg-white/[0.03] text-gray-400 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Skills */}
          <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
            {filteredSkills.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Search
                  size={28}
                  className="mx-auto text-gray-600"
                />

                <p className="mt-3 text-sm text-gray-500">
                  No skills found.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {filteredSkills.map((skill) => {
                  const isMatched =
                    skill.status === "matched";

                  const isPartial =
                    skill.status === "partial";

                  return (
                    <div
                      key={skill.skill}
                      className="flex flex-col gap-4 p-5 transition hover:bg-white/[0.02] md:flex-row md:items-center md:justify-between"
                    >
                      <div className="flex items-start gap-3">
                        {isMatched && (
                          <CheckCircle2
                            size={19}
                            className="mt-0.5 shrink-0 text-green-400"
                          />
                        )}

                        {isPartial && (
                          <CircleAlert
                            size={19}
                            className="mt-0.5 shrink-0 text-yellow-400"
                          />
                        )}

                        {!isMatched && !isPartial && (
                          <XCircle
                            size={19}
                            className="mt-0.5 shrink-0 text-red-400"
                          />
                        )}

                        <div>
                          <p className="font-medium text-white">
                            {skill.skill}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            Importance:{" "}
                            <span className="text-gray-400">
                              {skill.importance}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                            isMatched
                              ? "bg-green-500/10 text-green-400"
                              : isPartial
                              ? "bg-yellow-500/10 text-yellow-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {skill.status}
                        </span>

                        <span className="min-w-20 text-right text-xs text-gray-500">
                          {skill.action}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Recommendation */}
        <section className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles
                  size={18}
                  className="text-violet-400"
                />

                <h2 className="text-lg font-semibold">
                  Recommended Next Step
                </h2>
              </div>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
                Your missing and partially matched skills can
                now be converted into a personalized learning
                roadmap.
              </p>
            </div>

            <Link
              href={`/dashboard/roadmap?role=${encodeURIComponent(
                data.role.name
              )}`}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#070b1a] transition hover:bg-gray-200"
            >
              View Roadmap
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Footer information */}
        <div className="flex flex-col items-center justify-center gap-2 pb-4 text-xs text-gray-600 md:flex-row">
          <Clock3 size={14} />
          <span>
            Analysis generated from your latest completed
            resume and selected target role.
          </span>
        </div>
      </main>
    </div>
  );
}

export default function SkillGapPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#070b1a] text-white">
          <Loader2
            size={36}
            className="animate-spin text-violet-400"
          />
        </div>
      }
    >
      <SkillGapContent />
    </Suspense>
  );
}