import React from "react";
import { Sidebar } from "../components/layout/Sidebar";

export function Resume() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 p-6">
        <div className="bg-slate-100 rounded-2xl p-6">

          <h2 className="text-xl font-bold mb-4">Resume Manager</h2>

          {/* Upload Box */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-dashed border-slate-300 text-center mb-6 hover:border-indigo-400 transition-colors cursor-pointer">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m9-13V3a2 2 0 00-2-2H9a2 2 0 00-2 2v1"
                />
              </svg>
            </div>

            <h3 className="font-medium mb-1">Upload Resume</h3>
            <p className="text-sm text-slate-500 mb-3">
              Drag & drop or click to browse
            </p>
            <p className="text-xs text-slate-400">
              PDF, DOCX up to 10MB
            </p>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">Upload Date</th>
                  <th className="text-left px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-rose-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <span>JohnDoe_Resume_2026.pdf</span>
                  </td>

                  <td className="px-4 py-3 text-slate-500">
                    Apr 18, 2026
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="text-indigo-600 text-xs font-medium hover:underline">
                        View
                      </button>
                      <button className="text-rose-500 text-xs font-medium hover:underline">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <span>JohnDoe_Resume_Design.docx</span>
                  </td>

                  <td className="px-4 py-3 text-slate-500">
                    Apr 10, 2026
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="text-indigo-600 text-xs font-medium hover:underline">
                        View
                      </button>
                      <button className="text-rose-500 text-xs font-medium hover:underline">
                        Delete
                      </button>
                    </div>
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