"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  BarChart3,
  Brain,
  BriefcaseBusiness,
  FileText,
  Gauge,
  LayoutDashboard,
  LogOut,
  Map,
  Settings,
  Target,
  User,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Resume Analyzer",
    href: "/dashboard/resume-analyzer",
    icon: FileText,
  },
  {
    label: "Skill Gap",
    href: "/dashboard/skill-gap",
    icon: Target,
  },
  {
    label: "Learning Roadmap",
    href: "/dashboard/roadmap",
    icon: Map,
  },
  {
    label: "Progress Tracker",
    href: "/dashboard/progress",
    icon: BarChart3,
  },
  {
    label: "Job Roles",
    href: "/dashboard/job-roles",
    icon: BriefcaseBusiness,
  },
];

const secondaryNavigation = [
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("LOGOUT_ERROR:", error);
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <aside className="flex h-full w-full flex-col border-r border-white/10 bg-[#080d1c]">

      {/* Logo */}
      <div className="flex h-20 items-center border-b border-white/10 px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600">
            <Brain
              size={19}
              className="text-white"
            />
          </div>

          <div>
            <p className="font-bold text-white">
              SkillGap
              <span className="text-violet-400">-AI</span>
            </p>

            <p className="text-[10px] uppercase tracking-widest text-gray-500">
              Career Intelligence
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-6">

        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-gray-600">
          Workspace
        </p>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                  active
                    ? "bg-violet-500/15 text-white ring-1 ring-violet-500/20"
                    : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon
                  size={18}
                  className={
                    active
                      ? "text-violet-400"
                      : "text-gray-500"
                  }
                />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <p className="mb-3 mt-8 px-3 text-[11px] font-semibold uppercase tracking-widest text-gray-600">
          Account
        </p>

        <nav className="space-y-1">
          {secondaryNavigation.map((item) => {
            const Icon = item.icon;

            const active = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                  active
                    ? "bg-violet-500/15 text-white"
                    : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon size={18} />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 p-4">

        {/* Profile completeness */}
        <div className="mb-3 rounded-xl border border-violet-500/10 bg-violet-500/5 p-4">

          <div className="flex items-center gap-2">
            <Gauge
              size={16}
              className="text-violet-400"
            />

            <p className="text-xs font-medium text-white">
              Profile completeness
            </p>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-violet-500 to-blue-500" />
          </div>

          <p className="mt-2 text-[11px] text-gray-500">
            72% complete
          </p>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-400 transition hover:bg-white/[0.04] hover:text-white"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>

      </div>
    </aside>
  );
}