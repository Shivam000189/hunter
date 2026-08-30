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
        <p className="text-center text-xs sm:text-[13px] text-[var(--hunter-muted)]">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-[var(--hunter-text)] hover:underline">
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
              animate={{ opacity: 1, height: "auto", marginBottom: 2 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden rounded-xl border border-[var(--hunter-danger)]/30 bg-[var(--hunter-danger)]/10 px-3 py-2 text-xs text-[var(--hunter-danger)]"
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
            <a href="#" className="text-[11px] font-medium text-[var(--hunter-accent)] hover:underline">
              Forgot password?
            </a>
          }
        />

        <motion.label
          variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
          className="flex select-none items-center gap-2 text-xs text-[var(--hunter-muted)]"
        >
          <input
            name="remember"
            type="checkbox"
            checked={form.remember}
            onChange={handleChange}
            className="rounded border-slate-300 text-[var(--hunter-accent)] focus:ring-[var(--hunter-accent)]"
          />
          Remember me on this device
        </motion.label>

        <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} className="space-y-2 pt-0.5">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="hunter-primary-btn flex w-full items-center justify-center gap-2 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white"
              />
            ) : (
              "Sign in"
            )}
          </motion.button>

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleGuestLogin}
            disabled={guestLoading}
            className="hunter-secondary-btn w-full py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
          >
            {guestLoading ? "Signing in…" : "Continue as guest"}
          </motion.button>
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
}
