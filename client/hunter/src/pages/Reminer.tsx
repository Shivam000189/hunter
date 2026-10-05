import { useEffect, useState } from "react";
import api from "../api/client";
import { Sidebar } from "../components/layout/Sidebar";
import {
  Bell,
  Check,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Sliders,
} from "lucide-react";

type PendingJob = {
  _id: string;
  company: string;
  role: string;
  appliedDate: string;
};

const daysSince = (date: string) => {
  const diffMs = Date.now() - new Date(date).getTime();
  return Math.max(0, Math.floor(diffMs / 86400000));
};

export function Reminder() {
  const [enabled, setEnabled] = useState(true);
  const [staleDays, setStaleDays] = useState(7);
  const [staleDaysDraft, setStaleDaysDraft] = useState("7");
  const [pending, setPending] = useState<PendingJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/api/v1/reminders/pending").catch(() => ({ data: { data: [] } })),
      api
        .get("/api/v1/reminders/settings")
        .catch(() => ({ data: { data: { enabled: true, staleDays: 7 } } })),
    ]).then(([pendingRes, settingsRes]) => {
      setPending(Array.isArray(pendingRes.data?.data) ? pendingRes.data.data : []);

      const settings = settingsRes.data?.data;
      if (settings) {
        const nextEnabled = Boolean(settings.enabled);
        const nextStaleDays = settings.staleDays || 7;
        setEnabled(nextEnabled);
        setStaleDays(nextStaleDays);
        setStaleDaysDraft(String(nextStaleDays));
      }
      setLoading(false);
    });
  }, []);

  async function saveSettings(next: { enabled?: boolean; staleDays?: number }) {
    const updated = {
      enabled,
      staleDays,
      ...next,
    };

    setEnabled(updated.enabled);
    setStaleDays(updated.staleDays);
    try {
      await api.patch("/api/v1/reminders/settings", updated);
    } catch {
      // keep optimistic values; server state reloads on next visit
    }
  }

  const handleToggleReminder = () => {
    saveSettings({ enabled: !enabled });
  };

  const handleStaleDaysCommit = () => {
    const parsed = Number(staleDaysDraft);
    const clamped = Number.isFinite(parsed) ? Math.min(Math.max(Math.round(parsed), 1), 90) : staleDays;

    setStaleDaysDraft(String(clamped));
    if (clamped !== staleDays) {
      saveSettings({ staleDays: clamped });
    }
  };

  const acknowledgeAll = async () => {
    try {
      await api.post("/api/v1/reminders/acknowledge");
      setPending([]);
    } catch {
      // leave the list as-is on failure
    }
  };

  return (
    <div className="app-shell flex min-h-screen flex-col font-sans">
      <Sidebar />

      <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 mb-1">
              <Bell className="w-3.5 h-3.5" />
              <span>Outreach & Follow-up Scheduler</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Follow-up Reminders & Alerts
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Applications waiting on you — review them on the Jobs board and mark them handled.
            </p>
          </div>

          {pending.length > 0 && (
            <button
              onClick={acknowledgeAll}
              className="hunter-btn-primary flex items-center gap-2 text-sm self-start sm:self-auto"
            >
              <Check className="w-4 h-4" />
              <span>Mark all reviewed ({pending.length})</span>
            </button>
          )}
        </div>

        {/* Pending summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="hunter-card p-5 flex items-center gap-4 border-rose-200/70 dark:border-rose-900/60">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{pending.length}</div>
              <div className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                Applications Needing Follow-up
              </div>
            </div>
          </div>

          <div className="hunter-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {enabled ? "On" : "Off"}
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Automated Email Reminders
              </div>
            </div>
          </div>

          <div className="hunter-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{staleDays}</div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Days Before Stale Flag
              </div>
            </div>
          </div>
        </div>

        {/* Settings Card */}
        <div className="hunter-panel p-6 mb-8 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200/80 dark:border-slate-800">
            <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Automation & Inactivity Thresholds
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  Automated Follow-up Reminders
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Receive prompts when applications sit idle without feedback
                </div>
              </div>

              <button
                onClick={handleToggleReminder}
                className={`flex h-6 w-12 items-center rounded-full p-1 transition cursor-pointer shrink-0 ${
                  enabled ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <div
                  className={`h-4 w-4 rounded-full bg-white transition shadow-sm ${
                    enabled ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  Stale Application Threshold
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Flag roles as needing follow-up after inactive days (1–90)
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={staleDaysDraft}
                  onChange={(e) => setStaleDaysDraft(e.target.value)}
                  onBlur={handleStaleDaysCommit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                  className="w-16 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2 py-1.5 text-center text-sm font-bold text-slate-900 dark:text-white"
                />
                <span className="text-xs font-semibold text-slate-500">days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pending follow-ups list */}
        <div className="hunter-panel overflow-hidden mb-8">
          <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Waiting on Your Follow-up
            </h3>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {!loading && pending.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-500 opacity-60" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  All caught up!
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  No applications are waiting on a follow-up right now.
                </p>
              </div>
            ) : (
              pending.map((job) => (
                <div
                  key={job._id}
                  className="flex items-center gap-4 p-4 sm:p-5 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition"
                >
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-900/60 flex items-center justify-center font-bold text-xs text-indigo-600 dark:text-indigo-400 shrink-0">
                    {job.company.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {job.company}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                        {daysSince(job.appliedDate)}d since applying
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 truncate">
                      {job.role}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {new Date(job.appliedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
