import React, { createContext, useContext, useState } from "react";

type AuthContextType = {
  token: string | null;
  isGuest: boolean;
  login: (token: string, isGuest?: boolean) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isGuest, setIsGuest] = useState(
    localStorage.getItem("isGuest") === "true"
  );

  function login(token: string, guest = false) {
    localStorage.setItem("token", token);
    localStorage.setItem("isGuest", String(guest));
    setToken(token);
    setIsGuest(guest);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("isGuest");
    setToken(null);
    setIsGuest(false);
  }

  return (
    <AuthContext.Provider value={{ token, isGuest, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}