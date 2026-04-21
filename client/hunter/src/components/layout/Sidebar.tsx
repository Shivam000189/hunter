import React from "react";

export function Sidebar() {
  const items = [
    { name: "Dashboard", active: true },
    { name: "Jobs" },
    { name: "AI Generator" },
    { name: "Resume" },
    { name: "Analytics" },
    { name: "Reminders" },
  ];

  return (
    <aside className="w-60 h-screen bg-slate-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6">
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
      <nav className="flex-1 px-3 space-y-1">
        {items.map((item, i) => (
          <a
            key={i}
            href="#"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              item.active
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {/* simple placeholder icon */}
            <div className="w-5 h-5 bg-slate-700 rounded-sm" />
            {item.name}
          </a>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold">
            JD
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">John Doe</div>
            <div className="text-xs text-slate-400 truncate">
              john@example.com
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