import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from "react";
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
  resume?: {
    id: string;
    versionName: string;
  } | null;
};

type JobForm = {
  company: string;
  role: string;
  jobUrl: string;
  appliedDate: string;
  notes: string;
  resumeId: string;
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
  APPLIED: "bg-indigo-600",
  INTERVIEW: "bg-emerald-500",
  OFFER: "bg-amber-500",
  REJECTED: "bg-rose-500",
};

const initialForm: JobForm = {
  company: "",
  role: "",
  jobUrl: "",
  appliedDate: new Date().toISOString().slice(0, 10),
  notes: "",
  resumeId: "",
};

const getJobId = (job: Job) => job._id || job.id || "";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(
    new Date(date)
  );

export function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<JobForm>(initialForm);
  const [resumes, setResumes] = useState<ResumeOption[]>([]);

  const groupedJobs = useMemo(
    () =>
      statuses.reduce<Record<string, Job[]>>((acc, status) => {
        acc[status] = jobs.filter((job) => job.status.toUpperCase() === status);
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
    });

    setForm(initialForm);
    setShowForm(false);
    loadJobs();
  }

  async function updateStatus(job: Job, status: string) {
    await api.patch(`/api/v1/jobs/${getJobId(job)}/status`, {
      status: status.toLowerCase(),
    });
    loadJobs();
  }

  return (
    <div className="app-shell flex min-h-screen flex-col">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-col gap-3 border-slate-200 bg-white px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <h2 className="text-xl font-bold text-slate-900">Job Pipeline</h2>

          <button
            onClick={() => setShowForm((value) => !value)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 sm:w-auto"
          >
            <span className="text-lg leading-none">+</span>
            Add Job
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="grid gap-3 border-y border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-5 lg:px-8"
          >
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Company"
              required
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-600"
            />
            <input
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="Role"
              required
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-600"
            />
            <input
              name="appliedDate"
              type="date"
              value={form.appliedDate}
              onChange={handleChange}
              required
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-600"
            />
            <input
              name="jobUrl"
              value={form.jobUrl}
              onChange={handleChange}
              placeholder="Job URL"
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-600"
            />
            <select
              name="resumeId"
              value={form.resumeId}
              onChange={handleChange}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-600"
            >
              <option value="">No resume linked</option>
              {resumes.map((resume) => (
                <option key={resume._id} value={resume._id}>
                  {resume.versionName}
                </option>
              ))}
            </select>
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
              Save
            </button>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Notes"
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-600 sm:col-span-2 lg:col-span-5"
            />
          </form>
        )}

        <div className="flex-1 overflow-x-auto bg-white p-4 sm:p-6">
          {loading ? (
            <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">
              Loading jobs...
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
              No job applications yet. Add your first job to start tracking.
            </div>
          ) : (
            <div className="grid min-w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 xl:min-w-[1000px]">
              {statuses.map((status) => (
                <div
                  key={status}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${colors[status]}`} />
                      <span className="font-semibold text-slate-800">
                        {labels[status]}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                        {groupedJobs[status].length}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {groupedJobs[status].map((job) => (
                      <div
                        key={getJobId(job)}
                        className="rounded-2xl bg-white p-4 shadow-sm hover:shadow-lg"
                      >
                        <div className="mb-3 flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 font-bold text-white">
                            {job.company[0]?.toUpperCase()}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="truncate font-medium">{job.role}</div>
                            <div className="text-sm text-slate-500">
                              {job.company}
                            </div>
                          </div>
                        </div>

                        <div className="mb-2 text-xs text-slate-400">
                          Applied {formatDate(job.appliedDate)}
                        </div>

                        {job.resume && (
                          <div className="mb-2 rounded-lg bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                            {job.resume.versionName}
                          </div>
                        )}

                        {job.notes && (
                          <div className="line-clamp-2 text-sm text-slate-500">
                            {job.notes}
                          </div>
                        )}

                        <div className="mt-3 border-t border-slate-100 pt-3">
                          <select
                            value={job.status.toUpperCase()}
                            onChange={(e) => updateStatus(job, e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700"
                          >
                            {statuses.map((item) => (
                              <option key={item} value={item}>
                                {labels[item]}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
