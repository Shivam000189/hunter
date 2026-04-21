import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, Signup } from "./pages/auth";
import { Dashboard } from "./pages/Dashboard";
import { Jobs } from "./pages/Jobs";
import { AiCoverLetter } from "./pages/AiCoverLetter";
import { Resume } from "./pages/Resume";
import { Analytics } from "./pages/Analytics";
import { Reminder } from "./pages/Reminer";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/genreator" element={<AiCoverLetter />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/alaytics" element={<Analytics />} />
        <Route path="/reminder" element={<Reminder />} />
        
      </Routes>
    </BrowserRouter>
  );
}