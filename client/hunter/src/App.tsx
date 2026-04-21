import { BrowserRouter, Routes, Route } from "react-router-dom";
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


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
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

          <Route path="/generator" element={<AiCoverLetter />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reminder" element={<Reminder />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}