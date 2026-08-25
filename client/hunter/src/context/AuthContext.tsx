import React, { createContext, useContext, useState } from "react";

type AuthContextType = {
  token: string | null;
  isGuest: boolean;
  hasRecentLogin: boolean;
  login: (token: string, isGuest?: boolean) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);
const LOGIN_WINDOW_MS = 24 * 60 * 60 * 1000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isGuest, setIsGuest] = useState(
    localStorage.getItem("isGuest") === "true"
  );
  const [loggedInAt, setLoggedInAt] = useState(() => {
    const storedLoginTime = Number(localStorage.getItem("loggedInAt"));
    return Number.isFinite(storedLoginTime) ? storedLoginTime : null;
  });

  function login(token: string, guest = false) {
    const now = Date.now();
    localStorage.setItem("token", token);
    localStorage.setItem("isGuest", String(guest));
    localStorage.setItem("loggedInAt", String(now));
    setToken(token);
    setIsGuest(guest);
    setLoggedInAt(now);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("isGuest");
    localStorage.removeItem("loggedInAt");
    setToken(null);
    setIsGuest(false);
    setLoggedInAt(null);
  }

  const hasRecentLogin = Boolean(
    token && loggedInAt && Date.now() - loggedInAt < LOGIN_WINDOW_MS
  );

  return (
    <AuthContext.Provider
      value={{ token, isGuest, hasRecentLogin, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}