import { useEffect, useState } from "react";
import api from "../api/client";
import { Sidebar } from "../components/layout/Sidebar";

type ReminderLog = {
  _id: string;
  company: string;
  sentAt: string;
  nextReminder: string;
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

export function Reminder() {
  const [enabled, setEnabled] = useState(true);
  const [staleDays, setStaleDays] = useState(7);
  const [logs, setLogs] = useState<ReminderLog[]>([]);
  const [loading, setLoading] = useState(true);

  function loadData() {
    setLoading(true);
    Promise.all([
      api.get("/api/v1/reminders"),
      api.get("/api/v1/reminders/settings"),
    ])
      .then(([logsRes, settingsRes]) => {
        setLogs(logsRes.data.data || []);
        setEnabled(Boolean(settingsRes.data.data.enabled));
        setStaleDays(settingsRes.data.data.staleDays);
      })
      .finally(() => setLoading(false));
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
    await api.patch("/api/v1/reminders/settings", updated);
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 lg:flex-row">
      <Sidebar />

      <div className="min-w-0 flex-1 space-y-6 p-4 sm:p-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Reminder Settings
          </h2>
          <p className="text-sm text-slate-500">
            Manage your job follow-ups and notifications
          </p>
        </div>

        <div className="space-y-5 rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-medium">Follow-up Reminders</div>
              <div className="text-xs text-slate-500">
                Get notified when applications need follow-up
              </div>
            </div>

            <button
              onClick={() => saveSettings({ enabled: !enabled })}
              className={`flex h-6 w-12 items-center rounded-full p-1 transition ${
                enabled ? "bg-indigo-600" : "bg-slate-300"
              }`}
            >
              <div
                className={`h-4 w-4 rounded-full bg-white transition ${
                  enabled ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-medium">Stale Application Days</div>
              <div className="text-xs text-slate-500">
                Flag applications inactive after this many days
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={staleDays}
                onChange={(e) =>
                  saveSettings({ staleDays: Number(e.target.value) })
                }
                className="w-20 rounded-xl border border-slate-300 px-3 py-2 text-center text-sm"
              />
              <span className="text-sm text-slate-500">days</span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b p-4">
            <h3 className="text-sm font-semibold">Reminder Logs</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Company</th>
                  <th className="px-4 py-3 text-left font-medium">Sent</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Next Reminder
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-5 text-slate-500">
                      Loading reminders...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-5 text-slate-500">
                      No reminder logs yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">{log.company}</td>
                      <td className="px-4 py-3 text-slate-500">
                        {formatDate(log.sentAt)}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {formatDate(log.nextReminder)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
