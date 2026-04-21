import { useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";

export function Reminder() {
  const [autoFollowUp, setAutoFollowUp] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [staleDays, setStaleDays] = useState(7);

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 p-6 space-y-6">

        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Reminder Settings
          </h2>
          <p className="text-sm text-slate-500">
            Manage your job follow-ups and notifications
          </p>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-5">

          {/* Auto Follow-up */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">
                Auto Follow-up Reminders
              </div>
              <div className="text-xs text-slate-500">
                Get notified when applications need follow-up
              </div>
            </div>

            <button
              onClick={() => setAutoFollowUp(!autoFollowUp)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                autoFollowUp ? "bg-indigo-600" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transform transition ${
                  autoFollowUp ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Weekly Summary */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Weekly Summary</div>
              <div className="text-xs text-slate-500">
                Receive weekly job search analytics
              </div>
            </div>

            <button
              onClick={() => setWeeklySummary(!weeklySummary)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                weeklySummary ? "bg-indigo-600" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transform transition ${
                  weeklySummary ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Stale Days */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">
                Stale Application Days
              </div>
              <div className="text-xs text-slate-500">
                Flag applications inactive after this many days
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                value={staleDays}
                onChange={(e) => setStaleDays(Number(e.target.value))}
                className="w-20 px-3 py-2 rounded-xl border border-slate-300 text-sm text-center"
              />
              <span className="text-sm text-slate-500">days</span>
            </div>
          </div>

        </div>

        {/* Logs */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

          <div className="p-4 border-b">
            <h3 className="font-semibold text-sm">Reminder Logs</h3>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Job</th>
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3">Frontend Dev @ Google</td>
                <td className="px-4 py-3">
                  <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full text-xs">
                    Follow-up
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">Apr 20</td>
                <td className="px-4 py-3">
                  <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded-full text-xs">
                    Pending
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3">UI Engineer @ Apple</td>
                <td className="px-4 py-3">
                  <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full text-xs">
                    Interview
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">Apr 19</td>
                <td className="px-4 py-3">
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full text-xs">
                    Completed
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3">Senior Dev @ Meta</td>
                <td className="px-4 py-3">
                  <span className="bg-rose-50 text-rose-600 px-2 py-1 rounded-full text-xs">
                    Rejection
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">Apr 15</td>
                <td className="px-4 py-3">
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full text-xs">
                    Handled
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3">Full Stack @ Stripe</td>
                <td className="px-4 py-3">
                  <span className="bg-amber-50 text-amber-600 px-2 py-1 rounded-full text-xs">
                    Offer Review
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">Apr 12</td>
                <td className="px-4 py-3">
                  <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded-full text-xs">
                    Pending
                  </span>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}