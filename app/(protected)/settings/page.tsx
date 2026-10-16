"use client";

import { useState } from "react";
import {
  Settings,
  User,
  Bell,
  Shield,
  KeyRound,
  Save,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { updateUserSettings, updatePassword } from "./actions";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "security" | "notifications">("general");

  const [name, setName] = useState("Alex Morgan");
  const [email, setEmail] = useState("alex.morgan@example.com");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [aiAssistantTips, setAiAssistantTips] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleGeneralSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    const res = await updateUserSettings({
      name,
      email,
      emailNotifications,
      aiAssistantTips,
      theme: "dark",
    });

    setIsLoading(false);
    if (res.success) {
      setStatusMessage({ type: "success", text: "Settings updated successfully." });
    } else {
      setStatusMessage({ type: "error", text: res.error || "An error occurred." });
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    const res = await updatePassword({ currentPassword, newPassword });

    setIsLoading(false);
    if (res.success) {
      setStatusMessage({ type: "success", text: "Password changed successfully." });
      setCurrentPassword("");
      setNewPassword("");
    } else {
      setStatusMessage({ type: "error", text: res.error || "Failed to update password." });
    }
  }

  return (
    <div className="space-y-6 bg-[var(--background)] text-[var(--foreground)] min-h-[calc(100vh-5rem)] flex flex-col justify-between pb-12">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
            <Sparkles className="h-4 w-4" />
            Preferences & Security
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2">
            <Settings className="w-6 h-6 text-[var(--primary)]" />
            Settings
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[var(--muted)]">
            Manage your account settings, security preferences, and workspace configurations.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start flex-1">
        {/* Navigation Tabs */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-xl space-y-1">
          <button
            type="button"
            onClick={() => { setActiveTab("general"); setStatusMessage(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === "general"
                ? "bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[var(--primary)] border border-[color-mix(in_srgb,var(--primary)_30%,transparent)]"
                : "text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]"
            }`}
          >
            <User className="h-4 w-4" /> General Profile
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab("notifications"); setStatusMessage(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === "notifications"
                ? "bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[var(--primary)] border border-[color-mix(in_srgb,var(--primary)_30%,transparent)]"
                : "text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]"
            }`}
          >
            <Bell className="h-4 w-4" /> Notifications
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab("security"); setStatusMessage(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === "security"
                ? "bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[var(--primary)] border border-[color-mix(in_srgb,var(--primary)_30%,transparent)]"
                : "text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]"
            }`}
          >
            <Shield className="h-4 w-4" /> Security & Auth
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-2xl">
          {statusMessage && (
            <div
              className={`mb-6 flex items-center gap-3 rounded-2xl border px-4 py-3 text-xs sm:text-sm ${
                statusMessage.type === "success"
                  ? "border-[color-mix(in_srgb,var(--primary)_30%,transparent)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[var(--primary)]"
                  : "border-red-500/30 bg-red-500/10 text-red-400"
              }`}
            >
              {statusMessage.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* TAB 1: GENERAL */}
          {activeTab === "general" && (
            <form onSubmit={handleGeneralSubmit} className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                  <User className="h-5 w-5 text-[var(--primary)]" /> Public Profile Details
                </h2>
                <p className="text-xs text-[var(--muted)] mt-1">
                  Update how your name and identity appear across the ecosystem.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-xs sm:text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-xs sm:text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[var(--primary)] px-6 py-3 text-xs font-semibold text-[var(--primary-text)] transition hover:bg-[var(--primary-hover)] shadow-lg disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save General Changes
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <form onSubmit={handleGeneralSubmit} className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                  <Bell className="h-5 w-5 text-[var(--primary)]" /> Notification Preferences
                </h2>
                <p className="text-xs text-[var(--muted)] mt-1">
                  Control how and when you receive career progress alerts.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <label className="flex items-start gap-3 cursor-pointer p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] transition hover:border-[var(--primary)]">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="mt-0.5 rounded border-[var(--border)] bg-[var(--background)] text-[var(--primary)] focus:ring-0 h-4 w-4"
                  />
                  <div>
                    <span className="block text-xs sm:text-sm font-semibold text-[var(--foreground)]">Weekly Progress & ATS Score Reports</span>
                    <span className="block text-[11px] text-[var(--muted)] mt-0.5">Receive summary emails highlighting your resume score improvements.</span>
                  </div>
                </label>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[var(--primary)] px-6 py-3 text-xs font-semibold text-[var(--primary-text)] transition hover:bg-[var(--primary-hover)] shadow-lg disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Preferences
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: SECURITY */}
          {activeTab === "security" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[var(--primary)]" /> Password & Authentication
                </h2>
                <p className="text-xs text-[var(--muted)] mt-1">
                  Ensure your account is secure by updating your password regularly.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-xs sm:text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
                    New Password (Min 8 Characters)
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-xs sm:text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                <div className="text-[11px] text-[var(--muted)] flex items-center gap-1.5">
                  <KeyRound className="h-4 w-4 text-[var(--primary)]" /> Secure 256-bit encryption active.
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !currentPassword || !newPassword}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[var(--primary)] px-6 py-3 text-xs font-semibold text-[var(--primary-text)] transition hover:bg-[var(--primary-hover)] shadow-lg disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Update Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}