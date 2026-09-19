import React, { useState } from "react";
import { motion, type Variants } from "framer-motion";

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

function MailGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function LockGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function UserGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
    </svg>
  );
}

function EyeGlyph({ off }: { off: boolean }) {
  return off ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 8 10 8a9.74 9.74 0 0 0 5.39-1.61" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8-10-8-10-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

const glyphs = { mail: MailGlyph, lock: LockGlyph, user: UserGlyph } as const;

type AuthFieldProps = {
  icon: keyof typeof glyphs;
  label: string;
  name: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  delay?: number;
  rightSlot?: React.ReactNode;
};

export function AuthField({
  icon,
  label,
  name,
  type = "text",
  value,
  placeholder,
  onChange,
  autoComplete,
  delay = 0,
  rightSlot,
}: AuthFieldProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const Glyph = glyphs[icon];
  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <motion.div variants={fieldVariants} custom={delay}>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={name} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-tight">
          {label}
        </label>
        {rightSlot}
      </div>

      <motion.div
        animate={{
          borderColor: focused ? "#2563eb" : "var(--hunter-border)",
          boxShadow: focused ? "0 0 0 3px rgba(37, 99, 235, 0.15)" : "none",
        }}
        transition={{ duration: 0.15 }}
        className="flex items-center gap-2 rounded-xl border bg-white dark:bg-slate-900 px-3 shadow-2xs"
        style={{ borderColor: focused ? "#2563eb" : "var(--hunter-border)" }}
      >
        <span className={`shrink-0 transition-colors ${focused ? "text-blue-600" : "text-slate-400 dark:text-slate-500"}`}>
          <Glyph />
        </span>
        <input
          id={name}
          name={name}
          type={resolvedType}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full bg-transparent py-2.5 text-sm font-normal text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-0.5 shrink-0"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            <EyeGlyph off={showPassword} />
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

export const authFormContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};
