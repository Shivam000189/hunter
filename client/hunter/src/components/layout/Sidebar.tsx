import { AnimatePresence, motion } from "framer-motion";
import { type ReactNode, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { ThemeToggle } from "../ui/ThemeToggle";
import {
  LayoutDashboard,
  Briefcase,
  Headphones,
  MessageSquare,
  FileText,
  BarChart3,
  Bell,
  LogOut,
} from "lucide-react";

type User = {
  name: string;
  email: string;
};

type PendingReminder = {
  _id: string;
  company: string;
  role: string;
};

type NavItem = {
  name: string;
  path: string;
  icon: ReactNode;
};

export function Sidebar() {
  const [user, setUser] = useState<User | null>(null);
  const [pendingReminders, setPendingReminders] = useState<PendingReminder[]>([]);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  useEffect(() => {
    api
      .get("/api/auth/me")
      .then((res) => setUser(res.data.data))
      .catch(() => setUser(null));

    const loadPendingReminders = () => {
      api
        .get("/api/v1/reminders/pending")
        .then((res) => setPendingReminders(res.data.data || []))
        .catch(() => setPendingReminders([]));
    };

    loadPendingReminders();
    const interval = window.setInterval(loadPendingReminders, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (location.pathname !== "/jobs") return;

    setPendingReminders([]);
    api.post("/api/v1/reminders/acknowledge").catch(() => undefined);
  }, [location.pathname]);

  const items: NavItem[] = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Jobs",
      path: "/jobs",
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      name: "AI Generator",
      path: "/generator",
      icon: <Headphones className="h-5 w-5" />,
    },
    {
      name: "AI Interview",
      path: "/interview",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      name: "Resume",
      path: "/resume",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "Reminders",
      path: "/reminder",
      icon: <Bell className="h-5 w-5" />,
    },
  ];

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <>
      {pendingReminders.length > 0 && (
        <motion.button
          type="button"
          initial={{ x: -24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => navigate("/jobs")}
          className="fixed left-3 top-4 z-[60] w-[min(22rem,calc(100vw-1.5rem))] rounded-2xl border border-amber-200 dark:border-amber-900 bg-white/95 dark:bg-slate-900/95 p-4 text-left text-slate-900 dark:text-white shadow-xl backdrop-blur-md sm:left-6 sm:top-6"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-xl" aria-hidden="true">⏰</span>
            <span className="min-w-0">
              <strong className="block text-sm font-bold text-slate-900 dark:text-white">Follow-up reminder</strong>
              <span className="mt-1 block text-xs text-slate-600 dark:text-slate-300">
                {pendingReminders.length === 1
                  ? `${pendingReminders[0].company} needs your attention.`
                  : `${pendingReminders.length} applied jobs need your attention.`}
              </span>
              <span className="mt-2 block text-xs font-bold text-amber-700 dark:text-amber-400">
                Open Jobs to review →
              </span>
            </span>
          </div>
        </motion.button>
      )}

      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-3 sm:bottom-6 sm:px-6 font-sans">
        <motion.div
          initial={{ y: 56, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          className="hunter-floating-dock pointer-events-auto flex w-full max-w-6xl items-center justify-between gap-2 overflow-x-auto rounded-[1.75rem] px-3 py-2.5 text-slate-900 dark:text-white shadow-2xl backdrop-blur-2xl sm:gap-3 sm:px-4"
        >
          {/* Brand Logo */}
          <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3 py-1.5 shadow-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30 shrink-0">
              <Headphones className="h-5 w-5 text-white" />
            </div>

            <div className="hidden min-w-0 sm:block">
              <div className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">Hunter</div>
              <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">Job Pipeline AI</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex min-w-0 flex-1 items-center justify-center gap-1.5 sm:gap-2">
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
                      className="absolute bottom-full mb-3 hidden whitespace-nowrap rounded-xl border border-indigo-500/20 bg-slate-900 text-white dark:bg-slate-950 px-3 py-1.5 text-[11px] font-bold tracking-[0.16em] shadow-xl sm:block z-50"
                    >
                      {item.name.toUpperCase()}
                      <div className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b border-r border-indigo-500/20 bg-slate-900 dark:bg-slate-950" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `relative flex min-w-[3.75rem] sm:min-w-[4.25rem] items-center justify-center rounded-2xl border px-3 py-2.5 transition-all duration-200 ${
                      isActive
                        ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold"
                        : "border-transparent bg-slate-100/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 hover:text-slate-950 dark:hover:text-white"
                    }`
                  }
                  aria-label={item.name}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="hunter-dock-active"
                          className="absolute inset-0 rounded-2xl border border-white/20 bg-indigo-600 shadow-inner"
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

          {/* User Profile & Controls */}
          <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-2 py-1.5 shadow-xs">
            <ThemeToggle />

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-xs shrink-0">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "HU"}
            </div>

            <div className="hidden min-w-0 lg:block">
              <div className="max-w-28 truncate text-xs font-bold text-slate-900 dark:text-white">
                {user?.name || "Hunter User"}
              </div>
              <div className="max-w-28 truncate text-[10px] font-medium text-slate-500 dark:text-slate-400">
                {user?.email || "active"}
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-600 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
