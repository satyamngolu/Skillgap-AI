"use client";

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Code2,
  Loader2,
  Target,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  useEffect,
  useState,
} from "react";

type RoadmapItem = {
  order: number;
  skill: string;
  status: "missing" | "partial";
  importance: "High" | "Medium" | "Low";
  level:
    | "Beginner"
    | "Intermediate"
    | "Advanced";
  duration: string;
  topics: string[];
  project: string;

  resources: {
    title: string;
    type:
      | "Documentation"
      | "Practice"
      | "Course";
    url: string;
  }[];
};


type RoadmapResponse = {
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
    missingSkills: number;
    partialSkills: number;
    estimatedDays: number;
  };
  roadmap: RoadmapItem[];
};

function RoadmapContent() {
  const searchParams = useSearchParams();

  const isCustom = searchParams.get("custom") === "true";

  const selectedRole =
    searchParams.get("role") ||
    "AI/ML Engineer";

  const [data, setData] =
    useState<RoadmapResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [completedSkills, setCompletedSkills] =
    useState<string[]>([]);

  const [customRoadmapKey, setCustomRoadmapKey] =
    useState("");

  // Load roadmap
  useEffect(() => {
    const loadRoadmap = async () => {
      try {
        setLoading(true);
        setError("");
        setCompletedSkills([]);

        // Custom roadmap comes from sessionStorage
        if (isCustom) {
          const storedRoadmap =
            sessionStorage.getItem("customRoadmap");

          if (!storedRoadmap) {
            throw new Error(
              "Custom roadmap not found. Please build the roadmap again."
            );
          }

          const result = JSON.parse(storedRoadmap);
          const roadmapItems: RoadmapItem[] =
            Array.isArray(result.roadmap)
              ? result.roadmap
              : [];

          if (roadmapItems.length === 0) {
            throw new Error(
              "Custom roadmap is empty. Please analyze the job description again."
            );
          }

          const rawSummary =
            result.summary || {};

          const customData: RoadmapResponse = {
            message:
              result.message ||
              "Custom roadmap generated successfully.",
            role: {
              name: "Custom Job Description",
              description:
                "A personalized learning roadmap generated from the skills detected in your job description and compared with your resume.",
            },
            resume: result.resume || {
              id: "",
              fileName: "Latest analyzed resume",
            },
            summary: {
              totalSteps:
                Number(
                  rawSummary.totalSteps ??
                    roadmapItems.length
                ),
              missingSkills:
                Number(
                  rawSummary.missingSkills ??
                    roadmapItems.filter(
                      (item) =>
                        item.status === "missing"
                    ).length
                ),
              partialSkills:
                Number(
                  rawSummary.partialSkills ??
                    roadmapItems.filter(
                      (item) =>
                        item.status === "partial"
                    ).length
                ),
              estimatedDays:
                Number(
                  rawSummary.estimatedDays ?? 0
                ),
            },
            roadmap: roadmapItems,
          };

          const roadmapKey =
            `CUSTOM_JD:${roadmapItems
              .map((item) => item.skill)
              .sort()
              .join("|")}`;

          setCustomRoadmapKey(roadmapKey);
          setData(customData);
          return;
        }

        // Normal role-based roadmap comes from the API
        setCustomRoadmapKey("");

        console.log(
          "ROADMAP ROLE:",
          selectedRole
        );

        const response = await fetch(
          `/api/roadmap?role=${encodeURIComponent(
            selectedRole
          )}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result = await response.json();

        console.log(
          "ROADMAP API RESPONSE:",
          result
        );

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to load roadmap."
          );
        }

        setData(result);
      } catch (err) {
        console.error(
          "ROADMAP_ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load roadmap."
        );
      } finally {
        setLoading(false);
      }
    };

    loadRoadmap();
  }, [selectedRole, isCustom]);

  // Load saved progress
  useEffect(() => {
    const loadProgress = async () => {
      const progressRole = isCustom
        ? customRoadmapKey
        : selectedRole;

      if (isCustom && !customRoadmapKey) {
        return;
      }

      try {
        const response = await fetch(
          `/api/roadmap/progress?role=${encodeURIComponent(
            progressRole
          )}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          return;
        }

        setCompletedSkills(
          result.completedSkills || []
        );
      } catch (err) {
        console.error(
          "PROGRESS_LOAD_ERROR:",
          err
        );
      }
    };

    loadProgress();
  }, [selectedRole, isCustom, customRoadmapKey]);

  // Mark complete / incomplete
  const toggleSkill = async (
    skillName: string
  ) => {
    const alreadyCompleted =
      completedSkills.includes(skillName);

    const newCompletedState =
      !alreadyCompleted;

    console.log(
      "CLICKED SKILL:",
      skillName
    );

    console.log(
      "ROLE:",
      isCustom ? customRoadmapKey : selectedRole
    );

    console.log(
      "COMPLETED:",
      newCompletedState
    );

    // Update UI immediately
    setCompletedSkills((previous) => {
      if (newCompletedState) {
        if (previous.includes(skillName)) {
          return previous;
        }

        return [
          ...previous,
          skillName,
        ];
      }

      return previous.filter(
        (skill) => skill !== skillName
      );
    });

    const progressRole = isCustom
      ? customRoadmapKey
      : selectedRole;

    if (isCustom && !customRoadmapKey) {
      return;
    }

    try {
      const response = await fetch(
        "/api/roadmap/progress",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            roleName: progressRole,
            skill: skillName,
            completed:
              newCompletedState,
          }),
        }
      );

      const result =
        await response.json();

      console.log(
        "PROGRESS API RESPONSE:",
        result
      );

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to save progress."
        );
      }

      console.log(
        "PROGRESS SAVED:",
        result
      );
    } catch (err) {
      console.error(
        "PROGRESS SAVE ERROR:",
        err
      );

      // Roll back UI
      setCompletedSkills(
        (previous) => {
          if (newCompletedState) {
            return previous.filter(
              (skill) =>
                skill !== skillName
            );
          }

          return previous.includes(
            skillName
          )
            ? previous
            : [
                ...previous,
                skillName,
              ];
        }
      );
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b1a] text-white">
        <div className="text-center">
          <Loader2
            size={40}
            className="mx-auto animate-spin text-violet-400"
          />

          <p className="mt-4 text-sm text-gray-400">
            Building roadmap for{" "}
            {isCustom
              ? "your custom job description"
              : selectedRole}
            ...
          </p>
        </div>
      </div>
    );
  }

  // Error
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
              Roadmap Unavailable
            </h1>

            <p className="mt-3 text-sm text-gray-400">
              {error ||
                "Unable to generate roadmap."}
            </p>

            <div className="mt-6">
              <Link
                href="/dashboard/job-roles"
                className="inline-flex rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white"
              >
                Choose Another Role
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progress =
    data.summary.totalSteps === 0
      ? 0
      : Math.round(
          (completedSkills.length /
            data.summary.totalSteps) *
            100
        );

  return (
    <div className="min-h-screen bg-[#070b1a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2 text-sm text-violet-400">
                <Target size={16} />
                Personalized Learning
              </div>

              <h1 className="mt-2 text-2xl font-bold md:text-3xl">
                Learning Roadmap
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Personalized roadmap for{" "}
                {data.role.name}
              </p>
            </div>

            <Link
              href={
                isCustom
                  ? "/dashboard/job-roles"
                  : `/dashboard/skill-gap?role=${encodeURIComponent(
                      data.role.name
                    )}`
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-gray-200 hover:bg-white/[0.08]"
            >
              {isCustom
                ? "Back to Job Analysis"
                : "View Skill Gap"}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 p-6 lg:p-8">
        {/* Target Role */}
        <section className="rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-blue-500/5 p-6">
          <p className="text-xs uppercase tracking-widest text-gray-500">
            Target Career
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {data.role.name}
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
            {data.role.description}
          </p>
        </section>

        {/* Summary */}
        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <BookOpen
              size={20}
              className="text-violet-400"
            />

            <p className="mt-4 text-2xl font-bold">
              {data.summary.totalSteps}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Learning Steps
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <CircleAlert
              size={20}
              className="text-red-400"
            />

            <p className="mt-4 text-2xl font-bold">
              {data.summary.missingSkills}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Missing Skills
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <Code2
              size={20}
              className="text-yellow-400"
            />

            <p className="mt-4 text-2xl font-bold">
              {data.summary.partialSkills}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Partial Skills
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <Clock3
              size={20}
              className="text-blue-400"
            />

            <p className="mt-4 text-2xl font-bold">
              {data.summary.estimatedDays}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Estimated Days
            </p>
          </div>
        </section>

        {/* Progress */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">
                Roadmap Progress
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Complete each learning step.
              </p>
            </div>

            <span className="text-lg font-bold text-violet-400">
              {progress}%
            </span>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-blue-600 transition-all"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </section>

      {/* Learning Path */}
<section>
  <div className="mb-5">
    <h2 className="text-xl font-semibold">
      Your Learning Path
    </h2>

    <p className="mt-1 text-sm text-gray-500">
      Highest-priority skill gaps appear first.
    </p>
  </div>

  <div className="space-y-5">
    {data.roadmap.map((item) => {
      const completed =
        completedSkills.includes(item.skill);

      return (
        <div
          key={item.order}
          className={`rounded-2xl border p-6 ${
            completed
              ? "border-green-500/20 bg-green-500/5"
              : "border-white/10 bg-white/[0.03]"
          }`}
        >
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Step Number */}
            <div className="shrink-0">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold ${
                  completed
                    ? "bg-green-500/10 text-green-400"
                    : "bg-violet-500/10 text-violet-400"
                }`}
              >
                {completed ? (
                  <CheckCircle2 size={25} />
                ) : (
                  item.order
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Header */}
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-semibold">
                      {item.skill}
                    </h3>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] ${
                        item.status === "missing"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {item.status}
                    </span>

                    <span className="rounded-full bg-violet-500/10 px-2.5 py-1 text-[11px] text-violet-400">
                      {item.importance} priority
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    {item.level} · {item.duration}
                  </p>
                </div>

                {/* Complete Button */}
                <button
                  type="button"
                  onClick={() =>
                    toggleSkill(item.skill)
                  }
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium ${
                    completed
                      ? "bg-green-500/10 text-green-400"
                      : "bg-violet-600 text-white hover:bg-violet-500"
                  }`}
                >
                  {completed
                    ? "Completed"
                    : "Mark Complete"}
                </button>
              </div>

              {/* Topics */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-300">
                  What to learn
                </h4>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {item.topics.map((topic) => (
                    <div
                      key={topic}
                      className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/10 px-3 py-2.5 text-sm text-gray-400"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                      {topic}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Project */}
              <div className="mt-5 rounded-xl border border-blue-500/10 bg-blue-500/5 p-4">
                <div className="flex items-start gap-3">
                  <Code2
                    size={18}
                    className="mt-0.5 text-blue-400"
                  />

                  <div>
                    <p className="text-sm font-medium text-white">
                      Recommended Project
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-400">
                      {item.project}
                    </p>
                  </div>
                </div>
              </div>

              {/* Learning Resources */}
              <div className="mt-5">
                <h4 className="text-sm font-medium text-gray-300">
                  Learning Resources
                </h4>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {item.resources.map((resource) => (
                    <a
                      key={resource.title}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-white/10 bg-black/10 p-4 transition hover:border-violet-500/30 hover:bg-violet-500/5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-white">
                            {resource.title}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {resource.type}
                          </p>
                        </div>

                        <ArrowRight
                          size={15}
                          className="shrink-0 text-violet-400"
                        />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>
</section>

        {/* Completion */}
        {progress === 100 && (
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
          </section>
        )}

        <div className="pb-4 text-center text-xs text-gray-600">
          {isCustom
            ? "Generated from your custom job description and latest completed resume."
            : "Generated from your latest completed resume and selected target role."}
        </div>
      </main>
    </div>
  );
}

export default function RoadmapPage() {
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
      <RoadmapContent />
    </Suspense>
  );
}