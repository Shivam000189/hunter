import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

type LoginForm = {
  email: string;
  password: string;
  remember: boolean;
};

export function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
    remember: false,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
        const res = await api.post("/api/auth/login", {
        email: form.email,
        password: form.password,
        });

        login(res.data.token); // save token
        navigate("/dashboard");
    } catch (err: any) {
        alert(err.response?.data?.message || "Login failed");
    }
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="mockup-screen rounded-2xl p-8 shadow-sm bg-white w-full max-w-md">
        <div className="max-w-sm mx-auto">
          <div className="mb-8 text-center">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold">Welcome back</h3>
            <p className="text-slate-500 text-sm mt-1">
              Sign in to your account
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  name="remember"
                  type="checkbox"
                  checked={form.remember}
                  onChange={handleChange}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                />
                <span className="text-slate-500">Remember me</span>
              </label>

              <a
                href="#"
                className="text-indigo-600 font-medium hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 font-medium hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}