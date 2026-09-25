"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Brain,
  Lock,
  Mail,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("LOGIN_ERROR:", error);
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070b1a] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left branding section */}
        <div className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-[#070b1a] to-blue-950" />

          <div className="absolute left-[-100px] top-[-100px] h-[400px] w-[400px] rounded-full bg-violet-600/20 blur-[120px]" />

          <div className="absolute bottom-[-100px] right-[-100px] h-[400px] w-[400px] rounded-full bg-blue-600/20 blur-[120px]" />

          <div className="relative z-10 flex flex-col justify-between p-12">

            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600">
                <Brain size={20} />
              </div>

              <span className="text-xl font-bold">
                SkillGap<span className="text-violet-400">-AI</span>
              </span>
            </Link>

            <div className="max-w-lg">
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-violet-400">
                Your career journey
              </p>

              <h1 className="text-5xl font-bold leading-tight">
                Turn your skills into your next opportunity.
              </h1>

              <p className="mt-6 text-lg leading-8 text-gray-400">
                Analyze your skills, discover your gaps, and follow a
                personalized roadmap toward your target career.
              </p>
            </div>

            <p className="text-sm text-gray-600">
              © 2026 SkillGap-AI
            </p>

          </div>
        </div>

        {/* Login */}
        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">

            <Link
              href="/"
              className="mb-10 inline-flex text-sm text-gray-400 hover:text-white lg:hidden"
            >
              ← Back to SkillGap-AI
            </Link>

            <div className="mb-8">
              <h2 className="text-3xl font-bold">
                Welcome back
              </h2>

              <p className="mt-2 text-gray-400">
                Login to continue your career journey.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-white outline-none placeholder:text-gray-600 focus:border-violet-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-300">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs text-violet-400 hover:text-violet-300"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-white outline-none placeholder:text-gray-600 focus:border-violet-500"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3.5 font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}

                {!loading && <ArrowRight size={18} />}
              </button>

            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />

              <span className="text-xs text-gray-600">
                OR
              </span>

              <div className="h-px flex-1 bg-white/10" />
            </div>

            <button
              type="button"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3.5 text-sm font-medium text-white transition hover:bg-white/[0.06]"
            >
              Continue with Google
            </button>

            <p className="mt-7 text-center text-sm text-gray-500">
              Don't have an account?{" "}

              <Link
                href="/signup"
                className="font-medium text-violet-400 hover:text-violet-300"
              >
                Create account
              </Link>
            </p>

          </div>
        </div>

      </div>
    </main>
  );
}