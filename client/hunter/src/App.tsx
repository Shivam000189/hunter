import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { ThemeProvider } from "./context/ThemeContext";
import { useAuth } from "./context/AuthContext";

const Hunter = lazy(() => import("./pages/Hunter").then((m) => ({ default: m.Hunter })));
const Login = lazy(() => import("./pages/Login").then((m) => ({ default: m.Login })));
const Signup = lazy(() => import("./pages/Signup").then((m) => ({ default: m.Signup })));
const Dashboard = lazy(() => import("./pages/Dashboard").then((m) => ({ default: m.Dashboard })));
const Jobs = lazy(() => import("./pages/Jobs").then((m) => ({ default: m.Jobs })));
const AiCoverLetter = lazy(() => import("./pages/AiCoverLetter").then((m) => ({ default: m.AiCoverLetter })));
const AiInterview = lazy(() => import("./pages/AiInterview").then((m) => ({ default: m.AiInterview })));
const Resume = lazy(() => import("./pages/Resume").then((m) => ({ default: m.Resume })));
const Analytics = lazy(() => import("./pages/Analytics").then((m) => ({ default: m.Analytics })));
const Reminder = lazy(() => import("./pages/Reminer").then((m) => ({ default: m.Reminder })));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-9 h-9 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Loading...</span>
      </div>
    </div>
  );
}

function LandingRoute() {
  const { hasRecentLogin } = useAuth();

  return hasRecentLogin ? <Navigate to="/jobs" replace /> : <Hunter />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingRoute />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/jobs"
                element={
                  <ProtectedRoute>
                    <Jobs />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/generator"
                element={
                  <ProtectedRoute>
                    <AiCoverLetter />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview"
                element={
                  <ProtectedRoute>
                    <AiInterview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resume"
                element={
                  <ProtectedRoute>
                    <Resume />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reminder"
                element={
                  <ProtectedRoute>
                    <Reminder />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
