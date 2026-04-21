import React from "react";
import { JobCard } from "./JobCard";

interface Job {
  title: string;
  company: string;
}

interface ColumnProps {
  title: string;
  jobs: Job[];
}

export function KanbanColumn({ title, jobs }: ColumnProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      
      {/* Column Title */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <span className="text-xs text-slate-400">{jobs.length}</span>
      </div>

      {/* Jobs */}
      <div className="space-y-3">
        {jobs.map((job, i) => (
          <JobCard key={i} {...job} />
        ))}
      </div>
    </div>
  );
}