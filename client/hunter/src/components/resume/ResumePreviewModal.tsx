import React from "react";
import { X, Download, ShieldCheck, Headphones } from "lucide-react";

interface ResumeItem {
  _id: string;
  url?: string;
  versionName: string;
  uploadedAt?: string;
  usage?: number;
  interviews?: number;
  offers?: number;
  successRate?: number;
}

interface ResumePreviewModalProps {
  resume: ResumeItem | null;
  onClose: () => void;
}

export const ResumePreviewModal: React.FC<ResumePreviewModalProps> = ({ resume, onClose }) => {
  if (!resume) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl overflow-hidden hunter-panel border border-white/20 bg-white/95 dark:bg-slate-900/95 shadow-2xl p-6 sm:p-7 animate-fade-in-up flex flex-col justify-between max-h-[90vh]">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 font-bold text-xs">
                PDF
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{resume.versionName}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {resume.usage !== undefined ? `Used in ${resume.usage} applications • ${resume.successRate ?? 0}% success rate` : "Active resume version"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Document Preview Sheet */}
          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-6 overflow-y-auto max-h-[50vh] text-xs leading-relaxed text-slate-800 dark:text-slate-200 space-y-4 shadow-inner font-sans">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3 text-center">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Software Engineering Specialist</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                Targeting Senior / Staff Software Engineering & Architecture Roles
              </p>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-wider mb-1.5 text-[11px] text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5" />
                <span>Executive Summary & Impact</span>
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-normal">
                Results-driven full-stack engineer with 6+ years architecting high-throughput distributed systems, scalable React micro-frontends, and modern cloud pipelines. Proven track record reducing infrastructure latency and accelerating product iteration cycles.
              </p>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-wider mb-1.5 text-[11px] text-indigo-600 dark:text-indigo-400">
                Core Competencies & Stack
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {["TypeScript", "React 19", "Node.js", "GraphQL", "PostgreSQL", "Next.js", "Docker", "AWS Cloud", "Tailwind CSS", "CI/CD Pipelines", "System Architecture"].map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-wider mb-1.5 text-[11px] text-indigo-600 dark:text-indigo-400">
                Highlighted Experience Metrics
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                <li>Spearheaded core telemetry dashboards processing 2.5M events/day with sub-100ms response times.</li>
                <li>Architected component design system adopted across 8 engineering squads, decreasing time-to-market by 35%.</li>
                <li>Optimized client-side rendering pipelines resulting in a 45% reduction in First Contentful Paint (FCP).</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200/80 dark:border-slate-800 mt-4">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Passed ATS Optimization Verification (92/100)</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="hunter-btn-ghost py-2 px-3 text-xs"
            >
              Close
            </button>
            {resume.url ? (
              <a
                href={resume.url}
                target="_blank"
                rel="noreferrer"
                className="hunter-btn-primary py-2 px-3.5 text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Open File</span>
              </a>
            ) : (
              <button
                onClick={() => alert(`Downloading resume version: ${resume.versionName}`)}
                className="hunter-btn-primary py-2 px-3.5 text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
