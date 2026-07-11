import { AnimatePresence, motion } from "framer-motion";
import { type ReactNode, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { ThemeToggle } from "../ui/ThemeToggle";

type User = {
  name: string;
  email: string;
};

type NavItem = {
  name: string;
  path: string;
  icon: ReactNode;
};

export function Sidebar() {
  const [user, setUser] = useState<User | null>(null);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    api
      .get("/api/auth/me")
      .then((res) => setUser(res.data.data))
      .catch(() => setUser(null));
  }, []);

  const items: NavItem[] = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 13h7V4H4v9Zm0 7h7v-3H4v3Zm9 0h7v-9h-7v9Zm0-13v3h7V4h-7Z" />
        </svg>
      ),
    },
    {
      name: "Jobs",
      path: "/jobs",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 7V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1M4 9h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9Zm0 0V8a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v1" />
        </svg>
      ),
    },
    {
      name: "AI Generator",
      path: "/generator",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 3v4m0 10v4m9-9h-4M7 12H3m15.364 6.364-2.829-2.828M8.465 8.465 5.636 5.636m12.728 0-2.829 2.829M8.465 15.535l-2.829 2.829" />
          <circle cx="12" cy="12" r="3.5" strokeWidth="1.8" />
        </svg>
      ),
    },
    {
      name: "Resume",
      path: "/resume",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 7h8M8 11h8M8 15h5M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        </svg>
      ),
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 19V9m7 10V5m7 14v-7" />
        </svg>
      ),
    },
    {
      name: "Reminders",
      path: "/reminder",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 17H9m9-1V11a6 6 0 1 0-12 0v5l-2 2h16l-2-2Zm-7 2h2" />
        </svg>
      ),
    },
  ];

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-3 sm:bottom-6 sm:px-6">
      <motion.div
        initial={{ y: 56, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="hunter-floating-dock pointer-events-auto flex w-full max-w-6xl items-center justify-between gap-2 overflow-x-auto rounded-[1.75rem] border px-3 py-3 text-slate-900 shadow-2xl backdrop-blur-2xl sm:gap-3 sm:px-4"
      >
        <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/35 bg-white/55 px-3 py-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#191919] text-white shadow-lg shadow-black/10">
            <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="64" height="64" rx="16" fill="#191919" />
              <rect x="16" y="26" width="32" height="20" rx="4" stroke="#DDE7F8" strokeWidth="2" />
              <path d="M24 26V22C24 20.8954 24.8954 20 26 20H38C39.1046 20 40 20.8954 40 22V26" stroke="#DDE7F8" strokeWidth="2" />
              <path d="M26 38L32 32L38 38" stroke="#CCE3D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M32 32V44" stroke="#CCE3D4" strokeWidth="2" strokeLinecap="round" />
              <circle cx="48" cy="16" r="3" fill="#D8B56A" />
            </svg>
          </div>

          <div className="hidden min-w-0 sm:block">
            <div className="font-bold">Hunter</div>
            <div className="text-xs text-slate-500">Resume Intelligence</div>
          </div>
        </div>

        <nav className="flex min-w-0 flex-1 items-center justify-center gap-2">
          {items.map((item) => (
            <motion.div
              key={item.path}
              className="relative flex shrink-0 flex-col items-center"
              onMouseEnter={() => setHoveredPath(item.path)}
              onMouseLeave={() => setHoveredPath(null)}
              whileHover={{ y: -2 }}
            >
              <AnimatePresence>
                {hoveredPath === item.path && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 340, damping: 24 }}
                    className="absolute bottom-full mb-3 hidden whitespace-nowrap rounded-xl border border-[#191919]/10 bg-[#191919] px-3 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-white shadow-xl sm:block"
                  >
                    {item.name.toUpperCase()}
                    <div className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b border-r border-[#191919]/10 bg-[#191919]" />
                  </motion.div>
                )}
              </AnimatePresence>

              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `relative flex min-w-[4.25rem] items-center justify-center rounded-2xl border px-3 py-3 transition-all duration-300 ${
                    isActive
                      ? "border-[#191919]/10 bg-[#191919] text-white shadow-inner shadow-black/10"
                      : "border-transparent bg-white/10 text-slate-500 hover:border-white/40 hover:bg-white/75 hover:text-slate-900"
                  }`
                }
                aria-label={item.name}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="hunter-dock-active"
                        className="absolute inset-0 rounded-2xl border border-white/15 bg-[#191919]/10"
                        transition={{ type: "spring", stiffness: 320, damping: 30 }}
                      />
                    )}
                    <motion.div
                      animate={hoveredPath === item.path ? { scale: 1.12 } : { scale: 1 }}
                      transition={{ type: "spring", stiffness: 420, damping: 18 }}
                      className="relative z-10"
                    >
                      {item.icon}
                    </motion.div>
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-white/35 bg-white/55 px-2 py-2">
          <ThemeToggle />

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6f7f76] text-sm font-bold text-white">
            {user?.name?.slice(0, 2).toUpperCase() || "U"}
          </div>

          <div className="hidden min-w-0 lg:block">
            <div className="max-w-32 truncate text-sm font-medium">
              {user?.name || "User"}
            </div>
            <div className="max-w-32 truncate text-xs text-slate-500">
              {user?.email || ""}
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-white/40 bg-white/75 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-white hover:text-slate-950"
          >
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
}
