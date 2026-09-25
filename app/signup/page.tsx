"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Brain,
  User,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to create account.");
        return;
      }

      router.push("/login");
    } catch (error) {
      console.error("SIGNUP_ERROR:", error);
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070b1a] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left */}
        <div className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-[#070b1a] to-violet-950" />

          <div className="absolute bottom-[-100px] left-[-100px] h-[400px] w-[400px] rounded-full bg-violet-600/20 blur-[120px]" />

          <div className="absolute right-[-100px] top-[-100px] h-[400px] w-[400px] rounded-full bg-blue-600/20 blur-[120px]" />

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
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-400">
                Start your journey
              </p>

              <h1 className="text-5xl font-bold leading-tight">
                Know what to learn. Know where you're going.
              </h1>

              <p className="mt-6 text-lg leading-8 text-gray-400">
                SkillGap-AI helps you understand your current skills and
                build a roadmap toward your target role.
              </p>
            </div>

            <p className="text-sm text-gray-600">
              © 2026 SkillGap-AI
            </p>

          </div>
        </div>

        {/* Signup */}
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
                Create your account
              </h2>

              <p className="mt-2 text-gray-400">
                Start building your personalized career roadmap.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Full name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-white outline-none placeholder:text-gray-600 focus:border-violet-500"
                  />
                </div>
              </div>

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
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Create a password"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-white outline-none placeholder:text-gray-600 focus:border-violet-500"
                  />
                </div>

                <p className="mt-2 text-xs text-gray-600">
                  Minimum 8 characters
                </p>
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
                {loading ? "Creating account..." : "Create Account"}

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

            {/* Google button - not connected yet */}
            <button
              type="button"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3.5 text-sm font-medium transition hover:bg-white/[0.06]"
            >
              Continue with Google
            </button>

            <p className="mt-7 text-center text-sm text-gray-500">
              Already have an account?{" "}

              <Link
                href="/login"
                className="font-medium text-violet-400 hover:text-violet-300"
              >
                Login
              </Link>
            </p>

          </div>
        </div>

      </div>
    </main>
  );
}