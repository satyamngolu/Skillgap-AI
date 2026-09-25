const stats = [
  ["10K+", "Career Profiles"],
  ["500+", "Job Roles"],
  ["AI", "Skill Analysis"],
  ["100%", "Personalized"],
];

export default function Stats() {
  return (
    <section className="border-y border-white/10 bg-[#0a0f21]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
        {stats.map(([value, label]) => (
          <div
            key={label}
            className="border-r border-white/10 px-6 py-10 text-center last:border-r-0"
          >
            <p className="text-3xl font-bold text-white">
              {value}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}