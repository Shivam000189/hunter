import { useEffect, useState } from "react";
import api from "../api/client";
import { Sidebar } from "../components/layout/Sidebar";
import { AddReminderModal } from "../components/reminder/AddReminderModal";
import {
  Bell,
  Plus,
  Check,
  Trash2,
  AlertCircle,
  Clock,
  CheckCircle2,
  Calendar,
  Sliders,
} from "lucide-react";

interface LocalReminder {
  id: string;
  company: string;
  action: string;
  date: string;
  priority: "low" | "medium" | "high";
  status: "overdue" | "today" | "upcoming" | "done";
}

const INITIAL_REMINDERS_DATA: LocalReminder[] = [
  {
    id: "rem-1",
    company: "Google",
    action: "Send thank-you email following technical system architecture round",
    date: new Date(Date.now() - 1 * 86400000).toISOString().split("T")[0],
    priority: "high",
    status: "overdue",
  },
  {
    id: "rem-2",
    company: "Meta",
    action: "Check application portal for referral status update",
    date: new Date().toISOString().split("T")[0],
    priority: "medium",
    status: "today",
  },
  {
    id: "rem-3",
    company: "Stripe",
    action: "Review compensation package benchmarks before follow-up call",
    date: new Date().toISOString().split("T")[0],
    priority: "high",
    status: "today",
  },
  {
    id: "rem-4",
    company: "Apple",
    action: "Prepare portfolio deck for upcoming onsite round",
    date: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
    priority: "medium",
    status: "upcoming",
  },
  {
    id: "rem-5",
    company: "Amazon",
    action: "Follow up with recruiting coordinator on interview timeline",
    date: new Date(Date.now() + 4 * 86400000).toISOString().split("T")[0],
    priority: "low",
    status: "upcoming",
  },
];

export function Reminder() {
  const [enabled, setEnabled] = useState(true);
  const [staleDays, setStaleDays] = useState(7);
  const [reminders, setReminders] = useState<LocalReminder[]>(INITIAL_REMINDERS_DATA);
  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  function loadData() {
    Promise.all([
      api.get("/api/v1/reminders").catch(() => ({ data: { data: [] } })),
      api.get("/api/v1/reminders/pending").catch(() => ({ data: { data: [] } })),
      api.get("/api/v1/reminders/settings").catch(() => ({ data: { data: { enabled: true, staleDays: 7 } } })),
    ])
      .then(([, , settingsRes]) => {
        if (settingsRes.data?.data) {
          setEnabled(Boolean(settingsRes.data.data.enabled));
          setStaleDays(settingsRes.data.data.staleDays || 7);
        }
      });
  }

  useEffect(() => {
    loadData();
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
      // optimistic update
    }
  }

  const handleToggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            status: r.status === "done" ? "upcoming" : "done",
          };
        }
        return r;
      })
    );
  };

  const handleDeleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddReminder = async (data: {
    company: string;
    action: string;
    date: string;
    priority: "low" | "medium" | "high";
  }) => {
    const isToday = data.date === new Date().toISOString().split("T")[0];
    const newRem: LocalReminder = {
      id: String(Date.now()),
      company: data.company,
      action: data.action,
      date: data.date,
      priority: data.priority,
      status: isToday ? "today" : "upcoming",
    };
    setReminders((prev) => [newRem, ...prev]);
  };

  const overdueCount = reminders.filter((r) => r.status === "overdue").length;
  const todayCount = reminders.filter((r) => r.status === "today").length;
  const upcomingCount = reminders.filter((r) => r.status === "upcoming").length;

  const filteredReminders = reminders.filter((r) => {
    if (filter === "pending") return r.status !== "done";
    if (filter === "done") return r.status === "done";
    return true;
  });

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
              Stay ahead of recruiter check-ins, thank-you notes, and application updates.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="hunter-btn-primary flex items-center gap-2 text-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Reminder</span>
          </button>
        </div>

        {/* 3 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="hunter-card p-5 flex items-center gap-4 border-rose-200/70 dark:border-rose-900/60">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{overdueCount}</div>
              <div className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                Overdue Outreach
              </div>
            </div>
          </div>

          <div className="hunter-card p-5 flex items-center gap-4 border-amber-200/70 dark:border-amber-900/60">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{todayCount}</div>
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                Action Due Today
              </div>
            </div>
          </div>

          <div className="hunter-card p-5 flex items-center gap-4 border-emerald-200/70 dark:border-emerald-900/60">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{upcomingCount}</div>
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Scheduled Follow-ups
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
                onClick={() => saveSettings({ enabled: !enabled })}
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
                  Flag roles as needing follow-up after inactive days
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={staleDays}
                  onChange={(e) => saveSettings({ staleDays: Number(e.target.value) })}
                  className="w-16 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2 py-1.5 text-center text-sm font-bold text-slate-900 dark:text-white"
                />
                <span className="text-xs font-semibold text-slate-500">days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Task Schedule List */}
        <div className="hunter-panel overflow-hidden mb-8">
          <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Upcoming Action Schedule
            </h3>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {(["all", "pending", "done"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 text-xs font-bold capitalize rounded-lg transition cursor-pointer ${
                    filter === f
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredReminders.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-500 opacity-60" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  All caught up!
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  No reminders matching this filter.
                </p>
              </div>
            ) : (
              filteredReminders.map((reminder) => {
                const isDone = reminder.status === "done";
                const priorityColors = {
                  high: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800",
                  medium: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
                  low: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
                };
                const statusBadges = {
                  overdue: { label: "Overdue", color: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300" },
                  today: { label: "Due Today", color: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300" },
                  upcoming: { label: "Scheduled", color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300" },
                  done: { label: "Completed", color: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400" },
                };

                return (
                  <div
                    key={reminder.id}
                    className={`flex items-center gap-4 p-4 sm:p-5 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition ${
                      isDone ? "opacity-50" : ""
                    }`}
                  >
                    <button
                      onClick={() => handleToggleReminder(reminder.id)}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition cursor-pointer shrink-0 ${
                        isDone
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-slate-300 dark:border-slate-600 hover:border-indigo-600 text-transparent"
                      }`}
                      title={isDone ? "Mark as pending" : "Mark as complete"}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className={`font-bold text-sm text-slate-900 dark:text-white ${
                            isDone ? "line-through" : ""
                          }`}
                        >
                          {reminder.company}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${
                            priorityColors[reminder.priority]
                          }`}
                        >
                          {reminder.priority} priority
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            statusBadges[reminder.status].color
                          }`}
                        >
                          {statusBadges[reminder.status].label}
                        </span>
                      </div>
                      <p
                        className={`text-xs text-slate-600 dark:text-slate-300 truncate ${
                          isDone ? "line-through text-slate-400 dark:text-slate-500" : ""
                        }`}
                      >
                        {reminder.action}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{reminder.date}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteReminder(reminder.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition cursor-pointer shrink-0"
                      title="Delete reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* Add Reminder Modal */}
      <AddReminderModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddReminder={handleAddReminder}
      />
    </div>
  );
}
