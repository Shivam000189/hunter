import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTheme } from "../context/ThemeContext";
import { Icon, type IconName } from "../components/ui/Icon";
import api from "../api/client";
import { Sidebar } from "../components/layout/Sidebar";

type Job = {
  id?: string;
  _id?: string;
  company: string;
  role: string;
  status: "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED" | string;
  appliedDate: string;
  notes?: string | null;
  jobUrl?: string | null;
  resumeId?: string | null;
  resume?: { id: string; versionName: string } | null;
};

type JobForm = {
  company: string;
  role: string;
  jobUrl: string;
  appliedDate: string;
  notes: string;
  resumeId: string;
  status: string;
};

type ResumeOption = {
  _id: string;
  versionName: string;
};

const statuses = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"] as const;

const labels: Record<string, string> = {
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
};

const colors: Record<string, string> = {
  APPLIED: "var(--hunter-info)",
  INTERVIEW: "var(--hunter-warning)",
  OFFER: "var(--hunter-success)",
  REJECTED: "var(--hunter-danger)",
};

const softColors: Record<string, string> = {
  APPLIED: "rgba(127, 147, 201, 0.12)",
  INTERVIEW: "rgba(200, 170, 120, 0.15)",
  OFFER: "rgba(111, 143, 122, 0.12)",
  REJECTED: "rgba(179, 119, 122, 0.12)",
};

const statusIcons: Record<string, IconName> = {
  APPLIED: "Send",
  INTERVIEW: "Users",
  OFFER: "PartyPopper",
  REJECTED: "XCircle",
};

const initialForm: JobForm = {
  company: "",
  role: "",
  jobUrl: "",
  appliedDate: new Date().toISOString().slice(0, 10),
  notes: "",
  resumeId: "",
  status: "APPLIED",
};

const getJobId = (job: Job) => job._id || job.id || "";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(
    new Date(date)
  );

export function Jobs() {
  const { isDark } = useTheme();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<JobForm>(initialForm);
  const [resumes, setResumes] = useState<ResumeOption[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const groupedJobs = useMemo(
    () =>
      statuses.reduce<Record<string, Job[]>>((acc, status) => {
        acc[status] = jobs.filter(
          (job) => job.status.toUpperCase() === status
        );
        return acc;
      }, {}),
    [jobs]
  );

  function loadJobs() {
    setLoading(true);
    api
      .get("/api/v1/jobs", { params: { limit: 100 } })
      .then((res) => setJobs(res.data.data || []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadJobs();
    api
      .get("/api/v1/resumes")
      .then((res) => setResumes(res.data.data || []))
      .catch(() => setResumes([]));
  }, []);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await api.post("/api/v1/jobs", {
      company: form.company,
      role: form.role,
      jobUrl: form.jobUrl || undefined,
      appliedDate: form.appliedDate,
      notes: form.notes || undefined,
      resumeId: form.resumeId || undefined,
      status: form.status.toLowerCase(),
    });

    setForm(initialForm);
    setShowForm(false);
    loadJobs();
  }

  const clicklink = (url: string) => {
    window.open(url, "_blank");
  };

  async function updateStatus(job: Job, status: string) {
    await api.patch(`/api/v1/jobs/${getJobId(job)}/status`, {
      status: status.toLowerCase(),
    });
    loadJobs();
  }

  /* ── Drag & Drop ── */
  const handleDragStart = (
    e: React.DragEvent,
    jobId: string,
    fromCol: string
  ) => {
    e.dataTransfer.setData("jobId", jobId);
    e.dataTransfer.setData("fromCol", fromCol);
    setDraggingId(jobId);
  };

  const handleDragEnd = () => setDraggingId(null);

  const handleDrop = (e: React.DragEvent, toCol: string) => {
    e.preventDefault();
    const jobId = e.dataTransfer.getData("jobId");
    const fromCol = e.dataTransfer.getData("fromCol");
    if (!jobId || !fromCol || fromCol === toCol) {
      setDraggingId(null);
      return;
    }
    const job = groupedJobs[fromCol]?.find((j) => getJobId(j) === jobId);
    if (!job) {
      setDraggingId(null);
      return;
    }
    updateStatus(job, toCol);
    setDraggingId(null);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  async function handleDeleteJob(jobId: string) {
    if (window.confirm("Delete this job application?")) {
      await api.delete(`/api/v1/jobs/${jobId}`);
      loadJobs();
    }
  }

  return (
    <div
      className="app-shell flex min-h-screen flex-col"
      style={{
        background: isDark ? "#0f0f11" : "var(--hunter-bg)",
        color: isDark ? "white" : "var(--hunter-text)",
      }}
    >
      <Sidebar />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <div
          className={`flex flex-col gap-3 px-6 py-5 sm:px-8 md:flex-row md:items-center md:justify-between ${
            isDark ? "border-b border-white/8" : "border-b border-black/6"
          }`}
        >
          <div className="animate-fade-in-up">
            <h1 className="font-display text-3xl font-medium">
              Jobs
            </h1>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--hunter-muted)" }}
            >
              Drag cards between columns to update status.
            </p>
          </div>

          <button
            onClick={() => setShowForm((v) => !v)}
            className={`hunter-btn-primary inline-flex items-center gap-2 ${
              isDark ? "bg-white/12 hover:bg-white/18" : ""
            }`}
          >
            <Icon name="Plus" size={16} />
            {showForm ? "Close" : "Add Job"}
          </button>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto p-6 sm:p-8">
          {loading ? (
            <div
              className="hunter-panel mx-auto max-w-md rounded-2xl p-8 text-center text-sm animate-fade-in-up"
              style={{ color: "var(--hunter-muted)" }}
            >
              <div className="shimmer-bar mx-auto h-4 w-32 rounded-full" />
              <p className="mt-3">Loading jobs…</p>
            </div>
          ) : jobs.length === 0 ? (
            <div
              className="hunter-panel mx-auto max-w-md rounded-2xl border border-dashed p-12 text-center animate-fade-in-up"
              style={{
                borderColor: isDark
                  ? "rgba(255,255,255,0.1)"
                  : "var(--hunter-border)",
                color: "var(--hunter-muted)",
              }}
            >
              <Icon
                name="Inbox"
                size={32}
                className="mx-auto mb-3"
                style={{ opacity: 0.4 }}
              />
              <p className="text-base font-medium">
                No job applications yet
              </p>
              <p className="mt-1 text-sm">
                Add your first job to start tracking.
              </p>
            </div>
          ) : (
            <div className="grid min-w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 xl:min-w-[1000px]">
              {statuses.map((status, ci) => (
                <div
                  key={status}
                  className="kanban-column hunter-panel p-4 animate-fade-in-up"
                  style={{
                    animationDelay: `${ci * 40}ms`,
                    background: isDark
                      ? "rgba(255,255,255,0.04)"
                      : "var(--hunter-surface)",
                  }}
                  onDrop={(e) => handleDrop(e, status)}
                  onDragOver={handleDragOver}
                >
                  {/* Column Header */}
                  <div
                    className="mb-4 flex items-center justify-between pb-3"
                    style={{
                      borderBottom: `1px solid ${
                        isDark
                          ? "rgba(255,255,255,0.08)"
                          : "var(--hunter-border)"
                      }`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: colors[status] }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{
                          color: isDark ? "white" : "var(--hunter-text)",
                        }}
                      >
                        {labels[status]}
                      </span>
                      <span
                        className="rounded-md px-1.5 py-0.5 text-xs"
                        style={{
                          background: isDark
                            ? "rgba(255,255,255,0.08)"
                            : "var(--hunter-bg)",
                          color: "var(--hunter-muted)",
                        }}
                      >
                        {groupedJobs[status].length}
                      </span>
                    </div>
                    <Icon
                      name={statusIcons[status]}
                      size={16}
                      style={{ color: colors[status] }}
                    />
                  </div>

                  {/* Cards */}
                  <div className="space-y-3">
                    {groupedJobs[status].map((job, ji) => (
                      <div
                        key={getJobId(job)}
                        className={`kanban-card group ${
                          draggingId === getJobId(job) ? "dragging" : ""
                        }`}
                        draggable
                        onDragStart={(e) =>
                          handleDragStart(e, getJobId(job), status)
                        }
                        onDragEnd={handleDragEnd}
                        style={{ animationDelay: `${ci * 40 + ji * 40}ms` }}
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <div className="flex min-w-0 flex-1 items-start gap-3">
                            <div
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                              style={{
                                background: "var(--hunter-primary)",
                              }}
                            >
                              {job.company[0]?.toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div
                                className="truncate text-sm font-medium"
                                style={{
                                  color: isDark
                                    ? "white"
                                    : "var(--hunter-text)",
                                }}
                              >
                                {job.role}
                              </div>
                              <div
                                className="mt-0.5 truncate text-xs"
                                style={{
                                  color: "var(--hunter-muted)",
                                  cursor: job.jobUrl
                                    ? "pointer"
                                    : "default",
                                }}
                                onClick={() =>
                                  job.jobUrl && clicklink(job.jobUrl)
                                }
                              >
                                {job.company}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteJob(getJobId(job))}
                            className="ml-1 shrink-0 cursor-pointer border-none bg-transparent p-1 opacity-0 transition-opacity group-hover:opacity-100"
                            style={{ color: "var(--hunter-danger)" }}
                            title="Delete"
                          >
                            <Icon name="XCircle" size={14} />
                          </button>
                        </div>

                        {job.resume && (
                          <div
                            className="mb-2 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium"
                            style={{
                              background: softColors[status],
                              color: colors[status],
                            }}
                          >
                            <Icon name="FileText" size={10} />
                            {job.resume.versionName}
                          </div>
                        )}

                        {job.notes && (
                          <div
                            className="mb-2 line-clamp-2 text-xs"
                            style={{ color: "var(--hunter-muted)" }}
                          >
                            {job.notes}
                          </div>
                        )}

                        <div
                          className="mt-2 flex items-center gap-3 pt-3 text-xs"
                          style={{
                            borderTop: `1px solid ${
                              isDark
                                ? "rgba(255,255,255,0.06)"
                                : "var(--hunter-border)"
                            }`,
                            color: "var(--hunter-muted)",
                          }}
                        >
                          <span className="inline-flex items-center gap-1">
                            <Icon name="Calendar" size={12} />
                            {formatDate(job.appliedDate)}
                          </span>
                          {job.jobUrl && (
                            <span
                              className="inline-flex cursor-pointer items-center gap-1 transition hover:underline"
                              onClick={() => clicklink(job.jobUrl!)}
                            >
                              <Icon name="ExternalLink" size={12} />
                              Link
                            </span>
                          )}
                        </div>

                        <div className="mt-3">
                          <select
                            value={job.status.toUpperCase()}
                            onChange={(e) => updateStatus(job, e.target.value)}
                            className="hunter-input cursor-pointer py-2 text-xs"
                          >
                            {statuses.map((item) => (
                              <option key={item} value={item}>
                                Move to {labels[item]}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}

                    {groupedJobs[status].length === 0 && (
                      <div
                        className="animate-fade-in py-8 text-center text-xs"
                        style={{ color: "var(--hunter-muted)" }}
                      >
                        <Icon
                          name="Inbox"
                          size={24}
                          className="mx-auto mb-2"
                          style={{ opacity: 0.4 }}
                        />
                        Drop jobs here
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Job Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div
            className="hunter-panel w-full max-w-lg animate-fade-in-up rounded-2xl p-6"
            style={{
              background: isDark
                ? "rgba(30,30,35,0.95)"
                : "var(--hunter-surface-strong)",
              borderColor: isDark
                ? "rgba(255,255,255,0.08)"
                : "var(--hunter-border)",
            }}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-xl font-medium">
                Track New Application
              </h3>
              <button
                className="cursor-pointer border-none bg-transparent p-1 transition"
                style={{ color: "var(--hunter-muted)" }}
                onClick={() => setShowForm(false)}
              >
                <Icon name="XCircle" size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    className="mb-1.5 block text-xs font-medium"
                    style={{ color: "var(--hunter-muted)" }}
                  >
                    Company Name
                  </label>
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="e.g. Linear"
                    required
                    className="hunter-input"
                  />
                </div>
                <div>
                  <label
                    className="mb-1.5 block text-xs font-medium"
                    style={{ color: "var(--hunter-muted)" }}
                  >
                    Job Role
                  </label>
                  <input
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    placeholder="e.g. Senior Designer"
                    required
                    className="hunter-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    className="mb-1.5 block text-xs font-medium"
                    style={{ color: "var(--hunter-muted)" }}
                  >
                    Applied Date
                  </label>
                  <input
                    name="appliedDate"
                    type="date"
                    value={form.appliedDate}
                    onChange={handleChange}
                    required
                    className="hunter-input"
                  />
                </div>
                <div>
                  <label
                    className="mb-1.5 block text-xs font-medium"
                    style={{ color: "var(--hunter-muted)" }}
                  >
                    Pipeline Stage
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="hunter-input cursor-pointer"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {labels[s]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  className="mb-1.5 block text-xs font-medium"
                  style={{ color: "var(--hunter-muted)" }}
                >
                  Job URL
                </label>
                <input
                  name="jobUrl"
                  value={form.jobUrl}
                  onChange={handleChange}
                  placeholder="https://careers.company.com/..."
                  className="hunter-input"
                />
              </div>

              <div>
                <label
                  className="mb-1.5 block text-xs font-medium"
                  style={{ color: "var(--hunter-muted)" }}
                >
                  Linked Resume
                </label>
                <select
                  name="resumeId"
                  value={form.resumeId}
                  onChange={handleChange}
                  className="hunter-input cursor-pointer"
                >
                  <option value="">No resume linked</option>
                  {resumes.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.versionName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="mb-1.5 block text-xs font-medium"
                  style={{ color: "var(--hunter-muted)" }}
                >
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Any additional details…"
                  rows={3}
                  className="hunter-input"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  className="hunter-btn-ghost flex-1"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="hunter-btn-accent flex-1">
                  Add Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}