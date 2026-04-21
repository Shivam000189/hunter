import React from "react";

interface Job {
  title: string;
  company: string;
}

export function JobCard({ title, company }: Job) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="font-medium">{title}</div>
      <div className="text-sm text-slate-500">{company}</div>
    </div>
  );
}