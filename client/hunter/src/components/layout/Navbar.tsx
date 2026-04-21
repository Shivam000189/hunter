import React from "react";

export function Navbar() {
  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold">Good morning, John 👋</h2>
        <p className="text-slate-500 text-sm">Here's your job search overview</p>
      </div>
      <input
        placeholder="Search..."
        className="w-64 px-4 py-2.5 rounded-xl border border-slate-200 bg-white"
      />
    </header>
  );
}
