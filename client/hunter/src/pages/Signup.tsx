import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import api from "../api/client";
import { AuthLayout } from "../components/auth/AuthLayout";
import { AuthField, authFormContainer } from "../components/auth/AuthField";

type SignupForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const strengthMeta = [
  { label: "Too short", color: "var(--hunter-danger)" },
  { label: "Weak", color: "var(--hunter-danger)" },
  { label: "Okay", color: "var(--hunter-warning)" },
  { label: "Good", color: "var(--hunter-accent)" },
  { label: "Strong", color: "var(--hunter-success)" },
];

export function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState<SignupForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => getPasswordStrength(form.password), [form.password]);
  const passwordsMismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setError(null);
    setForm((prev) => ({
      ...prev,
      [name as keyof SignupForm]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/auth/register", {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        password: form.password,
      });

      setSuccess(true);
      setTimeout(() => navigate("/login"), 900);
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      mode="signup"
      eyebrow="Free while you're job hunting"
      title="Create your account"
      subtitle="Set up your pipeline in under a minute — no card required."
      footer={
        <p className="text-center text-xs sm:text-[13px] text-[var(--hunter-muted)]">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-[var(--hunter-text)] hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-2.5 rounded-2xl border border-[var(--hunter-border)] bg-[var(--hunter-surface)] px-5 py-8 text-center"
          >
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16 }}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-status-offer-soft status-offer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </motion.span>
            <p className="font-medium text-sm">Account created</p>
            <p className="text-xs text-[var(--hunter-muted)]">Taking you to sign in…</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            variants={authFormContainer}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
            className="space-y-3"
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

            <div className="grid grid-cols-2 gap-2.5">
              <AuthField
                icon="user"
                label="First name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="John"
                autoComplete="given-name"
              />
              <AuthField
                icon="user"
                label="Last name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Doe"
                autoComplete="family-name"
              />
            </div>

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

            <div>
              <AuthField
                icon="lock"
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <AnimatePresence>
                {form.password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-1 overflow-hidden"
                  >
                    <div className="flex gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <motion.span
                          key={i}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: i < strength ? 1 : 0.18 }}
                          transition={{ duration: 0.25 }}
                          style={{
                            transformOrigin: "left",
                            background: i < strength ? strengthMeta[strength].color : "var(--hunter-border)",
                          }}
                          className="h-1 flex-1 rounded-full"
                        />
                      ))}
                    </div>
                    <p className="mt-0.5 text-[11px] text-[var(--hunter-muted)]">
                      {strengthMeta[strength].label}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <AuthField
                icon="lock"
                label="Confirm password"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <AnimatePresence>
                {passwordsMismatch && (
                  <motion.p
                    initial={{ opacity: 0, y: -2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-1 text-[11px] text-[var(--hunter-danger)]"
                  >
                    Passwords don't match
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} className="pt-0.5">
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
                  "Create account"
                )}
              </motion.button>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}
