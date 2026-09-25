import Link from "next/link";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  FileText,
  Sparkles,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#070b1a] pt-32">
      
      <div className="absolute left-1/2 top-20 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[140px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 lg:grid-cols-2">

        {/* Left side */}
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            <Sparkles size={15} />
            AI-Powered Career Guidance
          </div>

          <h1 className="max-w-3xl text-5xl font-bold leading-[1.08] tracking-tight text-white md:text-6xl">
            Identify Your{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Skill Gaps.
            </span>

            <br />

            Learn. Grow.{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Get Ready.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-400">
            Upload your resume, choose your target job role, and get a
            personalized learning roadmap powered by AI.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-4 font-semibold text-white shadow-xl shadow-violet-500/20 transition hover:scale-[1.02]"
            >
              Get Started Free
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 px-7 py-4 font-medium text-white transition hover:bg-white/5"
            >
              See How It Works
            </a>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            No credit card required
          </p>
        </div>

        {/* Right side */}
        <div className="relative">
          <div className="absolute -inset-5 rounded-3xl bg-gradient-to-r from-violet-600/20 to-blue-600/20 blur-2xl" />

          <div className="relative rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-xl">

            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15">
                  <Brain size={20} className="text-violet-400" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Skill Analysis
                  </p>
                  <p className="text-xs text-gray-500">
                    AI/ML Engineer
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
                Analysis Complete
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              {/* Score */}
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm text-gray-400">
                  Skill Coverage
                </p>

                <div className="mt-5 flex items-center gap-4">
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-8 border-violet-500/20">
                    <div className="absolute inset-[-8px] rounded-full border-8 border-violet-500 border-b-transparent border-r-transparent rotate-45" />
                    <span className="text-xl font-bold text-white">
                      72%
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Current match
                    </p>

                    <p className="mt-1 font-semibold text-white">
                      Good Progress
                    </p>
                  </div>
                </div>
              </div>

              {/* Gaps */}
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <FileText size={16} className="text-blue-400" />
                  <p className="text-sm text-gray-300">
                    Skill Gaps
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    ["Docker", "Missing", "text-red-400"],
                    ["System Design", "Missing", "text-red-400"],
                    ["AWS", "Improve", "text-yellow-400"],
                    ["Kubernetes", "Learn", "text-orange-400"],
                  ].map(([skill, status, textColor]) => (
                    <div
                      key={skill}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-300">
                        {skill}
                      </span>

                      <span className={`text-xs ${textColor}`}>
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Roadmap */}
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Personalized Roadmap
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Your next learning steps
                  </p>
                </div>

                <CheckCircle2
                  size={20}
                  className="text-green-400"
                />
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[48%] rounded-full bg-gradient-to-r from-violet-500 to-blue-500" />
              </div>

              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>48% completed</span>
                <span>12 / 25 tasks</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}