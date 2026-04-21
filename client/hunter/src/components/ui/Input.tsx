import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ type = "text", ...props }: InputProps) {
  return (
    <input
      type={type}
      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
      {...props}
    />
  );
}