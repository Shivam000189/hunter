import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Briefcase,
  BarChart3,
  ArrowRight,
  Search,
  LayoutDashboard,
  Users,
  Calendar,
  Menu,
  X,
  Award,
  Check,
  MapPin,
  DollarSign,
  Headphones,
  Mic,
  Clock,
  FileText,
  Sparkles,
} from "lucide-react";
import { ThemeToggle } from "../components/ui/ThemeToggle";

// Framer Motion Animation Variants matching hunter-new-analytics
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

type ActiveBoardTab = "Dashboard" | "Interviews" | "Analytics" | "Offers";

export function Hunter() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeBoardTab, setActiveBoardTab] = useState<ActiveBoardTab>("Dashboard");
  const [selectedTimeRange, setSelectedTimeRange] = useState("Last 8 Weeks");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // SVG Chart data points for the analytics preview
  const chartPoints = [
    { month: "Jan", val: 30, amount: "12 Apps", rate: "25%" },
    { month: "Mar", val: 45, amount: "20 Apps", rate: "28%" },
    { month: "May", val: 40, amount: "18 Apps", rate: "30%" },
    { month: "Jul", val: 68, amount: "32 Apps", rate: "33%" },
    { month: "Sep", val: 85, amount: "42 Apps", rate: "35%" },
    { month: "Nov", val: 92, amount: "48 Apps", rate: "34.2%" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* ─────────────────────────────────────────────────────────────
          1. NAVIGATION BAR
      ───────────────────────────────────────────────────────────── */}
      <header
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-xs border-b border-slate-200/80 py-3.5"
            : "bg-white/80 backdrop-blur-xs py-4 border-b border-slate-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#"
            id="brand-logo"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
              <Briefcase className="w-5 h-5 stroke-[2.4]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
              Hunter
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            <a
              href="#hero-section"
              onClick={(e) => handleNavClick(e, "#hero-section")}
              className="text-[14px] font-medium text-slate-600 hover:text-slate-950 transition-colors"
            >
              Home
            </a>
            <a
              href="#board"
              onClick={(e) => handleNavClick(e, "#board")}
              className="text-[14px] font-medium text-slate-600 hover:text-slate-950 transition-colors"
            >
              About
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => handleNavClick(e, "#how-it-works")}
              className="text-[14px] font-medium text-slate-600 hover:text-slate-950 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#main-footer"
              onClick={(e) => handleNavClick(e, "#main-footer")}
              className="text-[14px] font-medium text-slate-600 hover:text-slate-950 transition-colors"
            >
              Reviews
            </a>
          </nav>

          {/* Right Action Group */}
          <div className="hidden md:flex items-center gap-3">
            
            <button
              onClick={() => navigate("/login")}
              className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              id="navbar-get-started-btn"
              onClick={() => navigate("/signup")}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold !text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer"
              style={{ color: "#ffffff" }}
            >
              <span className="!text-white" style={{ color: "#ffffff" }}>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 !text-white" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3"
            >
              <a
                href="#board"
                onClick={(e) => handleNavClick(e, "#board")}
                className="block py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
              >
                Board View
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => handleNavClick(e, "#how-it-works")}
                className="block py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
              >
                How It Works
              </a>
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-2.5 text-center text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="w-full py-2.5 text-center text-sm font-semibold !text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                  style={{ color: "#ffffff" }}
                >
                  Get Started Free
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. SECTION 1: HERO SECTION
      ───────────────────────────────────────────────────────────── */}
      <section
        id="hero-section"
        className="relative pt-32 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-50/50 via-white to-white"
      >
        {/* Ambient Radial Blue Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Floating Animated Company Icons */}
        {/* Left Top: Google Icon */}
        <motion.div
          animate={{ y: [-8, 8, -8], rotate: [-4, 4, -4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="hidden lg:flex absolute top-28 left-[8%] w-14 h-14 rounded-2xl bg-white shadow-lg border border-slate-100 items-center justify-center pointer-events-none select-none z-10"
          title="Google"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        </motion.div>

        {/* Left Middle: Microsoft 4-Color Icon */}
        <motion.div
          animate={{ y: [6, -6, 6], rotate: [3, -3, 3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="hidden lg:flex absolute top-72 left-[12%] w-13 h-13 rounded-2xl bg-white shadow-lg border border-slate-100 items-center justify-center pointer-events-none select-none z-10"
          title="Microsoft"
        >
          <svg className="w-6 h-6" viewBox="0 0 21 21">
            <rect x="1" y="1" width="9" height="9" fill="#F25022" rx="1" />
            <rect x="11" y="1" width="9" height="9" fill="#7FBA00" rx="1" />
            <rect x="1" y="11" width="9" height="9" fill="#00A4EF" rx="1" />
            <rect x="11" y="11" width="9" height="9" fill="#FFB900" rx="1" />
          </svg>
        </motion.div>

        {/* Right Top: Flipkart Icon */}
        <motion.div
          animate={{ y: [-7, 7, -7], rotate: [4, -4, 4] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          className="hidden lg:flex absolute top-32 right-[9%] w-14 h-14 rounded-2xl bg-white shadow-lg border border-slate-100 items-center justify-center pointer-events-none select-none z-10"
          title="Flipkart"
        >
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
            <path d="M5 8h14l-1.5 12a2 2 0 0 1-2 1.7H8.5A2 2 0 0 1 6.5 20L5 8z" fill="#FFE11B" />
            <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="#2874F0" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M14 12h-3v2h2v1.8h-2v3.2h-2v-9h5v2z" fill="#2874F0" />
          </svg>
        </motion.div>

        {/* Right Middle: Instagram Gradient Icon */}
        <motion.div
          animate={{ y: [8, -8, 8], rotate: [-3, 3, -3] }}
          transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="hidden lg:flex absolute top-76 right-[13%] w-13 h-13 rounded-2xl bg-white shadow-lg border border-slate-100 items-center justify-center pointer-events-none select-none z-10"
          title="Instagram"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <defs>
              <radialGradient id="heroIgRad" cx="30%" cy="107%" r="130%">
                <stop offset="0%" stopColor="#fdf497" />
                <stop offset="5%" stopColor="#fdf497" />
                <stop offset="45%" stopColor="#fd5949" />
                <stop offset="60%" stopColor="#d6249f" />
                <stop offset="90%" stopColor="#285aeb" />
              </radialGradient>
            </defs>
            <rect width="24" height="24" rx="6" fill="url(#heroIgRad)" />
            <rect x="4.5" y="4.5" width="15" height="15" rx="4" fill="none" stroke="#ffffff" strokeWidth="1.7" />
            <circle cx="12" cy="12" r="3.4" fill="none" stroke="#ffffff" strokeWidth="1.7" />
            <circle cx="16.2" cy="7.8" r="0.9" fill="#ffffff" />
          </svg>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered Content */}
          <div className="text-center max-w-3xl mx-auto">
            {/* Avatar Pill Badge */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-xs mb-6"
            >
              <div className="flex -space-x-1.5">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces"
                  alt="User avatar 1"
                  className="w-5 h-5 rounded-full ring-1 ring-white object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces"
                  alt="User avatar 2"
                  className="w-5 h-5 rounded-full ring-1 ring-white object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces"
                  alt="User avatar 3"
                  className="w-5 h-5 rounded-full ring-1 ring-white object-cover"
                />
              </div>
              <span className="text-xs font-semibold text-slate-700 tracking-tight">
                Trusted by <span className="text-blue-600 font-bold">10,000+</span> Job Hunters
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold text-slate-900 tracking-tight leading-[1.12] mb-6"
            >
              Turn Application Chaos <br className="hidden sm:inline" />
              Into Job Offers
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto mb-8 font-normal leading-relaxed"
            >
              One simple board to track your job search, interview stages, responses, and
              compensation offers—without the spreadsheet chaos.
            </motion.p>

            {/* Primary Action & Microcopy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-center gap-3"
            >
              <button
                id="hero-cta-btn"
                onClick={() => navigate("/signup")}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3 text-[15px] font-semibold !text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                style={{ color: "#ffffff" }}
              >
                <span className="!text-white" style={{ color: "#ffffff" }}>Start Free Today</span>
                <ArrowRight className="w-4 h-4 !text-white group-hover:translate-x-0.5 transition-transform" />
              </button>
              <span className="text-xs font-medium text-slate-400">
                No credit card required • Free forever
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. SECTION 2: BOARD SECTION (Interactive Dashboard Mockup)
      ───────────────────────────────────────────────────────────── */}
      <section id="board" className="relative pb-24 md:pb-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          {/* Outer Glassmorphic Frame */}
          <div className="relative rounded-2xl p-2 sm:p-3 bg-slate-900/5 backdrop-blur-md border border-slate-200/80 shadow-2xl shadow-blue-500/10">
            {/* Inner Dashboard Canvas */}
            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-xs">
              <div className="flex flex-col lg:flex-row min-h-[520px]">
                {/* Left Sidebar */}
                <aside className="w-full lg:w-56 bg-slate-50/70 border-b lg:border-b-0 lg:border-r border-slate-100 p-4 flex flex-col justify-between shrink-0">
                  <div>
                    {/* Brand Header inside mockup */}
                    <div className="flex items-center gap-2 px-2 py-1 mb-4">
                      <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white">
                        <Briefcase className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-sm text-slate-900">Hunter OS</span>
                    </div>

                    {/* Search Input */}
                    <div className="relative mb-3">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search applications..."
                        readOnly
                        className="w-full pl-8 pr-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none cursor-default"
                      />
                    </div>

                    {/* Nav Items */}
                    <div className="space-y-0.5 text-xs font-medium text-slate-600">
                      <button
                        onClick={() => setActiveBoardTab("Dashboard")}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                          activeBoardTab === "Dashboard"
                            ? "bg-blue-50 text-blue-600 font-semibold"
                            : "hover:bg-slate-100 text-slate-600"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <LayoutDashboard className="w-3.5 h-3.5" />
                          <span>Pipeline Board</span>
                        </div>
                        <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.2 rounded-full">
                          48
                        </span>
                      </button>

                      <button
                        onClick={() => setActiveBoardTab("Interviews")}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                          activeBoardTab === "Interviews"
                            ? "bg-blue-50 text-blue-600 font-semibold"
                            : "hover:bg-slate-100 text-slate-600"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5" />
                          <span>Interviews</span>
                        </div>
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.2 rounded-full">
                          6
                        </span>
                      </button>

                      <button
                        onClick={() => setActiveBoardTab("Analytics")}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                          activeBoardTab === "Analytics"
                            ? "bg-blue-50 text-blue-600 font-semibold"
                            : "hover:bg-slate-100 text-slate-600"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-3.5 h-3.5" />
                          <span>Analytics Studio</span>
                        </div>
                      </button>

                      <button
                        onClick={() => setActiveBoardTab("Offers")}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                          activeBoardTab === "Offers"
                            ? "bg-blue-50 text-blue-600 font-semibold"
                            : "hover:bg-slate-100 text-slate-600"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Award className="w-3.5 h-3.5" />
                          <span>Offer Pipeline</span>
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                          2
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Sidebar Profile Card */}
                  <div className="pt-4 border-t border-slate-200/80 mt-4 flex items-center gap-2 px-1">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces"
                      alt="Candidate"
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-900 truncate">Candidate Profile</p>
                      <p className="text-[10px] text-slate-500 truncate">Active Job Search</p>
                    </div>
                  </div>
                </aside>

                {/* Right Main Workspace */}
                <main className="flex-1 p-4 sm:p-6 flex flex-col justify-between overflow-x-auto">
                  <div>
                    {/* Top Workspace Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-bold text-base text-slate-900">
                            {activeBoardTab === "Dashboard" && "Active Job Pipeline"}
                            {activeBoardTab === "Interviews" && "Interview Schedule"}
                            {activeBoardTab === "Analytics" && "Search Analytics & Funnel"}
                            {activeBoardTab === "Offers" && "Comp & Offer Comparison"}
                          </h2>
                          <span className="text-[11px] font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                            48 Total
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Real-time status synced with browser extension
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          aria-label="Filter by time range"
                          value={selectedTimeRange}
                          onChange={(e) => setSelectedTimeRange(e.target.value)}
                          className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none cursor-pointer"
                        >
                          <option>Last 4 Weeks</option>
                          <option>Last 8 Weeks</option>
                          <option>Year to Date</option>
                        </select>
                        <button
                          onClick={() => navigate("/dashboard")}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold !text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                          style={{ color: "#ffffff" }}
                        >
                          <span className="!text-white" style={{ color: "#ffffff" }}>+ Add Job</span>
                        </button>
                      </div>
                    </div>

                    {/* KPI Metric Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                      <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3">
                        <span className="text-[11px] font-medium text-slate-500">Total Applications</span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-lg font-bold text-slate-900">48</span>
                          <span className="text-[10px] font-semibold text-blue-600">+12% mo</span>
                        </div>
                      </div>

                      <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3">
                        <span className="text-[11px] font-medium text-slate-500">Response Rate</span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-lg font-bold text-slate-900">34.2%</span>
                          <span className="text-[10px] font-semibold text-emerald-600">4.2x avg</span>
                        </div>
                      </div>

                      <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3">
                        <span className="text-[11px] font-medium text-slate-500">Interviews Active</span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-lg font-bold text-slate-900">6</span>
                          <span className="text-[10px] font-semibold text-amber-600">3 rounds</span>
                        </div>
                      </div>

                      <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3">
                        <span className="text-[11px] font-medium text-slate-500">Active Offers</span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-lg font-bold text-slate-900">2</span>
                          <span className="text-[10px] font-semibold text-emerald-600">$185k avg</span>
                        </div>
                      </div>
                    </div>

                    {/* Tab Views Content */}
                    {activeBoardTab === "Dashboard" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {/* Column 1: Applied */}
                        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/60">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                <span className="text-xs font-bold text-slate-800">Applied</span>
                              </div>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                8
                              </span>
                            </div>
                            <div className="space-y-2.5">
                              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs hover:border-blue-300 transition-all">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-black text-xs">
                                    S
                                  </div>
                                  <span className="font-bold text-xs text-slate-900">Stripe</span>
                                </div>
                                <p className="text-[11px] font-semibold text-slate-800 line-clamp-1">Staff Backend Engineer</p>
                                <div className="mt-2 space-y-1 text-[10px] text-slate-500">
                                  <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                                    <DollarSign className="w-3 h-3 shrink-0" />
                                    <span>$190k - $220k</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                    <span>San Francisco, CA</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-slate-400 pt-0.5">
                                    <Calendar className="w-3 h-3 shrink-0" />
                                    <span>Applied 3d ago</span>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs hover:border-blue-300 transition-all">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-black text-xs">
                                    L
                                  </div>
                                  <span className="font-bold text-xs text-slate-900">Linear</span>
                                </div>
                                <p className="text-[11px] font-semibold text-slate-800 line-clamp-1">Product Engineer</p>
                                <div className="mt-2 space-y-1 text-[10px] text-slate-500">
                                  <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                                    <DollarSign className="w-3 h-3 shrink-0" />
                                    <span>$175k - $195k</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                    <span>Remote (US)</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-slate-400 pt-0.5">
                                    <Calendar className="w-3 h-3 shrink-0" />
                                    <span>Applied 5d ago</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Column 2: Interview */}
                        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/60">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                                <span className="text-xs font-bold text-slate-800">Interview</span>
                              </div>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                6
                              </span>
                            </div>
                            <div className="space-y-2.5">
                              <div className="bg-white p-3 rounded-lg border border-amber-300 shadow-xs ring-1 ring-amber-400/20">
                                <div className="flex items-center justify-between gap-1 mb-1.5">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xs">
                                      A
                                    </div>
                                    <span className="font-bold text-xs text-slate-900">Airbnb</span>
                                  </div>
                                  <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                                    Round 3
                                  </span>
                                </div>
                                <p className="text-[11px] font-semibold text-slate-800 line-clamp-1">Lead Frontend Architect</p>
                                <div className="mt-2 space-y-1 text-[10px] text-slate-500">
                                  <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                                    <DollarSign className="w-3 h-3 shrink-0" />
                                    <span>$195k</span>
                                  </div>
                                  <div className="flex items-center justify-between text-blue-600 font-semibold pt-1">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      Tomorrow 2 PM
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => setActiveBoardTab("Interviews")}
                                  className="w-full mt-2 py-1.5 px-2 text-[10px] font-semibold !text-white bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                                  style={{ color: "#ffffff" }}
                                >
                                  <Headphones className="w-3 h-3 !text-white" />
                                  <span className="!text-white" style={{ color: "#ffffff" }}>Practice AI Mock</span>
                                </button>
                              </div>

                              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs hover:border-amber-300 transition-all">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xs">
                                    F
                                  </div>
                                  <span className="font-bold text-xs text-slate-900">Figma</span>
                                </div>
                                <p className="text-[11px] font-semibold text-slate-800 line-clamp-1">Senior Systems Engineer</p>
                                <div className="mt-2 space-y-1 text-[10px] text-slate-500">
                                  <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                                    <DollarSign className="w-3 h-3 shrink-0" />
                                    <span>$185k</span>
                                  </div>
                                  <div className="flex items-center justify-between pt-1">
                                    <span className="text-emerald-600 font-semibold">Passed Screen</span>
                                    <span className="text-slate-400">Team Match</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Column 3: Offer Received */}
                        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/60">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-xs font-bold text-slate-800">Offer Received</span>
                              </div>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                2
                              </span>
                            </div>
                            <div className="space-y-2.5">
                              <div className="bg-white p-3 rounded-lg border border-emerald-300 shadow-xs bg-gradient-to-br from-emerald-50/20 to-white">
                                <div className="flex items-center justify-between gap-1 mb-1.5">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                                      O
                                    </div>
                                    <span className="font-bold text-xs text-slate-900">OpenAI</span>
                                  </div>
                                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                                    $240k Base
                                  </span>
                                </div>
                                <p className="text-[11px] font-semibold text-slate-800 line-clamp-1">Research Software Engineer</p>
                                <div className="mt-2 space-y-1 text-[10px] text-slate-500">
                                  <div className="flex items-center justify-between font-semibold text-emerald-700">
                                    <span>Total Comp:</span>
                                    <span>$385k / yr</span>
                                  </div>
                                  <div className="flex items-center justify-between pt-1 text-slate-400">
                                    <span>Deadline in 4d</span>
                                    <span className="text-blue-600 font-semibold">Reviewing</span>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all">
                                <div className="flex items-center justify-between gap-1 mb-1.5">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                                      D
                                    </div>
                                    <span className="font-bold text-xs text-slate-900">Datadog</span>
                                  </div>
                                  <span className="text-[9px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                                    $205k Base
                                  </span>
                                </div>
                                <p className="text-[11px] font-semibold text-slate-800 line-clamp-1">Staff Cloud Engineer</p>
                                <div className="mt-2 space-y-1 text-[10px] text-slate-500">
                                  <div className="flex items-center justify-between font-semibold text-slate-700">
                                    <span>Total Comp:</span>
                                    <span>$295k / yr</span>
                                  </div>
                                  <div className="flex items-center justify-between pt-1 text-slate-400">
                                    <span>Remote US</span>
                                    <span className="text-emerald-600 font-semibold">Comparing</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Column 4: Rejected */}
                        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/60">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-rose-500" />
                                <span className="text-xs font-bold text-slate-800">Rejected</span>
                              </div>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                                3
                              </span>
                            </div>
                            <div className="space-y-2.5">
                              <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs opacity-80 hover:opacity-100 transition-opacity">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-black text-xs">
                                    G
                                  </div>
                                  <span className="font-bold text-xs text-slate-900">Google</span>
                                </div>
                                <p className="text-[11px] font-semibold text-slate-700 line-clamp-1">Principal Systems Architect</p>
                                <div className="mt-2 text-[10px] text-slate-400">
                                  <span>Position filled internally</span>
                                </div>
                              </div>

                              <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs opacity-80 hover:opacity-100 transition-opacity">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-black text-xs">
                                    M
                                  </div>
                                  <span className="font-bold text-xs text-slate-900">Meta</span>
                                </div>
                                <p className="text-[11px] font-semibold text-slate-700 line-clamp-1">Software Engineer E6</p>
                                <div className="mt-2 text-[10px] text-slate-400">
                                  <span>Requisition paused</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* AI Interview Studio Board */}
                    {activeBoardTab === "Interviews" && (
                      <div className="space-y-4">
                        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200/70">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-slate-900">
                                  AI Voice Mock Interview Studio
                                </span>
                                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                                  Live Practice Mode
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                Target Role: Staff Systems Architect • Level 5
                              </p>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-semibold">
                              <span className="text-emerald-600 flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" />
                                Voice STT Connected
                              </span>
                            </div>
                          </div>

                          {/* Active Practice Question Card */}
                          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs mb-3">
                            <div className="flex items-center justify-between text-[11px] font-bold text-blue-600 mb-1.5">
                              <span>QUESTION 3 OF 5 • SYSTEM ARCHITECTURE</span>
                              <span className="text-slate-400 font-normal">2m 45s</span>
                            </div>
                            <p className="text-sm font-bold text-slate-900 leading-snug">
                              "How would you design a distributed job application webhook ingestion engine that guarantees zero lost updates during traffic spikes?"
                            </p>

                            {/* Audio Waveform Animation & Mic Bar */}
                            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3 min-w-0">
                                <button
                                  className="w-8 h-8 rounded-full bg-blue-600 !text-white flex items-center justify-center shadow-xs"
                                  style={{ color: "#ffffff" }}
                                >
                                  <Mic className="w-4 h-4 animate-pulse !text-white" />
                                </button>
                                <div className="space-y-0.5">
                                  <p className="text-[11px] font-bold text-slate-800">Listening to Candidate Response...</p>
                                  <p className="text-[10px] text-slate-500 italic truncate">
                                    "I would implement an outbox pattern backed by Kafka partitions and idempotency keys..."
                                  </p>
                                </div>
                              </div>

                              {/* Waveform Bars */}
                              <div className="flex items-center gap-1 h-5 shrink-0">
                                <div className="w-1 bg-blue-500 h-2 rounded-full animate-bounce" />
                                <div className="w-1 bg-blue-600 h-4 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                                <div className="w-1 bg-blue-500 h-3 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                                <div className="w-1 bg-blue-600 h-5 rounded-full animate-bounce" style={{ animationDelay: "0.45s" }} />
                                <div className="w-1 bg-blue-400 h-2 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                              </div>
                            </div>
                          </div>

                          {/* AI Real-time Evaluation Scorecard */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                              <span className="text-[10px] text-slate-500 font-medium">Predicted Score</span>
                              <p className="text-base font-bold text-slate-900 mt-0.5">92 / 100</p>
                            </div>
                            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                              <span className="text-[10px] text-slate-500 font-medium">Technical Depth</span>
                              <p className="text-base font-bold text-emerald-600 mt-0.5">95% (Strong)</p>
                            </div>
                            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                              <span className="text-[10px] text-slate-500 font-medium">Key Concepts Covered</span>
                              <p className="text-[11px] font-semibold text-slate-800 mt-0.5">Idempotency, Dead-letter queue</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Analytics Studio Board */}
                    {activeBoardTab === "Analytics" && (
                      <div className="space-y-4">
                        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="text-xs font-bold text-slate-800">
                                Application Velocity & Interview Trajectory
                              </span>
                              <p className="text-[10px] text-slate-500">Weekly conversion metrics across all sources</p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-blue-600 font-bold">Response Rate: 34.2%</span>
                              <p className="text-[10px] text-emerald-600 font-medium">+14% vs baseline</p>
                            </div>
                          </div>

                          {/* Interactive Chart Line SVG */}
                          <div className="relative h-44 w-full flex items-end">
                            <svg
                              className="w-full h-full overflow-visible"
                              viewBox="0 0 500 140"
                              preserveAspectRatio="none"
                            >
                              <line x1="0" y1="35" x2="500" y2="35" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                              <line x1="0" y1="70" x2="500" y2="70" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                              <line x1="0" y1="105" x2="500" y2="105" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />

                              <defs>
                                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
                                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                                </linearGradient>
                              </defs>
                              <path
                                d="M 0 110 Q 100 80, 200 85 T 400 30 L 500 15 L 500 140 L 0 140 Z"
                                fill="url(#chartGlow)"
                              />
                              <path
                                d="M 0 110 Q 100 80, 200 85 T 400 30 L 500 15"
                                fill="none"
                                stroke="#2563EB"
                                strokeWidth="3"
                                strokeLinecap="round"
                              />
                              <circle cx="400" cy="30" r="5" className="fill-blue-600 stroke-white stroke-2" />
                            </svg>
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400 mt-2 px-1 font-medium">
                            {chartPoints.map((p) => (
                              <span key={p.month}>{p.month}</span>
                            ))}
                          </div>

                          {/* Funnel Conversion Bar */}
                          <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-4 gap-2 text-center text-xs">
                            <div className="bg-white p-2 rounded-lg border border-slate-200">
                              <span className="text-[10px] text-slate-400">Applications</span>
                              <p className="font-bold text-slate-900">48 (100%)</p>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-slate-200">
                              <span className="text-[10px] text-slate-400">Responses</span>
                              <p className="font-bold text-blue-600">16 (33.3%)</p>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-slate-200">
                              <span className="text-[10px] text-slate-400">Interviews</span>
                              <p className="font-bold text-amber-600">10 (20.8%)</p>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-slate-200">
                              <span className="text-[10px] text-slate-400">Offers</span>
                              <p className="font-bold text-emerald-600">2 (4.2%)</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Offer Pipeline Board */}
                    {activeBoardTab === "Offers" && (
                      <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 pb-2 border-b border-slate-200">
                          <span>Active Offers Compensation Matrix</span>
                          <span className="text-emerald-600 font-bold">$222.5k Avg Base Salary</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="bg-white p-4 rounded-xl border border-emerald-300 shadow-xs">
                            <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                                  O
                                </div>
                                <span>OpenAI</span>
                              </div>
                              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-xs">
                                $385k Total Comp
                              </span>
                            </div>
                            <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Base Salary:</span>
                                <span className="font-bold text-slate-900">$240,000</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Annual Equity:</span>
                                <span className="font-bold text-slate-900">$120,000 / yr</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Signing Bonus:</span>
                                <span className="font-bold text-slate-900">$25,000</span>
                              </div>
                            </div>
                            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                              <span className="text-slate-400">Decision due in 4 days</span>
                              <span className="text-emerald-600 font-bold">Offer In Hand</span>
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs">
                                  D
                                </div>
                                <span>Datadog</span>
                              </div>
                              <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-xs">
                                $295k Total Comp
                              </span>
                            </div>
                            <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Base Salary:</span>
                                <span className="font-bold text-slate-900">$205,000</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Annual Equity:</span>
                                <span className="font-bold text-slate-900">$75,000 / yr</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Remote Benefit:</span>
                                <span className="font-bold text-emerald-600">100% Remote US</span>
                              </div>
                            </div>
                            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                              <span className="text-slate-400">Decision due in 10 days</span>
                              <span className="text-blue-600 font-bold">Reviewing Packet</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dashboard Bottom Status Bar */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Browser Extension Connected
                    </span>
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="inline-flex items-center px-3 py-1 text-xs font-semibold !text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors cursor-pointer shadow-2xs"
                      style={{ color: "#ffffff" }}
                    >
                      Open Full Workspace →
                    </button>
                  </div>
                </main>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. SECTION 3: STRUCTURE PROCESS SECTION ("HOW IT WORKS")
      ───────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-white relative border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100/80 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-4"
            >
              <span>How It Works</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
            >
              Get Hired In 3 Simple Steps
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-base text-slate-600 mt-4 leading-relaxed"
            >
              From bookmarking roles to evaluating competing offers—uncover insights, track progress,
              and close negotiations smarter in three simple steps.
            </motion.p>
          </div>

          {/* 3 Step Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 01 - Hunter Web Clipper */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-blue-200 hover:shadow-md transition-all duration-200 group"
            >
              <div>
                <div className="relative h-48 w-full bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between p-3.5 overflow-hidden mb-6">
                  {/* Extension Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-white">
                        <Briefcase className="w-3 h-3" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 tracking-tight">
                        Hunter Clipper
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Extension
                    </span>
                  </div>

                  {/* Captured Role Mini-Card */}
                  <div className="bg-white rounded-lg border border-slate-200/80 p-2.5 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-900 truncate">
                        Stripe • Staff Backend
                      </span>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                        $190k - $245k
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span>San Francisco (Hybrid)</span>
                      <span>•</span>
                      <span>Full-time</span>
                    </div>
                    <div className="pt-1 flex items-center justify-between border-t border-slate-100 text-[10px]">
                      <span className="text-slate-500 font-medium">Synced to Kanban</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Saved
                      </span>
                    </div>
                  </div>

                  {/* Connected Sources Bar */}
                  <div className="flex items-center justify-between text-[9px] font-semibold text-slate-600">
                    <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded">LinkedIn</span>
                    <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded">Indeed</span>
                    <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded">Greenhouse</span>
                    <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded">Lever</span>
                  </div>
                </div>

                <div className="text-xs font-bold text-blue-600 mb-1">01</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  One-Click Opportunity Capture
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Clip positions, compensation, and job descriptions directly from LinkedIn, Indeed, Greenhouse, and Lever with the Hunter browser extension—zero manual entry.
                </p>
              </div>
            </motion.div>

            {/* Step 02 - AI Resume Tailoring & Reminders */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-blue-200 hover:shadow-md transition-all duration-200 group"
            >
              <div>
                <div className="relative h-48 w-full bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between p-3.5 overflow-hidden mb-6">
                  {/* ATS Match Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                        <Sparkles className="w-3 h-3" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-800">
                        AI Resume Match
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      94% Match
                    </span>
                  </div>

                  {/* Tailored Cover Letter Preview */}
                  <div className="bg-white rounded-lg border border-slate-200/80 p-2.5 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <FileText className="w-3 h-3 text-blue-600" />
                        AI Cover Letter
                      </span>
                      <span className="text-blue-600 font-semibold">Generated in 1.4s</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight italic line-clamp-2">
                      "Highlighting 5+ years optimizing distributed Go microservices and high-throughput Kafka streaming pipelines..."
                    </p>
                  </div>

                  {/* Automated Reminder Pill */}
                  <div className="flex items-center justify-between bg-amber-50/90 border border-amber-200/80 rounded-md px-2.5 py-1.5 text-[10px]">
                    <div className="flex items-center gap-1.5 text-amber-900 font-semibold">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>Follow-up alert in 5 days</span>
                    </div>
                    <span className="text-[9px] font-bold text-amber-700 uppercase tracking-wider">Automated</span>
                  </div>
                </div>

                <div className="text-xs font-bold text-blue-600 mb-1">02</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  AI Tailoring & Smart Reminders
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Generate AI-tailored cover letters matching your resume to the target JD. Hunter automatically schedules follow-up alerts so high-priority applications never go cold.
                </p>
              </div>
            </motion.div>

            {/* Step 03 - AI Voice Mock Interview & Comp Negotiation */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-blue-200 hover:shadow-md transition-all duration-200 group"
            >
              <div>
                <div className="relative h-48 w-full bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between p-3.5 overflow-hidden mb-6">
                  {/* AI Mock Interview Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center">
                        <Mic className="w-3 h-3" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-800">
                        Voice Interview Studio
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                      Live Speech AI
                    </span>
                  </div>

                  {/* Speech Waveform Simulation */}
                  <div className="bg-white rounded-lg border border-slate-200/80 p-2.5 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-600 font-medium">Candidate Speaking...</span>
                      <span className="text-emerald-600 font-bold">92/100 Score</span>
                    </div>
                    <div className="flex items-center justify-center gap-1 h-5">
                      <div className="w-1 bg-blue-600 rounded-full h-3 animate-pulse" />
                      <div className="w-1 bg-blue-600 rounded-full h-5 animate-pulse" />
                      <div className="w-1 bg-blue-600 rounded-full h-2 animate-pulse" />
                      <div className="w-1 bg-blue-600 rounded-full h-4 animate-pulse" />
                      <div className="w-1 bg-blue-500 rounded-full h-5 animate-pulse" />
                      <div className="w-1 bg-blue-500 rounded-full h-3 animate-pulse" />
                      <div className="w-1 bg-blue-400 rounded-full h-2 animate-pulse" />
                    </div>
                  </div>

                  {/* Comp Matrix Strip */}
                  <div className="flex items-center justify-between bg-emerald-50/90 border border-emerald-200/80 rounded-md px-2.5 py-1.5 text-[10px]">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-semibold truncate">
                      <Award className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">Stripe vs Airbnb Offer Matrix</span>
                    </div>
                    <span className="text-[9px] font-bold text-emerald-700 shrink-0 ml-1">+$35k Lift</span>
                  </div>
                </div>

                <div className="text-xs font-bold text-blue-600 mb-1">03</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  AI Voice Mocks & Comp Negotiation
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Practice high-stakes technical rounds with real-time AI voice speech feedback. Evaluate competing packages side-by-side with total compensation analytics.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. SECTION 4: COMPREHENSIVE CLEAN FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer id="main-footer" className="bg-white border-t border-slate-200/80 pt-16 pb-12 text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-100">
            {/* Brand Info (5 Cols) */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                  <Briefcase className="w-4 h-4 stroke-[2.4]" />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Hunter
                </span>
              </div>

              <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                Turn application chaos into clear, actionable progress so you can land your dream offer faster.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => navigate("/signup")}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold !text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                  style={{ color: "#ffffff" }}
                >
                  <span className="!text-white" style={{ color: "#ffffff" }}>Start Free Today</span>
                  <ArrowRight className="w-4 h-4 !text-white" />
                </button>
              </div>
            </div>

            {/* Links Groups (7 Cols) */}
            <div className="md:col-span-7 grid grid-cols-3 gap-6 sm:gap-8">
              {/* Features Column */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Features
                </h4>
                <ul className="space-y-2.5 text-sm">
                  {["Board View", "Analytics Studio", "AI Voice Coach", "Job Clipper"].map((item) => (
                    <li key={item}>
                      <a
                        href="#board"
                        onClick={(e) => handleNavClick(e, "#board")}
                        className="text-slate-500 hover:text-slate-900 transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources Column */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Resources
                </h4>
                <ul className="space-y-2.5 text-sm">
                  {["How It Works", "Tech Salary Guide", "Interview Cheat Sheet", "Blog"].map((item) => (
                    <li key={item}>
                      <a
                        href="#how-it-works"
                        onClick={(e) => handleNavClick(e, "#how-it-works")}
                        className="text-slate-500 hover:text-slate-900 transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Platform Column */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Platform
                </h4>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <button
                      onClick={() => navigate("/login")}
                      className="text-slate-500 hover:text-slate-900 transition-colors text-left cursor-pointer"
                    >
                      Sign In
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate("/signup")}
                      className="text-slate-500 hover:text-slate-900 transition-colors text-left cursor-pointer"
                    >
                      Create Account
                    </button>
                  </li>
                  <li>
                    <a
                      href="#hero-section"
                      onClick={(e) => handleNavClick(e, "#hero-section")}
                      className="text-slate-500 hover:text-slate-900 transition-colors"
                    >
                      System Status
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Credits Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>Built with React, Tailwind CSS & Framer Motion.</p>
            <p>© {new Date().getFullYear()} Hunter. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
