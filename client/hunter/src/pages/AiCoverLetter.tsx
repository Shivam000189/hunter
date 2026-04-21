import { Sidebar } from "../components/layout/Sidebar";

export function AiCoverLetter() {
  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">

        <div className="bg-white rounded-2xl p-6 shadow-sm">

          <h2 className="text-xl font-bold mb-4">
            AI Cover Letter Generator
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-6">

            {/* INPUT */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">

              <h3 className="font-semibold mb-3 text-sm">Input</h3>

              <div className="space-y-3">

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Job Description
                  </label>

                  <textarea
                    placeholder="Paste the job description here..."
                    className="w-full h-24 px-3 py-2 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none resize-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Skills
                  </label>

                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                      React <button>×</button>
                    </span>
                    <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                      TypeScript <button>×</button>
                    </span>
                  </div>

                  {/* FIXED INPUT (self closing) */}
                  <input
                    type="text"
                    placeholder="Add skill + Enter"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Tone
                  </label>

                  <select className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-sm bg-white">
                    <option>Professional</option>
                    <option>Enthusiastic</option>
                    <option>Concise</option>
                  </select>
                </div>

                <button className="w-full py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
                  Generate
                </button>

              </div>
            </div>

            {/* OUTPUT */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">

              <h3 className="font-semibold mb-3 text-sm">Output</h3>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-sm leading-relaxed text-slate-700 h-48 overflow-y-auto">

                Dear Hiring Manager,
                <br /><br />
                I am writing to express my strong interest in the Frontend Developer position...
                <br /><br />
                My experience in React and TypeScript aligns perfectly...

              </div>

              <div className="flex items-center gap-2 mt-3">

                <button className="flex-1 py-2 border border-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 flex justify-center gap-2">
                  Copy
                </button>

                <button className="flex-1 py-2 border border-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 flex justify-center gap-2">
                  Edit
                </button>

              </div>

            </div>

          </div>

          {/* TABLE */}
          <h3 className="font-semibold mb-3 text-sm">
            Previous Letters
          </h3>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">

            <table className="w-full text-sm">

              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Company</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                  <th className="text-left px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-3">Google</td>
                  <td className="px-4 py-3 text-slate-500">Apr 15</td>
                  <td className="px-4 py-3 text-indigo-600 cursor-pointer">
                    View
                  </td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-3">Meta</td>
                  <td className="px-4 py-3 text-slate-500">Apr 10</td>
                  <td className="px-4 py-3 text-indigo-600 cursor-pointer">
                    View
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

        </div>
      </div>
    </div>
  );
}