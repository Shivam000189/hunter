import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import { Jobs } from "./pages/Jobs";
import { AiCoverLetter } from "./pages/AiCoverLetter";
import { Resume } from "./pages/Resume";
import { Analytics } from "./pages/Analytics";
import { Reminder } from "./pages/Reminer";
import { Hunter } from "./pages/Hunter";
import { ThemeProvider } from "./context/ThemeContext";
import { useAuth } from "./context/AuthContext";

function LandingRoute() {
  const { hasRecentLogin } = useAuth();

  return hasRecentLogin ? <Navigate to="/jobs" replace /> : <Hunter />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
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
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
