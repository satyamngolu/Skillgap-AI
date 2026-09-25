const steps = [
  {
    number: "01",
    title: "Upload Your Resume",
    description:
      "Upload your resume and let SkillGap-AI extract your current skills and experience.",
  },
  {
    number: "02",
    title: "Choose Your Target Role",
    description:
      "Select your desired role or paste a real job description.",
  },
  {
    number: "03",
    title: "Discover Your Skill Gaps",
    description:
      "See which requirements you already meet and which skills need improvement.",
  },
  {
    number: "04",
    title: "Follow Your Roadmap",
    description:
      "Follow your personalized learning plan and track your progress.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-[#0a0f21] py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
            How It Works
          </p>

          <h2 className="mt-3 text-4xl font-bold text-white">
            From resume to career roadmap
          </h2>

          <p className="mt-5 text-gray-400">
            Four simple steps to understand what you need to learn next.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-7"
            >
              <span className="text-5xl font-black text-violet-500/20">
                {step.number}
              </span>

              <h3 className="mt-4 text-xl font-semibold text-white">
                {step.title}
              </h3>

              <p className="mt-3 leading-7 text-gray-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}