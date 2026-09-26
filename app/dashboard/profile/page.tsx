"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Check,
  GraduationCap,
  Mail,
  Save,
  User,
  X,
} from "lucide-react";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  targetRole: string;
  education: string;
  experience: string;
  skills: string[];
  createdAt?: string;
};

const roles = [
  "AI/ML Engineer",
  "Data Scientist",
  "Backend Developer",
  "Frontend Developer",
  "Data Analyst",
  "Full Stack Developer",
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [name, setName] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);

      const response = await fetch("/api/user/profile");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load profile."
        );
      }

      setProfile(data.user);
      setName(data.user.name || "");
      setTargetRole(data.user.targetRole || "");
      setEducation(data.user.education || "");
      setExperience(data.user.experience || "");
      setSkills(data.user.skills || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  }

  const initials = useMemo(() => {
    if (!name.trim()) return "U";

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [name]);

  function addSkill() {
    const value = skillInput.trim();

    if (!value) return;

    const exists = skills.some(
      (skill) => skill.toLowerCase() === value.toLowerCase()
    );

    if (!exists) {
      setSkills((current) => [...current, value]);
    }

    setSkillInput("");
  }

  function removeSkill(skillToRemove: string) {
    setSkills((current) =>
      current.filter((skill) => skill !== skillToRemove)
    );
  }

  async function saveProfile() {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          targetRole,
          education,
          experience,
          skills,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update profile."
        );
      }

      setProfile(data.user);
      setMessage("Profile updated successfully.");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center bg-[#070b14]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-white">
      <div className="mx-auto max-w-7xl space-y-7 p-4 sm:p-6 lg:p-8">

        {/* PAGE HEADER */}
        <div>
          <p className="text-sm font-medium text-slate-400">
            Account
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
            My Profile
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Keep your career information updated so SkillGap-AI
            can personalize your learning journey.
          </p>
        </div>

        {/* SUCCESS MESSAGE */}
        {message && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
            <Check size={18} />
            {message}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* PROFILE HEADER */}
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#0d1422] shadow-xl">

          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-[#121a2b] via-[#162033] to-[#1b2940]" />

          <div className="px-5 pb-6 sm:px-8">

            <div className="-mt-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

              <div className="flex items-end gap-4">

                {/* Avatar */}
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-[#0d1422] bg-gradient-to-br from-slate-700 to-slate-900 text-2xl font-bold text-white shadow-2xl">
                  {initials}
                </div>

                <div className="pb-1">
                  <h2 className="text-2xl font-bold text-white">
                    {name || "Your Name"}
                  </h2>

                  <div className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                    <Mail size={15} />
                    <span>{profile?.email}</span>
                  </div>
                </div>

              </div>

              {/* Save Button */}
              <button
                onClick={saveProfile}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={17} />

                {saving ? "Saving..." : "Save Changes"}
              </button>

            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* PERSONAL INFORMATION */}
          <section className="rounded-2xl border border-slate-800 bg-[#0d1422] p-6 shadow-lg lg:col-span-2">

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Basic information associated with your account.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-[#080d17] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/10"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    value={profile?.email || ""}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-slate-800 bg-[#080d17] py-3 pl-10 pr-4 text-sm text-slate-400"
                  />
                </div>

                <p className="mt-1.5 text-xs text-slate-500">
                  Email cannot be changed here.
                </p>
              </div>

            </div>
          </section>

          {/* ACCOUNT SUMMARY */}
          <section className="rounded-2xl border border-slate-800 bg-[#0d1422] p-6 shadow-lg">

            <h2 className="text-lg font-semibold text-white">
              Account Summary
            </h2>

            <div className="mt-6 space-y-5">

              <div className="flex items-start gap-3">
                <div className="rounded-lg border border-slate-700 bg-[#080d17] p-2">
                  <User
                    size={18}
                    className="text-slate-300"
                  />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Account
                  </p>

                  <p className="mt-1 text-sm font-medium text-white">
                    SkillGap-AI Member
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-lg border border-slate-700 bg-[#080d17] p-2">
                  <BriefcaseBusiness
                    size={18}
                    className="text-slate-300"
                  />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Target Career
                  </p>

                  <p className="mt-1 text-sm font-medium text-white">
                    {targetRole || "Not selected"}
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* CAREER PROFILE */}
          <section className="rounded-2xl border border-slate-800 bg-[#0d1422] p-6 shadow-lg lg:col-span-3">

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white">
                Career Profile
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                This information helps generate more relevant skill
                gaps and roadmaps.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">

              {/* TARGET ROLE */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Target Role
                </label>

                <div className="relative">
                  <BriefcaseBusiness
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <select
                    value={targetRole}
                    onChange={(e) =>
                      setTargetRole(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-[#080d17] py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500/10"
                  >
                    <option value="">
                      Select target role
                    </option>

                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* EDUCATION */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Education
                </label>

                <div className="relative">
                  <GraduationCap
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    value={education}
                    onChange={(e) =>
                      setEducation(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-[#080d17] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/10"
                    placeholder="e.g. B.Tech CSE"
                  />
                </div>
              </div>

              {/* EXPERIENCE */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Experience
                </label>

                <input
                  value={experience}
                  onChange={(e) =>
                    setExperience(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-700 bg-[#080d17] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/10"
                  placeholder="e.g. Fresher / 1 year"
                />
              </div>

            </div>
          </section>

          {/* SKILLS */}
          <section className="rounded-2xl border border-slate-800 bg-[#0d1422] p-6 shadow-lg lg:col-span-3">

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white">
                Skills
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Add technologies and skills you currently know.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              <input
                value={skillInput}
                onChange={(e) =>
                  setSkillInput(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                className="flex-1 rounded-xl border border-slate-700 bg-[#080d17] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/10"
                placeholder="e.g. Python, React, SQL..."
              />

              <button
                type="button"
                onClick={addSkill}
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Add Skill
              </button>

            </div>

            <div className="mt-5 flex flex-wrap gap-2">

              {skills.length > 0 ? (
                skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-[#080d17] px-3 py-2 text-sm font-medium text-slate-200"
                  >
                    {skill}

                    <button
                      type="button"
                      onClick={() =>
                        removeSkill(skill)
                      }
                      className="rounded-full p-0.5 text-slate-500 transition hover:bg-slate-700 hover:text-white"
                      aria-label={`Remove ${skill}`}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  No skills added yet.
                </p>
              )}

            </div>
          </section>
        </div>

        {/* BOTTOM SAVE */}
        <div className="flex justify-end border-t border-slate-800 pt-6">

          <button
            onClick={saveProfile}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={17} />

            {saving ? "Saving..." : "Save Profile"}
          </button>

        </div>

      </div>
    </div>
  );
}