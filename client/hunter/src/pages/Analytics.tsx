import React from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { AnalyticsLineChart } from "../charts/AnalyticsLineChart";
import { AnalyticsPieChart } from "../charts/AnalyticsPieChart";

export function Analytics() {
  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">

        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Analytics Deep Dive
          </h2>
          <p className="text-sm text-slate-500">
            Track your job application performance
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="text-sm text-slate-500 mb-1">
              Avg. Days to Response
            </div>
            <div className="text-2xl font-bold">14.5</div>
            <div className="text-xs text-emerald-500 mt-1">
              ↓ 2 days from last month
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="text-sm text-slate-500 mb-1">
              Applications / Week
            </div>
            <div className="text-2xl font-bold">18</div>
            <div className="text-xs text-emerald-500 mt-1">
              ↑ 3 from last month
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="text-sm text-slate-500 mb-1">
              Success Rate
            </div>
            <div className="text-2xl font-bold">7%</div>
            <div className="text-xs text-rose-500 mt-1">
              ↓ 1% from last month
            </div>
          </div>

        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-3 gap-4">

          {/* Line Chart */}
          <div className="col-span-2 bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold mb-3 text-sm">
              Application Trends
            </h3>
            <AnalyticsLineChart />
          </div>

          {/* Pie + Companies */}
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-6">

            <div>
              <h3 className="font-semibold mb-3 text-sm">
                Status Distribution
              </h3>
              <AnalyticsPieChart />
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-sm">
                Top Companies
              </h3>

              <div className="space-y-3">

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-500" />
                    <span className="text-sm">Google</span>
                  </div>
                  <span className="text-sm font-medium">4</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-orange-500" />
                    <span className="text-sm">Meta</span>
                  </div>
                  <span className="text-sm font-medium">3</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-500" />
                    <span className="text-sm">Stripe</span>
                  </div>
                  <span className="text-sm font-medium">2</span>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}