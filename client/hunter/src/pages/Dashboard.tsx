import React from "react";
import { WeeklyChart } from "../charts/WeeklyChart";
import { Sidebar } from "../components/layout/Sidebar";
import { StatusChart } from "../charts/StatusChart";

export function Dashboard() {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-slate-50 ">
          <div>
            <h2 className="text-2xl font-bold">
              Good morning, John 👋
            </h2>
            <p className="text-slate-500 text-sm">
              Here's your job search overview
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-sm"
              />
              <svg
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Notification */}
            <button className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50">
              <svg
                className="w-5 h-5 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-slate-500">Total Applications</p>
              <h3 className="text-3xl font-bold mt-2">142</h3>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-slate-500">Response Rate</p>
              <h3 className="text-3xl font-bold mt-2">28%</h3>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-slate-500">Offer Rate</p>
              <h3 className="text-3xl font-bold mt-2">7%</h3>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-slate-500">Interviews</p>
              <h3 className="text-3xl font-bold mt-2">32</h3>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm lg:col-span-2">
              <h3 className="font-semibold mb-4">
                Weekly Applications
              </h3>
                <WeeklyChart />
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold mb-4">
                Status Breakdown
              </h3>
              <StatusChart />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}