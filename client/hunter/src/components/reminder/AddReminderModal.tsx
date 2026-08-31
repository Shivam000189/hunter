import React, { useState } from "react";
import { X, Plus, Calendar, Building2, Bell } from "lucide-react";

interface AddReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReminder: (data: {
    company: string;
    action: string;
    date: string;
    priority: "low" | "medium" | "high";
  }) => Promise<void> | void;
}

export const AddReminderModal: React.FC<AddReminderModalProps> = ({
  isOpen,
  onClose,
  onAddReminder,
}) => {
  const [company, setCompany] = useState("");
  const [action, setAction] = useState("Follow up on application");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) return;

    setLoading(true);
    try {
      await onAddReminder({
        company: company.trim(),
        action: action.trim(),
        date,
        priority,
      });

      setCompany("");
      setAction("Follow up on application");
      setPriority("medium");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md overflow-hidden hunter-panel border border-white/20 bg-white/95 dark:bg-slate-900/95 shadow-2xl p-6 sm:p-7 animate-fade-in-up">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Schedule Follow-up</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Never miss an outreach or interview check-in</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Target Company *
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. Google, Stripe, Meta"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="hunter-input pl-10 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Action Objective
            </label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="hunter-input text-sm cursor-pointer"
            >
              <option>Follow up on application status</option>
              <option>Send post-interview thank you email</option>
              <option>Check application portal update</option>
              <option>Prepare for upcoming technical round</option>
              <option>Submit take-home project / portfolio</option>
              <option>Reach out to team lead or recruiter on LinkedIn</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Due Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="hunter-input pl-10 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Priority Urgency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["low", "medium", "high"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition border cursor-pointer ${
                    priority === p
                      ? p === "high"
                        ? "bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                        : p === "medium"
                        ? "bg-amber-50 border-amber-500 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                        : "bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="hunter-btn-ghost flex-1 py-2.5 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="hunter-btn-primary flex-1 py-2.5 text-sm flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{loading ? "Saving..." : "Save Reminder"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
