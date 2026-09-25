"use client";

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Circle,
  Loader2,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type SkillStatus = "matched" | "partial" | "missing";

type SkillResult = {
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
  skills: SkillResult[];
};

type TabType = "all" | "matched" | "partial" | "missing";

const JOB_ROLES = [
  "AI/ML Engineer",
  "Data Scientist",
  "Backend Developer",
  "Frontend Developer",
  "Data Analyst",
  "Full Stack Developer",
];

export default function SkillGapPage() {
  const [selectedRole, setSelectedRole] =
    useState("AI/ML Engineer");

  const [data, setData] =
    useState<SkillGapResponse | null>(null);

  const [activeTab, setActiveTab] =
    useState<TabType>("all");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  async function fetchSkillGap(role: string) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/skill-gap?role=${encodeURIComponent(role)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const raw = await response.text();

      console.log("SKILL GAP STATUS:", response.status);
      console.log("SKILL GAP RESPONSE:", raw);

      let result: SkillGapResponse | {
        message?: string;
      };

      try {
        result = JSON.parse(raw);
      } catch {
        throw new Error(
          `Server returned an invalid response (${response.status}).`
        );
      }

      if (!response.ok) {
        throw new Error(
          "message" in result && result.message
            ? result.message
            : "Unable to generate skill gap analysis."
        );
      }

      setData(result as SkillGapResponse);
    } catch (err) {
      console.error("SKILL_GAP_ERROR:", err);

      setData(null);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load skill gap analysis."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSkillGap(selectedRole);
  }, [selectedRole]);

  const filteredSkills = useMemo(() => {
    if (!data) {
      return [];
    }

    if (activeTab === "all") {
      return data.skills;
    }

    return data.skills.filter(
      (skill) => skill.status === activeTab
    );
  }, [data, activeTab]);

  const matchedPercentage =
    data && data.summary.totalSkills > 0
      ? (data.summary.matched / data.summary.totalSkills) * 100
      : 0;

  const partialPercentage =
    data && data.summary.totalSkills > 0
      ? (data.summary.partial / data.summary.totalSkills) * 100
      : 0;

  const missingPercentage =
    data && data.summary.totalSkills > 0
      ? (data.summary.missing / data.summary.totalSkills) * 100
      : 0;

  function getScoreMessage(score: number) {
    if (score >= 80) {
      return "You have strong alignment with this role.";
    }

    if (score >= 60) {
      return "You have a solid foundation with some gaps to close.";
    }

    if (score >= 40) {
      return "You have a starting foundation. Focus on the missing skills.";
    }

    return "Build the highest-priority missing skills first.";
  }

  function getStatusLabel(status: SkillStatus) {
    if (status === "matched") {
      return "Matched";
    }

    if (status === "partial") {
      return "Partial";
    }

    return "Missing";
  }

  function getStatusClasses(status: SkillStatus) {
    if (status === "matched") {
      return "border-green-500/20 bg-green-500/10 text-green-400";
    }

    if (status === "partial") {
      return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";
    }

    return "border-red-500/20 bg-red-500/10 text-red-400";
  }

  function getStatusDot(status: SkillStatus) {
    if (status === "matched") {
      return "bg-green-400";
    }

    if (status === "partial") {
      return "bg-yellow-400";
    }

    return "bg-red-400";
  }

  function getImportanceClasses(
    importance: "High" | "Medium" | "Low"
  ) {
    if (importance === "High") {
      return "text-red-400";
    }

    if (importance === "Medium") {
      return "text-yellow-400";
    }

    return "text-gray-400";
  }

  return (
    <div className="min-h-screen bg-[#070b1a] p-6 text-white lg:p-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm font-medium text-violet-400">
            <Sparkles size={16} />
            Career Intelligence
          </div>

          <div className="mt-2 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Skill Gap Analysis
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                See how your extracted resume skills match
                the requirements for your target role.
              </p>
            </div>

            {/* Role selector */}
            <div className="w-full lg:w-[260px]">
              <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-gray-500">
                Target Role
              </label>

              <select
                value={selectedRole}
                onChange={(event) => {
                  setSelectedRole(event.target.value);
                  setActiveTab("all");
                }}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500/50"
              >
                {JOB_ROLES.map((role) => (
                  <option
                    key={role}
                    value={role}
                    className="bg-[#11162a] text-white"
                  >
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="text-center">
              <Loader2
                size={32}
                className="mx-auto animate-spin text-violet-400"
              />

              <p className="mt-4 text-sm text-gray-400">
                Analyzing your skill gap...
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle
                size={22}
                className="mt-0.5 shrink-0 text-red-400"
              />

              <div>
                <h2 className="font-semibold text-red-300">
                  Unable to load analysis
                </h2>

                <p className="mt-2 text-sm leading-6 text-red-400/80">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    fetchSkillGap(selectedRole)
                  }
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
                >
                  Try Again
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        {!loading && !error && data && (
          <>
            {/* Role info */}
            <div className="mb-6 rounded-2xl border border-violet-500/10 bg-violet-500/[0.04] p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Target
                      size={18}
                      className="text-violet-400"
                    />

                    <span className="text-xs uppercase tracking-widest text-violet-400">
                      Target Role
                    </span>
                  </div>

                  <h2 className="mt-2 text-xl font-semibold">
                    {data.role.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {data.role.description}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/10 px-4 py-3">
                  <p className="text-xs text-gray-500">
                    Resume analyzed
                  </p>

                  <p className="mt-1 max-w-[220px] truncate text-sm font-medium text-gray-300">
                    {data.resume.fileName}
                  </p>
                </div>
              </div>
            </div>

            {/* Top cards */}
            <div className="grid gap-6 lg:grid-cols-2">

              {/* Readiness score */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500">
                      Job Readiness Score
                    </p>

                    <h2 className="mt-2 text-lg font-semibold">
                      Your current alignment
                    </h2>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                    <TrendingUp
                      size={19}
                      className="text-violet-400"
                    />
                  </div>
                </div>

                <div className="mt-8 flex flex-col items-center">
                  <div
                    className="relative flex h-44 w-44 items-center justify-center rounded-full"
                    style={{
                      background: `conic-gradient(rgb(139 92 246) ${data.summary.readinessScore}%, rgba(255,255,255,0.07) 0%)`,
                    }}
                  >
                    <div className="absolute inset-[10px] flex flex-col items-center justify-center rounded-full bg-[#0b1022]">
                      <span className="text-4xl font-bold">
                        {data.summary.readinessScore}%
                      </span>

                      <span className="mt-1 text-xs text-gray-500">
                        readiness
                      </span>
                    </div>
                  </div>

                  <p className="mt-5 text-center text-sm text-gray-400">
                    {getScoreMessage(
                      data.summary.readinessScore
                    )}
                  </p>
                </div>
              </div>

              {/* Breakdown */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500">
                      Skills Breakdown
                    </p>

                    <h2 className="mt-2 text-lg font-semibold">
                      {data.summary.totalSkills} required skills
                    </h2>
                  </div>

                  <div className="text-xs text-gray-500">
                    {data.summary.totalSkills} total
                  </div>
                </div>

                <div className="mt-8 space-y-6">

                  {/* Matched */}
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-gray-300">
                        Matched Skills
                      </span>

                      <span className="font-medium text-green-400">
                        {data.summary.matched}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-green-400 transition-all"
                        style={{
                          width: `${matchedPercentage}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Partial */}
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-gray-300">
                        Partially Matched
                      </span>

                      <span className="font-medium text-yellow-400">
                        {data.summary.partial}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-yellow-400 transition-all"
                        style={{
                          width: `${partialPercentage}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Missing */}
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-gray-300">
                        Missing Skills
                      </span>

                      <span className="font-medium text-red-400">
                        {data.summary.missing}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-red-400 transition-all"
                        style={{
                          width: `${missingPercentage}%`,
                        }}
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Detected resume skills */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-500">
                    Resume Skills
                  </p>

                  <h2 className="mt-2 text-lg font-semibold">
                    Skills detected from your resume
                  </h2>
                </div>

                <span className="text-xs text-gray-500">
                  {data.resume.skills.length} detected
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {data.resume.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-gray-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03] p-2">
              <div className="flex min-w-max gap-2">

                {(
                  [
                    ["all", "All Skills", data.summary.totalSkills],
                    ["matched", "Matched", data.summary.matched],
                    ["partial", "Partial", data.summary.partial],
                    ["missing", "Missing", data.summary.missing],
                  ] as const
                ).map(([value, label, count]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setActiveTab(value)
                    }
                    className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                      activeTab === value
                        ? "bg-violet-600 text-white"
                        : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    {label} ({count})
                  </button>
                ))}

              </div>
            </div>

            {/* Skill table */}
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">

              <div className="hidden grid-cols-[1.5fr_1fr_0.8fr_0.8fr] gap-4 border-b border-white/10 px-6 py-4 text-xs uppercase tracking-widest text-gray-600 md:grid">
                <span>Skill</span>
                <span>Status</span>
                <span>Importance</span>
                <span>Action</span>
              </div>

              {filteredSkills.length === 0 ? (
                <div className="p-10 text-center">
                  <Circle
                    size={28}
                    className="mx-auto text-gray-600"
                  />

                  <p className="mt-3 text-sm text-gray-500">
                    No skills found in this category.
                  </p>
                </div>
              ) : (
                <div>
                  {filteredSkills.map((item) => (
                    <div
                      key={`${item.skill}-${item.status}`}
                      className="grid gap-4 border-b border-white/10 px-6 py-5 last:border-b-0 md:grid-cols-[1.5fr_1fr_0.8fr_0.8fr] md:items-center"
                    >
                      {/* Skill */}
                      <div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${getStatusDot(
                              item.status
                            )}`}
                          />

                          <span className="font-medium text-white">
                            {item.skill}
                          </span>
                        </div>

                        <p className="mt-2 text-xs text-gray-600 md:hidden">
                          {item.importance} priority
                        </p>
                      </div>

                      {/* Status */}
                      <div>
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(
                            item.status
                          )}`}
                        >
                          {getStatusLabel(item.status)}
                        </span>
                      </div>

                      {/* Importance */}
                      <div>
                        <span
                          className={`text-sm font-medium ${getImportanceClasses(
                            item.importance
                          )}`}
                        >
                          {item.importance}
                        </span>
                      </div>

                      {/* Action */}
                      <div>
                        {item.status === "matched" ? (
                          <div className="inline-flex items-center gap-2 text-sm text-green-400">
                            <CheckCircle2 size={15} />
                            Complete
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-gray-300 transition hover:bg-white/[0.06] hover:text-white"
                          >
                            {item.action}
                            <ArrowRight size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Footer summary */}
            <div className="mt-6 grid gap-4 md:grid-cols-3">

              <div className="rounded-2xl border border-green-500/10 bg-green-500/[0.04] p-5">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle2 size={17} />
                  <span className="text-xs uppercase tracking-widest">
                    Matched
                  </span>
                </div>

                <p className="mt-3 text-2xl font-bold">
                  {data.summary.matched}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Skills already aligned with the role.
                </p>
              </div>

              <div className="rounded-2xl border border-yellow-500/10 bg-yellow-500/[0.04] p-5">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Circle size={17} />
                  <span className="text-xs uppercase tracking-widest">
                    Partial
                  </span>
                </div>

                <p className="mt-3 text-2xl font-bold">
                  {data.summary.partial}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Skills where related knowledge was detected.
                </p>
              </div>

              <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.04] p-5">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle size={17} />
                  <span className="text-xs uppercase tracking-widest">
                    Missing
                  </span>
                </div>

                <p className="mt-3 text-2xl font-bold">
                  {data.summary.missing}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Skills that need to be learned or developed.
                </p>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}