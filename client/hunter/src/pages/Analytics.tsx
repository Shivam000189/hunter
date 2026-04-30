import { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { AnalyticsLineChart } from "../charts/AnalyticsLineChart";
import { AnalyticsPieChart } from "../charts/AnalyticsPieChart";
import { Sidebar } from "../components/layout/Sidebar";

type AnalyticsData = {
  totalApplications: number;
  statusBreakdown: Record<"applied" | "interview" | "offer" | "rejected", number>;
  responseRate: number;
  offerRate: number;
  weeklyApplications: { week: string; count: number }[];
  avgDaysToResponse: number;
  resumeInsights: ResumeInsights;
};

type Job = {
  company: string;
};

type ResumeInsight = {
  _id: string;
  versionName: string;
  usage: number;
  interviews: number;
  offers: number;
  successRate: number;
  offerRate: number;
};

type ResumeInsights = {
  bestPerformingResume: ResumeInsight | null;
  resumes: ResumeInsight[];
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

export function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>(emptyAnalytics);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/api/v1/analytics"),
      api.get("/api/v1/jobs", { params: { limit: 100 } }),
    ])
      .then(([analyticsRes, jobsRes]) => {
        setAnalytics(analyticsRes.data.data || emptyAnalytics);
        setJobs(jobsRes.data.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const topCompanies = useMemo(() => {
    const counts = jobs.reduce<Record<string, number>>((acc, job) => {
      acc[job.company] = (acc[job.company] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [jobs]);

  const statusLabels = ["Applied", "Interview", "Offer", "Rejected"];
  const statusValues = [
    analytics.statusBreakdown.applied,
    analytics.statusBreakdown.interview,
    analytics.statusBreakdown.offer,
    analytics.statusBreakdown.rejected,
  ];

  const maxResumeUsage = Math.max(
    ...analytics.resumeInsights.resumes.map((resume) => resume.usage),
    1
  );

  return (
    <div className="app-shell flex min-h-screen flex-col">
      <Sidebar />

      <div className="min-w-0 flex-1 space-y-6 p-4 sm:p-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Analytics Deep Dive
          </h2>
          <p className="text-sm text-slate-500">
            Track your job application performance
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-5 text-sm text-slate-500 shadow-sm">
            Loading analytics...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="mb-1 text-sm text-slate-500">
                  Avg. Days to Response
                </div>
                <div className="text-2xl font-bold">
                  {analytics.avgDaysToResponse}
                </div>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="mb-1 text-sm text-slate-500">
                  Applications
                </div>
                <div className="text-2xl font-bold">
                  {analytics.totalApplications}
                </div>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="mb-1 text-sm text-slate-500">Success Rate</div>
                <div className="text-2xl font-bold">{analytics.offerRate}%</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <div className="rounded-2xl bg-white p-5 shadow-sm xl:col-span-2">
                <h3 className="mb-3 text-sm font-semibold">
                  Application Trends
                </h3>
                <div className="h-64 sm:h-80">
                  <AnalyticsLineChart
                    labels={analytics.weeklyApplications.map((item) => item.week)}
                    values={analytics.weeklyApplications.map((item) => item.count)}
                  />
                </div>
              </div>

              <div className="space-y-6 rounded-2xl bg-white p-5 shadow-sm">
                <div>
                  <h3 className="mb-3 text-sm font-semibold">
                    Status Distribution
                  </h3>
                  <div className="mx-auto h-64 max-w-sm">
                    <AnalyticsPieChart
                      labels={statusLabels}
                      values={statusValues}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold">Top Companies</h3>

                  <div className="space-y-3">
                    {topCompanies.length === 0 ? (
                      <p className="text-sm text-slate-500">
                        No company data yet.
                      </p>
                    ) : (
                      topCompanies.map(([company, count]) => (
                        <div
                          key={company}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm">{company}</span>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold">
                  Best Performing Resume
                </h3>
                {analytics.resumeInsights.bestPerformingResume ? (
                  <div>
                    <div className="mb-3 rounded-xl bg-amber-50 p-4">
                      <div className="text-sm font-semibold text-amber-900">
                        {analytics.resumeInsights.bestPerformingResume.versionName}
                      </div>
                      <div className="mt-1 text-xs font-medium text-amber-700">
                        Best Performing
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <Metric
                        label="Used"
                        value={`${analytics.resumeInsights.bestPerformingResume.usage}x`}
                      />
                      <Metric
                        label="Interviews"
                        value={analytics.resumeInsights.bestPerformingResume.interviews}
                      />
                      <Metric
                        label="Offers"
                        value={analytics.resumeInsights.bestPerformingResume.offers}
                      />
                      <Metric
                        label="Success"
                        value={`${analytics.resumeInsights.bestPerformingResume.successRate}%`}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    Link resumes to applications to unlock performance insights.
                  </p>
                )}
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm xl:col-span-2">
                <h3 className="mb-4 text-sm font-semibold">
                  Resume Performance
                </h3>
                {analytics.resumeInsights.resumes.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No resume performance data yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {analytics.resumeInsights.resumes.map((resume) => (
                      <div key={resume._id}>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="truncate text-sm font-medium">
                            {resume.versionName}
                          </span>
                          <span className="shrink-0 text-xs text-slate-500">
                            {resume.successRate}% success
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-indigo-600"
                            style={{
                              width: `${(resume.usage / maxResumeUsage) * 100}%`,
                            }}
                          />
                        </div>
                        <div className="mt-1 flex gap-3 text-xs text-slate-500">
                          <span>Used {resume.usage}x</span>
                          <span>Interviews {resume.interviews}</span>
                          <span>Offers {resume.offers}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}
