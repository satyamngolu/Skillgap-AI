"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  LogOut,
  Mail,
  Settings as SettingsIcon,
  Shield,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Settings = {
  emailNotifications: boolean;
  roadmapReminders: boolean;
  jobRecommendations: boolean;
  weeklyProgress: boolean;
  compactMode: boolean;
};

const defaultSettings: Settings = {
  emailNotifications: true,
  roadmapReminders: true,
  jobRecommendations: true,
  weeklyProgress: true,
  compactMode: false,
};

export default function SettingsPage() {
  const router = useRouter();

  const [settings, setSettings] =
    useState<Settings>(defaultSettings);

  const [loading, setLoading] = useState(true);
  const [savingField, setSavingField] = useState<string | null>(
    null
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);

      const response = await fetch("/api/user/settings");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load settings."
        );
      }

      setSettings(data.settings);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load settings."
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateSetting(
    key: keyof Settings,
    value: boolean
  ) {
    const previousValue = settings[key];

    try {
      setSavingField(key);
      setError("");
      setMessage("");

      setSettings((current) => ({
        ...current,
        [key]: value,
      }));

      const response = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [key]: value,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update setting."
        );
      }

      setSettings(data.settings);
      setMessage("Settings updated successfully.");

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch (err) {
      setSettings((current) => ({
        ...current,
        [key]: previousValue,
      }));

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update setting."
      );
    } finally {
      setSavingField(null);
    }
  }

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed.");
      }

      router.push("/login");
      router.refresh();
    } catch {
      setError("Failed to log out.");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b14]">
        <div className="flex min-h-[600px] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-white">
      <div className="mx-auto max-w-5xl space-y-7 p-4 sm:p-6 lg:p-8">

        {/* HEADER */}
        <div>
          <p className="text-sm font-medium text-slate-400">
            Account
          </p>

          <h1 className="mt-1 flex items-center gap-3 text-3xl font-bold tracking-tight text-white">
            <SettingsIcon size={30} />
            Settings
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Manage notifications, preferences, and account
            security for your SkillGap-AI account.
          </p>
        </div>

        {/* SUCCESS */}
        {message && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
            <Check size={18} />
            {message}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* NOTIFICATIONS */}
        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1422] shadow-lg">
          <div className="border-b border-slate-800 px-6 py-6">
            <div className="flex items-start gap-4">
              <div className="rounded-xl border border-slate-700 bg-[#080d17] p-3">
                <Bell
                  size={20}
                  className="text-slate-300"
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Notifications
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Choose which updates you want to receive.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-800">
            <SettingRow
              icon={<Mail size={19} />}
              title="Email notifications"
              description="Receive important account and product updates."
              enabled={settings.emailNotifications}
              saving={
                savingField === "emailNotifications"
              }
              onChange={(value) =>
                updateSetting(
                  "emailNotifications",
                  value
                )
              }
            />

            <SettingRow
              icon={<Bell size={19} />}
              title="Roadmap reminders"
              description="Get reminders to keep progressing through your learning roadmap."
              enabled={settings.roadmapReminders}
              saving={
                savingField === "roadmapReminders"
              }
              onChange={(value) =>
                updateSetting(
                  "roadmapReminders",
                  value
                )
              }
            />

            <SettingRow
              icon={<Sparkles size={19} />}
              title="Job recommendations"
              description="Receive career and job recommendations related to your target role."
              enabled={settings.jobRecommendations}
              saving={
                savingField === "jobRecommendations"
              }
              onChange={(value) =>
                updateSetting(
                  "jobRecommendations",
                  value
                )
              }
            />

            <SettingRow
              icon={<Check size={19} />}
              title="Weekly progress summary"
              description="Receive a weekly summary of your learning progress."
              enabled={settings.weeklyProgress}
              saving={savingField === "weeklyProgress"}
              onChange={(value) =>
                updateSetting(
                  "weeklyProgress",
                  value
                )
              }
            />
          </div>
        </section>

        {/* PREFERENCES */}
        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1422] shadow-lg">
          <div className="border-b border-slate-800 px-6 py-6">
            <div className="flex items-start gap-4">
              <div className="rounded-xl border border-slate-700 bg-[#080d17] p-3">
                <SettingsIcon
                  size={20}
                  className="text-slate-300"
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Preferences
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Customize your SkillGap-AI experience.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-800">
            <SettingRow
              icon={<SettingsIcon size={19} />}
              title="Compact dashboard"
              description="Use a more compact layout for dashboard content."
              enabled={settings.compactMode}
              saving={savingField === "compactMode"}
              onChange={(value) =>
                updateSetting("compactMode", value)
              }
            />
          </div>
        </section>

        {/* SECURITY */}
        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1422] shadow-lg">
          <div className="border-b border-slate-800 px-6 py-6">
            <div className="flex items-start gap-4">
              <div className="rounded-xl border border-slate-700 bg-[#080d17] p-3">
                <Shield
                  size={20}
                  className="text-slate-300"
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Security
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Manage your account session and access.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="rounded-xl border border-slate-800 bg-[#080d17] p-5">
              <h3 className="text-sm font-semibold text-white">
                Current session
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Sign out of your SkillGap-AI account on this
                device.
              </p>

              <button
                onClick={handleLogout}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/15"
              >
                <LogOut size={17} />
                Sign Out
              </button>
            </div>
          </div>
        </section>

        {/* ACCOUNT DATA */}
        <section className="rounded-2xl border border-slate-800 bg-[#0d1422] p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="rounded-xl border border-slate-700 bg-[#080d17] p-3">
              <Shield
                size={20}
                className="text-slate-300"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Privacy & Data
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                Your SkillGap-AI profile, resume information, and
                learning progress are associated with your account.
              </p>

              <div className="mt-5 rounded-xl border border-slate-800 bg-[#080d17] p-4 text-sm text-slate-500">
                Settings changes are saved to your account and
                remain available when you sign in again.
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

function SettingRow({
  icon,
  title,
  description,
  enabled,
  saving,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  saving: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6 px-6 py-5 transition hover:bg-white/[0.02]">

      <div className="flex min-w-0 items-start gap-4">
        <div className="mt-0.5 rounded-lg border border-slate-700 bg-[#080d17] p-2 text-slate-400">
          {icon}
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white">
            {title}
          </h3>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        disabled={saving}
        onClick={() => onChange(!enabled)}
        className={`relative h-7 w-12 shrink-0 rounded-full border transition ${
          enabled
            ? "border-slate-500 bg-white"
            : "border-slate-700 bg-[#080d17]"
        } ${
          saving
            ? "cursor-wait opacity-50"
            : "cursor-pointer"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full shadow transition ${
            enabled
              ? "left-6 bg-slate-950"
              : "left-1 bg-slate-500"
          }`}
        />
      </button>

    </div>
  );
}