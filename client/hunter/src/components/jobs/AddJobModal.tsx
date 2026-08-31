import React, { useState } from "react";
import { X, Plus, Building2, Briefcase, DollarSign, MapPin, Link as LinkIcon, FileText, Calendar } from "lucide-react";

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddJob: (job: {
    company: string;
    role: string;
    salary?: string;
    location?: string;
    status: string;
    appliedDate: string;
    jobUrl?: string;
    resumeId?: string;
    notes?: string;
  }) => Promise<void> | void;
  resumes?: { _id: string; versionName: string }[];
}

export const AddJobModal: React.FC<AddJobModalProps> = ({
  isOpen,
  onClose,
  onAddJob,
  resumes = [],
}) => {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("applied");
  const [appliedDate, setAppliedDate] = useState(new Date().toISOString().slice(0, 10));
  const [jobUrl, setJobUrl] = useState("");
  const [resumeId, setResumeId] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    setLoading(true);
    try {
      await onAddJob({
        company: company.trim(),
        role: role.trim(),
        salary: salary.trim() || undefined,
        location: location.trim() || "Remote",
        status: status.toLowerCase(),
        appliedDate,
        jobUrl: jobUrl.trim() || undefined,
        resumeId: resumeId || undefined,
        notes: notes.trim() || undefined,
      });

      setCompany("");
      setRole("");
      setSalary("");
      setLocation("");
      setStatus("applied");
      setJobUrl("");
      setResumeId("");
      setNotes("");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg overflow-hidden hunter-panel border border-white/20 bg-white/95 dark:bg-slate-900/95 shadow-2xl p-6 sm:p-7 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Track New Job</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Add an application to your active hiring pipeline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Company Name *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Stripe, Apple, Figma"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="hunter-input pl-10 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Position / Role *
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Frontend Engineer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="hunter-input pl-10 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Salary Target / Range
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. $140k - $180k"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="hunter-input pl-10 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Remote, San Francisco, CA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="hunter-input pl-10 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Pipeline Stage
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="hunter-input text-sm cursor-pointer"
              >
                <option value="applied">Applied</option>
                <option value="interview">Interview Stage</option>
                <option value="offer">Offer Received</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Applied Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={appliedDate}
                  onChange={(e) => setAppliedDate(e.target.value)}
                  className="hunter-input pl-10 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Job Posting URL
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  placeholder="https://careers.company.com/..."
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  className="hunter-input pl-10 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Linked Resume
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={resumeId}
                  onChange={(e) => setResumeId(e.target.value)}
                  className="hunter-input pl-10 text-sm cursor-pointer"
                >
                  <option value="">No linked resume</option>
                  {resumes.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.versionName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Notes & Next Steps
            </label>
            <textarea
              rows={2}
              placeholder="Referral contact, recruiter info, tech stack notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="hunter-input text-sm resize-none"
            />
          </div>

          {/* Action buttons */}
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
              <span>{loading ? "Adding..." : "Save Application"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
