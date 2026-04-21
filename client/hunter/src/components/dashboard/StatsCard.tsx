import React from "react";

interface StatsCardProps {
  title: string;
  value: string;
}

export function StatsCard({ title, value }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <span className="text-sm text-slate-500">{title}</span>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}