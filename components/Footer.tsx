export default function Footer() {
  return (
    <footer
      id="about"
      className="border-t border-white/10 bg-[#070b1a]"
    >
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-6 py-8 md:flex-row md:items-center">

        <div>
          <p className="font-semibold text-white">
            SkillGap<span className="text-violet-400">-AI</span>
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Build the skills for the career you want.
          </p>
        </div>

        <p className="text-sm text-gray-600">
          © 2026 SkillGap-AI. All rights reserved.
        </p>

      </div>
    </footer>
  );
}