import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../../api/client";

type User = {
  name: string;
  email: string;
};

export function Sidebar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    api
      .get("/api/auth/me")
      .then((res) => setUser(res.data.data))
      .catch(() => setUser(null));
  }, []);

  const items = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Jobs", path: "/jobs" },
    { name: "AI Generator", path: "/generator" },
    { name: "Resume", path: "/resume" },
    { name: "Analytics", path: "/analytics" },
    { name: "Reminders", path: "/reminder" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/30 bg-white/70 text-slate-900 shadow-sm shadow-slate-200/50 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-sky-500 to-emerald-400 text-white shadow-lg shadow-indigo-500/20">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>

            <div>
              <div className="font-bold">AI Job Tracker</div>
              <div className="text-xs text-slate-500">Resume Intelligence</div>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-sky-400 text-sm font-bold text-white">
              {user?.name?.slice(0, 2).toUpperCase() || "U"}
            </div>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-white/40 bg-white/45 p-1 shadow-inner shadow-white/50">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `shrink-0 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-sky-500 text-white shadow-md shadow-indigo-500/20"
                    : "text-slate-600 hover:bg-white/70 hover:text-slate-950"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 rounded-2xl border border-white/40 bg-white/45 px-3 py-2 lg:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-sky-400 text-sm font-bold text-white">
            {user?.name?.slice(0, 2).toUpperCase() || "U"}
          </div>

          <div className="min-w-0">
            <div className="truncate text-sm font-medium">
              {user?.name || "User"}
            </div>
            <div className="max-w-40 truncate text-xs text-slate-500">
              {user?.email || ""}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
