import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { Sidebar } from "../components/layout/Sidebar";
import { AddJobModal } from "../components/jobs/AddJobModal";
import {
  Briefcase,
  Video,
  Award,
  TrendingUp,
  Calendar,
  Clock,
  Plus,
  ArrowRight,
  Headphones,
} from "lucide-react";

type Job = {
  _id?: string;
  id?: string;
  company: string;
  role: string;
  status: string;
  appliedDate: string;
  salary?: string;
  location?: string;
  notes?: string;
};

type AnalyticsData = {
  totalApplications: number;
  statusBreakdown: Record<"applied" | "interview" | "offer" | "rejected", number>;
  responseRate: number;
  offerRate: number;
  weeklyApplications: { week: string; count: number }[];
  avgDaysToResponse: number;
  resumeInsights: {
    bestPerformingResume: any;
    resumes: any[];
  };
};

type User = {
  name: string;
  email?: string;
};

const emptyAnalytics: AnalyticsData = {
  totalApplications: 0,
  statusBreakdown: { applied: 0, interview: 0, offer: 0, rejected: 0 },
  responseRate: 0,
  offerRate: 0,
  weeklyApplications: [],
  avgDaysToResponse: 0,
  resumeInsights: {
    bestPerformingResume: null,
    resumes: [],
  },
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 5) return "Good Night";
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  if (hour < 21) return "Good Evening";
  return "Good Night";
};

const formatDate = (dateString: string) => {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
};

export function Dashboard() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<AnalyticsData>(emptyAnalytics);
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [resumes, setResumes] = useState<{ _id: string; versionName: string }[]>([]);

  const loadData = () => {
    Promise.all([
      api.get("/api/v1/analytics").catch(() => ({ data: { data: emptyAnalytics } })),
      api.get("/api/auth/me").catch(() => ({ data: { data: null } })),
      api.get("/api/v1/jobs", { params: { limit: 100 } }).catch(() => ({ data: { data: [] } })),
      api.get("/api/v1/resumes").catch(() => ({ data: { data: [] } })),
    ]).then(([analyticsRes, userRes, jobsRes, resumesRes]) => {
      setAnalytics(analyticsRes.data?.data || emptyAnalytics);
      setUser(userRes.data?.data || null);
      setJobs(jobsRes.data?.data || []);
      setResumes(resumesRes.data?.data || []);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddJob = async (jobData: any) => {
    await api.post("/api/v1/jobs", jobData);
    loadData();
  };

  const total = analytics.totalApplications || jobs.length || 0;
  const appliedCount = analytics.statusBreakdown?.applied || jobs.filter(j => j.status?.toLowerCase() === "applied").length || 0;
  const interviewCount = analytics.statusBreakdown?.interview || jobs.filter(j => j.status?.toLowerCase() === "interview").length || 0;
  const offerCount = analytics.statusBreakdown?.offer || jobs.filter(j => j.status?.toLowerCase() === "offer").length || 0;
  const rejectedCount = analytics.statusBreakdown?.rejected || jobs.filter(j => j.status?.toLowerCase() === "rejected").length || 0;

  const appliedPct = total > 0 ? Math.round((appliedCount / total) * 100) : 0;
  const interviewPct = total > 0 ? Math.round((interviewCount / total) * 100) : 0;
  const offerPct = total > 0 ? Math.round((offerCount / total) * 100) : 0;
  const rejectedPct = total > 0 ? Math.round((rejectedCount / total) * 100) : 0;

  const responseRate = total > 0 ? Math.round(((interviewCount + offerCount) / total) * 100) : 0;

  // Real weekly cadence from server or calculated from jobs
  const weeklyCadence = analytics.weeklyApplications && analytics.weeklyApplications.length > 0
    ? analytics.weeklyApplications.map((w) => ({
        day: w.week,
        count: w.count,
        height: `${Math.min(Math.max(w.count * 15, 15), 95)}%`,
      }))
    : [
        { day: "Mon", count: 0, height: "10%" },
        { day: "Tue", count: 0, height: "10%" },
        { day: "Wed", count: 0, height: "10%" },
        { day: "Thu", count: 0, height: "10%" },
        { day: "Fri", count: 0, height: "10%" },
        { day: "Sat", count: 0, height: "10%" },
        { day: "Sun", count: 0, height: "10%" },
      ];

  // Active interviews from real jobs
  const upcomingInterviews = jobs
    .filter((j) => j.status?.toLowerCase() === "interview")
    .slice(0, 4);

  // Recent jobs activity
  const recentActivity = [...jobs]
    .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    .slice(0, 5);

  return (
    <div className="app-shell flex min-h-screen flex-col font-sans">
      <Sidebar />

      <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 mb-1">
              <Headphones className="w-3.5 h-3.5" />
              <span>Hiring Pipeline Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {getGreeting()}, {user?.name ? user.name.split(" ")[0] : "Hunter"} 👋
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Here is your active pipeline velocity and scheduled milestones.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/jobs")}
              className="hunter-btn-ghost flex items-center gap-2 text-sm"
            >
              <Briefcase className="w-4 h-4" />
              <span>Open Board</span>
            </button>
            <button
              onClick={() => setIsAddJobOpen(true)}
              className="hunter-btn-primary flex items-center gap-2 text-sm shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Application</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Total Applications */}
          <div className="hunter-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                Tracked
              </span>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{total}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              Total Applications
            </div>
          </div>

          {/* Active Interviews */}
          <div className="hunter-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                {interviewCount} Active
              </span>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{interviewCount}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              Interview Stages
            </div>
          </div>

          {/* Job Offers */}
          <div className="hunter-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                {offerCount} Extended
              </span>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{offerCount}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              Formal Job Offers
            </div>
          </div>

          {/* Response Rate */}
          <div className="hunter-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                Conversion
              </span>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{responseRate}%</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              Response Rate
            </div>
          </div>
        </div>

        {/* Middle Row: Weekly Cadence Bar Chart & Pipeline Distribution */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Weekly Cadence Bar Chart */}
          <div className="lg:col-span-2 hunter-panel p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Weekly Application Velocity
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Submission volume trends recorded by server
                </p>
              </div>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900/60">
                {total} Applications Tracked
              </span>
            </div>

            <div className="flex items-end justify-between gap-3 h-48 pt-6 pb-2">
              {weeklyCadence.map((bar, idx) => (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
                >
                  <div
                    className="w-full max-w-[42px] bg-indigo-100 dark:bg-indigo-950/80 group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500 rounded-t-xl transition-all relative flex items-end justify-center"
                    style={{ height: bar.height }}
                  >
                    <div className="absolute -top-6 text-[11px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {bar.count}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {bar.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline Distribution */}
          <div className="hunter-panel p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Pipeline Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Stage breakdown across active applications
              </p>

              <div className="flex items-center justify-center my-3">
                <div className="relative w-36 h-36">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="none"
                      stroke="currentColor"
                      className="text-slate-100 dark:text-slate-800"
                      strokeWidth="3.2"
                    />
                    {total > 0 && (
                      <>
                        <circle
                          cx="18"
                          cy="18"
                          r="15.9"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="3.2"
                          strokeDasharray={`${appliedPct} ${100 - appliedPct}`}
                          strokeDashoffset="0"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="15.9"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="3.2"
                          strokeDasharray={`${interviewPct} ${100 - interviewPct}`}
                          strokeDashoffset={`-${appliedPct}`}
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="15.9"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3.2"
                          strokeDasharray={`${offerPct} ${100 - offerPct}`}
                          strokeDashoffset={`-${appliedPct + interviewPct}`}
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="15.9"
                          fill="none"
                          stroke="#f43f5e"
                          strokeWidth="3.2"
                          strokeDasharray={`${rejectedPct} ${100 - rejectedPct}`}
                          strokeDashoffset={`-${appliedPct + interviewPct + offerPct}`}
                        />
                      </>
                    )}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {total}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Roles
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-200/80 dark:border-slate-800 text-xs font-medium">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-slate-600 dark:text-slate-400">Applied</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {appliedCount} ({appliedPct}%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-600 dark:text-slate-400">Interview</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {interviewCount} ({interviewPct}%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-400">Offer</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {offerCount} ({offerPct}%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-slate-600 dark:text-slate-400">Rejected</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {rejectedCount} ({rejectedPct}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Recent Activity & Upcoming Interviews */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="hunter-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Pipeline Activity
              </h3>
              <button
                onClick={() => navigate("/jobs")}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View all jobs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {recentActivity.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300">No applications yet</p>
                  <p className="mt-1">Add your first job to start tracking activity.</p>
                </div>
              ) : (
                recentActivity.map((job) => (
                  <div
                    key={job._id || job.id}
                    className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200/80 dark:border-indigo-900/60 font-bold text-xs text-indigo-600 dark:text-indigo-400">
                      {job.company.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                        {job.company} — {job.role}
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate capitalize">
                        Status: {job.status} • Applied {formatDate(job.appliedDate)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Interviews */}
          <div className="hunter-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Active Interview Stages
              </h3>
              <button
                onClick={() => navigate("/interview")}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Practice AI Mock</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {upcomingInterviews.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  <Video className="w-8 h-8 mx-auto mb-2 opacity-50 text-amber-500" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300">No active interviews yet</p>
                  <p className="mt-1">When an application moves to interview stage, it appears here.</p>
                </div>
              ) : (
                upcomingInterviews.map((item) => (
                  <div
                    key={item._id || item.id}
                    className="border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/30 transition"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {item.company} — {item.role}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                        Interview Stage
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDate(item.appliedDate)}
                      </span>
                      {item.location && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {item.location}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Global Add Job Modal */}
      <AddJobModal
        isOpen={isAddJobOpen}
        onClose={() => setIsAddJobOpen(false)}
        onAddJob={handleAddJob}
        resumes={resumes}
      />
    </div>
  );
}
