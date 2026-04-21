import { Sidebar } from "../components/layout/Sidebar";

interface Job {
  title: string;
  company: string;
  date?: string;
  desc?: string;
  tag?: string;
}

const data: Record<string, Job[]> = {
  Applied: [
    {
      title: "Frontend Developer",
      company: "Google",
      date: "Apr 15, 2026",
      desc: "Remote position, React/TypeScript stack...",
      tag: "Follow up",
    },
    {
      title: "UI Engineer",
      company: "Apple",
      date: "Apr 12, 2026",
      desc: "On-site Cupertino, Design Systems...",
    },
  ],
  Interview: [
    {
      title: "Senior Developer",
      company: "Meta",
      date: "Apr 22, 2026",
      desc: "Technical round, system design...",
      tag: "Tomorrow",
    },
  ],
  Offer: [
    {
      title: "Full Stack Dev",
      company: "Stripe",
      date: "Apr 10, 2026",
      desc: "$145k + equity, Remote...",
      tag: "Pending",
    },
  ],
  Rejected: [
    {
      title: "Software Engineer",
      company: "Netflix",
      date: "Apr 8, 2026",
      desc: "Position filled internally...",
    },
  ],
};

const colors: Record<string, string> = {
  Applied: "bg-indigo-600",
  Interview: "bg-emerald-500",
  Offer: "bg-amber-500",
  Rejected: "bg-rose-500",
};

const initials = (name: string) => name[0];

export function Jobs() {
  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 bg-white  border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Job Pipeline</h2>

          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 flex items-center gap-2">
            <span className="text-lg leading-none">+</span>
            Add Job
          </button>
        </div>

        {/* Board */}
        <div className="flex-1 overflow-x-auto p-6 bg-white">
          <div className="grid grid-cols-4 gap-4 min-w-[1000px]">

            {Object.entries(data).map(([status, jobs]) => (
              <div key={status} className="bg-slate-50 border border-slate-200 rounded-2xl p-4">

                {/* Column Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${colors[status]}`} />
                    <span className="font-semibold text-slate-800">{status}</span>
                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">
                      {jobs.length}
                    </span>
                  </div>

                  <button className="hover:bg-slate-200 p-1 rounded">
                    <span className="text-lg leading-none">+</span>
                  </button>
                </div>

                {/* Cards */}
                <div className="space-y-3">

                  {jobs.map((job, i) => (
                    <div
                      key={i}
                      className={`bg-white hover:shadow-lg rounded-2xl p-4 shadow-sm ${
                        status === "Rejected" ? "opacity-70" : ""
                      }`}
                    >

                      {/* Top */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold">
                          {initials(job.company)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {job.title}
                          </div>
                          <div className="text-sm text-slate-500">
                            {job.company}
                          </div>
                        </div>

                        <div className="cursor-grab text-slate-400">⋮⋮</div>
                      </div>

                      {/* Meta */}
                      <div className="text-xs text-slate-400 mb-2">
                        {status}: {job.date}
                      </div>

                      <div className="text-sm text-slate-500 line-clamp-2">
                        {job.desc}
                      </div>

                      {/* Footer */}
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-indigo-600 font-medium">
                          View
                        </span>

                        {job.tag && (
                          <span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700">
                            {job.tag}
                          </span>
                        )}
                      </div>

                    </div>
                  ))}

                </div>

                {/* Drop zone */}
                <div className="mt-4 border-2 border-dashed border-slate-300 rounded-2xl py-6 text-center text-slate-400 text-sm">
                  Drop here
                </div>

              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}