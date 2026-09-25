import {
  Brain,
  FileSearch,
  GraduationCap,
  LineChart,
  Map,
  Target,
} from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "AI Resume Analysis",
    description:
      "Extract skills, education, projects and experience from your resume automatically.",
  },
  {
    icon: Target,
    title: "Skill Gap Detection",
    description:
      "Compare your current skills against the requirements of your target role.",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description:
      "Understand which skills need improvement and why they matter for your target role.",
  },
  {
    icon: Map,
    title: "Personalized Roadmap",
    description:
      "Get a structured learning path based on your current level and career goal.",
  },
  {
    icon: GraduationCap,
    title: "Learning Resources",
    description:
      "Discover courses, documentation, projects and practice resources for your gaps.",
  },
  {
    icon: LineChart,
    title: "Progress Tracking",
    description:
      "Track learning milestones and measure your progress over time.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-[#070b1a] py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
            Powerful Features
          </p>

          <h2 className="mt-3 text-4xl font-bold text-white">
            Everything you need to close your skill gaps
          </h2>

          <p className="mt-5 text-gray-400">
            SkillGap-AI turns your career goal into a personalized,
            measurable learning journey.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/[0.05]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
                  <Icon size={23} className="text-violet-400" />
                </div>

                <h3 className="mt-5 text-xl font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}