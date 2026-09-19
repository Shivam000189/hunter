import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { AuthLayout } from "../components/auth/AuthLayout";
import { AuthField, authFormContainer } from "../components/auth/AuthField";

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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setError(null);
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post("/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      login(res.data.token);
      navigate("/jobs");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGuestLogin() {
    setError(null);
    setGuestLoading(true);
    try {
      const res = await api.post("/api/auth/guest");
      login(res.data.token, true);
      navigate("/jobs");
    } catch (err: any) {
      setError(err.response?.data?.message || "Guest login failed");
    } finally {
      setGuestLoading(false);
    }
  }

  return (
    <AuthLayout
      mode="login"
      eyebrow="Hunter for job seekers"
      title="Welcome back"
      subtitle="Sign in to pick up right where your search left off."
      footer={
        <p className="text-center text-xs sm:text-[13px] text-slate-500 dark:text-slate-400">
          Don't have an account?{" "}
          <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline">
            Create one for free
          </Link>
        </p>
      }
    >
      <motion.form
        variants={authFormContainer}
        initial="hidden"
        animate="show"
        className="space-y-3 sm:space-y-3.5"
        onSubmit={handleSubmit}
        noValidate
      >
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 4 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 px-3.5 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 shadow-2xs"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AuthField
          icon="mail"
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          autoComplete="email"
        />

        <AuthField
          icon="lock"
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          autoComplete="current-password"
          rightSlot={
            <a href="#" className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline">
              Forgot password?
            </a>
          }
        />

        <motion.label
          variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
          className="flex select-none items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer"
        >
          <input
            name="remember"
            type="checkbox"
            checked={form.remember}
            onChange={handleChange}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          Remember me on this device
        </motion.label>

        <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} className="space-y-2.5 pt-1">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold !text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            style={{ color: "#ffffff" }}
          >
            {loading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white"
              />
            ) : (
              <span className="!text-white" style={{ color: "#ffffff" }}>Sign in</span>
            )}
          </motion.button>

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleGuestLogin}
            disabled={guestLoading}
            className="w-full py-2.5 px-4 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xs transition-all duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            {guestLoading ? "Signing in…" : "Continue as guest"}
          </motion.button>
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
}
