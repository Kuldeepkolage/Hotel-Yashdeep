// File: src/admin/pages/Login.jsx
import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import useAuth from "../hooks/useAuth.js";

const initialForm = { email: "", password: "" };

export default function Login() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  if (!authLoading && isAuthenticated) {
    const redirectTo = location.state?.from?.pathname || "/admin/dashboard";
    return <Navigate to={redirectTo} replace />;
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverError) setServerError("");
  };

  const validate = () => {
    const errs = {};

    if (!form.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      errs.email = "Enter a valid email address.";
    }

    if (!form.password) {
      errs.password = "Password is required.";
    } else if (form.password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }

    return errs;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    setServerError("");

    try {
      await login(form.email.trim(), form.password, rememberMe);
      const redirectTo = location.state?.from?.pathname || "/admin/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Invalid email or password. Please try again.";
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-dark px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-grain opacity-20 pointer-events-none" />
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-secondary/60">
            <span className="font-display text-secondary text-2xl leading-none">Y</span>
          </span>
          <h1 className="mt-5 font-display text-2xl text-background">Hotel Yashdeep</h1>
          <p className="mt-1 text-xs uppercase tracking-widest2 text-secondary">Admin Console</p>
        </div>

        <div className="rounded-2xl bg-background border border-background/10 shadow-luxe p-8 md:p-10">
          <h2 className="font-display text-2xl text-dark">Welcome back</h2>
          <p className="mt-2 text-sm text-muted">
            Sign in to manage reservations, tables, and the website.
          </p>

          {serverError && (
            <div
              className="mt-6 flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary"
              role="alert"
              data-testid="login-error"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-8 space-y-6" data-testid="admin-login-form" noValidate>
            <label className="block">
              <span className="text-[11px] font-medium uppercase tracking-widest2 text-muted">
                Email
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="admin@hotelyashdeep.com"
                autoComplete="username"
                className="input-luxe mt-2"
                data-testid="login-email"
              />
              {errors.email && (
                <span className="mt-2 block text-xs text-primary" data-testid="error-email">
                  {errors.email}
                </span>
              )}
            </label>

            <label className="block">
              <span className="text-[11px] font-medium uppercase tracking-widest2 text-muted">
                Password
              </span>
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="input-luxe pr-10"
                  data-testid="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  data-testid="toggle-password-visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <span className="mt-2 block text-xs text-primary" data-testid="error-password">
                  {errors.password}
                </span>
              )}
            </label>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  data-testid="remember-me"
                />
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              data-testid="login-submit"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-xs text-background/50">
          © {new Date().getFullYear()} Hotel Yashdeep. Authorized personnel only.
        </p>
      </div>
    </div>
  );
}