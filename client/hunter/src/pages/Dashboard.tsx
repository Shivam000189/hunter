import { useEffect, useState } from "react";
import api from "../api/client";
import { WeeklyChart } from "../charts/WeeklyChart";
import { Sidebar } from "../components/layout/Sidebar";
import { StatusChart } from "../charts/StatusChart";

type AnalyticsData = {
  totalApplications: number;
  statusBreakdown: Record<"applied" | "interview" | "offer" | "rejected", number>;
  responseRate: number;
  offerRate: number;
  weeklyApplications: { week: string; count: number }[];
  avgDaysToResponse: number;
  resumeInsights: {
    bestPerformingResume: {
      versionName: string;
      usage: number;
      interviews: number;
      offers: number;
      successRate: number;
    } | null;
    resumes: {
      _id: string;
      versionName: string;
      usage: number;
      interviews: number;
      offers: number;
      successRate: number;
    }[];
  };
};

type User = {
  name: string;
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

export function Dashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData>(emptyAnalytics);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/api/v1/analytics"),
      api.get("/api/auth/me"),
    ])
      .then(([analyticsRes, userRes]) => {
        setAnalytics(analyticsRes.data.data || emptyAnalytics);
        setUser(userRes.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const statusLabels = ["Applied", "Interview", "Offer", "Rejected"];
  const statusValues = [
    analytics.statusBreakdown.applied,
    analytics.statusBreakdown.interview,
    analytics.statusBreakdown.offer,
    analytics.statusBreakdown.rejected,
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 lg:flex-row">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-col gap-4 bg-slate-50 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Good morning{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
            </h2>
            <p className="text-sm text-slate-500">
              Here's your job search overview
            </p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loading ? (
            <div className="rounded-2xl bg-white p-5 text-sm text-slate-500 shadow-sm">
              Loading your dashboard...
            </div>
          ) : (
            <>
              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Total Applications</p>
                  <h3 className="mt-2 text-3xl font-bold">
                    {analytics.totalApplications}
                  </h3>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Response Rate</p>
                  <h3 className="mt-2 text-3xl font-bold">
                    {analytics.responseRate}%
                  </h3>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Offer Rate</p>
                  <h3 className="mt-2 text-3xl font-bold">
                    {analytics.offerRate}%
                  </h3>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Interviews</p>
                  <h3 className="mt-2 text-3xl font-bold">
                    {analytics.statusBreakdown.interview}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-2">
                  <h3 className="mb-4 font-semibold">Weekly Applications</h3>
                  <div className="h-64 sm:h-80">
                    <WeeklyChart
                      labels={analytics.weeklyApplications.map((item) => item.week)}
                      values={analytics.weeklyApplications.map((item) => item.count)}
                    />
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <h3 className="mb-4 font-semibold">Status Breakdown</h3>
                  <div className="mx-auto h-64 max-w-sm">
                    <StatusChart labels={statusLabels} values={statusValues} />
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <h3 className="mb-3 font-semibold">Best Resume</h3>
                  {analytics.resumeInsights.bestPerformingResume ? (
                    <div className="space-y-3">
                      <div className="rounded-xl bg-amber-50 p-4">
                        <div className="font-semibold text-amber-950">
                          {analytics.resumeInsights.bestPerformingResume.versionName}
                        </div>
                        <div className="mt-1 text-xs font-medium text-amber-700">
                          Best Performing
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-xl bg-slate-50 p-3">
                          <div className="text-xs text-slate-500">Used</div>
                          <div className="font-semibold">
                            {analytics.resumeInsights.bestPerformingResume.usage}x
                          </div>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-3">
                          <div className="text-xs text-slate-500">Success</div>
                          <div className="font-semibold">
                            {analytics.resumeInsights.bestPerformingResume.successRate}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">
                      No resume performance data yet.
                    </p>
                  )}
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-2">
                  <h3 className="mb-4 font-semibold">Resume Usage</h3>
                  {analytics.resumeInsights.resumes.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      Link resumes to jobs to see usage.
                    </p>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {analytics.resumeInsights.resumes.slice(0, 4).map((resume) => (
                        <div
                          key={resume._id}
                          className="rounded-xl border border-slate-100 p-3"
                        >
                          <div className="truncate text-sm font-medium">
                            {resume.versionName}
                          </div>
                          <div className="mt-2 flex gap-3 text-xs text-slate-500">
                            <span>Used {resume.usage}x</span>
                            <span>{resume.interviews} interviews</span>
                            <span>{resume.offers} offers</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
