import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#070b1a]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600">
            <Sparkles size={20} />
          </div>

          <span className="text-xl font-bold text-white">
            SkillGap<span className="text-violet-400">-AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-gray-300 transition hover:text-white">
            Features
          </a>

          <a href="#how-it-works" className="text-sm text-gray-300 transition hover:text-white">
            How It Works
          </a>

          <a href="#about" className="text-sm text-gray-300 transition hover:text-white">
            About
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 sm:block"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-105"
          >
            Sign Up
          </Link>
        </div>

      </div>
    </header>
  );
}