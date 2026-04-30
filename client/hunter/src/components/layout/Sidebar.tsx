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
    <aside className="w-full shrink-0 bg-slate-900 text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-60 lg:flex-col">
      {/* Logo */}
      <div className="p-4 lg:p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5"
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
            <div className="text-xs text-slate-400">v1.0</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex gap-2 overflow-x-auto px-3 pb-4 lg:flex-1 lg:flex-col lg:space-y-1 lg:overflow-visible lg:pb-0">
        {items.map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-sm transition lg:text-base ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <div className="w-5 h-5 bg-slate-700 rounded-sm" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="hidden border-t border-slate-800 p-4 lg:block">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold">
            {user?.name?.slice(0, 2).toUpperCase() || "U"}
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {user?.name || "User"}
            </div>
            <div className="text-xs text-slate-400 truncate">
              {user?.email || ""}
            </div>
          </div>

          <button className="text-slate-400 hover:text-white">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
