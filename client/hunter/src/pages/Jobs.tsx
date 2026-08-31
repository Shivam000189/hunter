import {
  type DragEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { Sidebar } from "../components/layout/Sidebar";
import { AddJobModal } from "../components/jobs/AddJobModal";
import {
  Search,
  Plus,
  Trash2,
  MapPin,
  DollarSign,
  Calendar,
  ExternalLink,
  Headphones,
  FileText,
  TrendingUp,
} from "lucide-react";

type Job = {
  id?: string;
  _id?: string;
  company: string;
  role: string;
  status: "applied" | "interview" | "offer" | "rejected" | "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED" | string;
  salary?: string;
  location?: string;
  appliedDate: string;
  notes?: string | null;
  jobUrl?: string | null;
  resumeId?: string | null;
  resume?: { id: string; versionName: string } | null;
};

type ResumeOption = {
  _id: string;
  versionName: string;
};

const stages = [
  {
    key: "applied",
    title: "Applied",
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    avatarBg: "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
  },
  {
    key: "interview",
    title: "Interview",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    avatarBg: "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200",
  },
  {
    key: "offer",
    title: "Offer Received",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    avatarBg: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200",
  },
  {
    key: "rejected",
    title: "Rejected",
    dot: "bg-rose-500",
    badge: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    avatarBg: "bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200",
  },
] as const;

const getJobId = (job: Job) => job._id || job.id || "";

const formatDate = (date: string) => {
  try {
    return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(date));
  } catch {
    return date;
  }
};

export function Jobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [resumes, setResumes] = useState<ResumeOption[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [draggedJobId, setDraggedJobId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  function loadJobs() {
    api
      .get("/api/v1/jobs", { params: { limit: 100 } })
      .then((res) => {
        const fetched = res.data.data;
        if (Array.isArray(fetched)) {
          setJobs(fetched);
        } else {
          setJobs([]);
        }
      })
      .catch(() => {
        setJobs([]);
      });
  }

  useEffect(() => {
    loadJobs();
    api
      .get("/api/v1/resumes")
      .then((res) => setResumes(res.data.data || []))
      .catch(() => setResumes([]));
  }, []);

  const handleAddJob = async (newJobData: any) => {
    try {
      await api.post("/api/v1/jobs", newJobData);
      loadJobs();
    } catch {
      // optimistic fallback
      const localJob: Job = {
        _id: String(Date.now()),
        company: newJobData.company,
        role: newJobData.role,
        salary: newJobData.salary,
        location: newJobData.location,
        status: newJobData.status,
        appliedDate: newJobData.appliedDate,
        jobUrl: newJobData.jobUrl,
        notes: newJobData.notes,
      };
      setJobs((prev) => [localJob, ...prev]);
    }
  };

  const updateJobStatus = async (jobId: string, newStatus: string) => {
    setJobs((prev) =>
      prev.map((j) => (getJobId(j) === jobId ? { ...j, status: newStatus.toLowerCase() } : j))
    );

    try {
      await api.patch(`/api/v1/jobs/${jobId}/status`, {
        status: newStatus.toLowerCase(),
      });
    } catch {
      // Handled
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm("Are you sure you want to remove this job application?")) {
      setJobs((prev) => prev.filter((j) => getJobId(j) !== jobId));
      try {
        await api.delete(`/api/v1/jobs/${jobId}`);
      } catch {
        // Handled
      }
    }
  };

  const handleOpenCoverLetter = (company: string, role: string) => {
    sessionStorage.setItem("hunter-cl-company", company);
    sessionStorage.setItem("hunter-cl-role", role);
    navigate("/generator");
  };

  // Filter jobs by search
  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return jobs;
    const q = searchQuery.toLowerCase();
    return jobs.filter((j) => {
      const comp = j.company.toLowerCase();
      const role = j.role.toLowerCase();
      const loc = (j.location || "").toLowerCase();
      const sal = (j.salary || "").toLowerCase();
      return comp.includes(q) || role.includes(q) || loc.includes(q) || sal.includes(q);
    });
  }, [jobs, searchQuery]);

  // Group by stage
  const groupedJobs = useMemo(() => {
    return stages.reduce<Record<string, Job[]>>((acc, col) => {
      acc[col.key] = filteredJobs.filter(
        (job) => job.status.toLowerCase() === col.key.toLowerCase()
      );
      return acc;
    }, {});
  }, [filteredJobs]);

  // Drag and Drop handlers
  const handleDragStart = (e: DragEvent, jobId: string) => {
    setDraggedJobId(jobId);
    e.dataTransfer.setData("text/plain", jobId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: DragEvent, columnKey: string) => {
    e.preventDefault();
    setDragOverColumn(columnKey);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: DragEvent, columnKey: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    if (draggedJobId) {
      updateJobStatus(draggedJobId, columnKey);
      setDraggedJobId(null);
    }
  };

  return (
    <div className="app-shell flex min-h-screen flex-col font-sans">
      <Sidebar />

      <main className="flex-1 overflow-x-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header with Search and Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Interactive Pipeline Tracker</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Job Application Board
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Drag cards between stages to update status in real-time. ({jobs.length} tracked roles)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search companies, roles, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="hunter-input pl-10 text-sm py-2.5 shadow-xs"
              />
            </div>

            <button
              onClick={() => setIsAddJobOpen(true)}
              className="hunter-btn-primary flex items-center gap-2 text-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Job</span>
            </button>
          </div>
        </div>

        {/* 4 Kanban Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 min-w-[320px]">
          {stages.map((col) => {
            const columnJobs = groupedJobs[col.key] || [];
            const isOver = dragOverColumn === col.key;

            return (
              <div
                key={col.key}
                onDragOver={(e) => handleDragOver(e, col.key)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.key)}
                className={`flex flex-col rounded-2xl p-4 transition-all duration-200 min-h-[560px] hunter-panel border ${
                  isOver
                    ? "bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-500 ring-2 ring-indigo-500/50"
                    : "border-slate-200/80 dark:border-slate-800"
                }`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/80 dark:border-slate-800 px-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">
                      {col.title}
                    </h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${col.badge}`}>
                      {columnJobs.length}
                    </span>
                  </div>

                  <button
                    onClick={() => setIsAddJobOpen(true)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title={`Add job to ${col.title}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Column Cards */}
                <div className="flex-1 space-y-3.5">
                  {columnJobs.length === 0 ? (
                    <div className="h-44 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-400 text-xs p-4 text-center">
                      <span className="font-medium">No roles in this stage</span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                        Drag applications here
                      </span>
                    </div>
                  ) : (
                    columnJobs.map((job) => {
                      const id = getJobId(job);
                      return (
                        <div
                          key={id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, id)}
                          onDragEnd={() => setDraggedJobId(null)}
                          className="kanban-card group relative select-none"
                        >
                          {/* Card Header: Company Logo & Delete */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${col.avatarBg}`}
                              >
                                {job.company.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                                {job.company}
                              </span>
                            </div>

                            <button
                              onClick={() => handleDeleteJob(id)}
                              className="text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 opacity-0 group-hover:opacity-100 transition p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                              title="Delete application"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Role Position */}
                          <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 mb-2">
                            {job.role}
                          </h4>

                          {/* Details: Salary & Location */}
                          <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                            {job.location && (
                              <div className="flex items-center gap-1.5 truncate">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{job.location}</span>
                              </div>
                            )}
                            {job.salary && (
                              <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                                <DollarSign className="w-3 h-3 shrink-0" />
                                <span>{job.salary}</span>
                              </div>
                            )}
                          </div>

                          {/* Linked Resume or Notes */}
                          {job.resume && (
                            <div className="mb-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 text-[10px] font-semibold border border-indigo-200 dark:border-indigo-800">
                              <FileText className="w-3 h-3" />
                              <span className="truncate max-w-[120px]">{job.resume.versionName}</span>
                            </div>
                          )}

                          {job.notes && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-2 italic">
                              "{job.notes}"
                            </p>
                          )}

                          {/* Footer: Applied Date & AI Cover Letter Link */}
                          <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/70 dark:border-slate-800 text-[11px]">
                            <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {formatDate(job.appliedDate)}
                            </span>

                            <div className="flex items-center gap-2">
                              {job.jobUrl && (
                                <a
                                  href={job.jobUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-0.5"
                                  title="Open job link"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}

                              <button
                                onClick={() => handleOpenCoverLetter(job.company, job.role)}
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
                                title="Draft AI Cover Letter for this position"
                              >
                                <Headphones className="w-3 h-3" />
                                <span>AI Letter</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Add Job Modal */}
      <AddJobModal
        isOpen={isAddJobOpen}
        onClose={() => setIsAddJobOpen(false)}
        onAddJob={handleAddJob}
        resumes={resumes}
      />
    </div>
  );
}