import { useState } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useCustomerAuth } from "../context/CustomerAuthContext.jsx";
import PageTransition from "../components/common/PageTransition.jsx";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export default function Signup() {
  const { signup, isAuthenticated, loading: authLoading } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const redirectTo = queryParams.get("redirect") || "/reservations";

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  if (!authLoading && isAuthenticated) {
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
    if (!form.name.trim()) {
      errs.name = "Full name is required.";
    } else if (form.name.trim().length < 2) {
      errs.name = "Name must be at least 2 characters.";
    }

    if (!form.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      errs.email = "Enter a valid email address.";
    }

    if (!form.phone.trim()) {
      errs.phone = "Phone number is required.";
    } else if (!/^[0-9+\-\s]{7,15}$/.test(form.phone.trim())) {
      errs.phone = "Enter a valid phone number (7-15 digits).";
    }

    if (!form.password) {
      errs.password = "Password is required.";
    } else if (form.password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }

    if (form.password !== form.confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
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
      const res = await signup({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });

      navigate(
        `/verify-email?email=${encodeURIComponent(form.email.trim())}&redirect=${encodeURIComponent(redirectTo)}`,
        {
          replace: true,
          state: {
            email: form.email.trim(),
            devOtp: res?.devOtp,
            redirect: redirectTo,
          },
        }
      );
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Could not create account. Please try again.";
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[90vh] flex items-center justify-center pt-24 sm:pt-28 pb-12 px-4 relative overflow-hidden">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/4 -left-36 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-36 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-xl relative z-10">
          <div
            className="rounded-3xl bg-white/95 backdrop-blur-md border border-secondary/25 shadow-[0_24px_64px_-16px_rgba(44,24,16,0.12)] p-6 sm:p-8 md:p-12 transition-all"
            data-testid="customer-signup-card"
          >
            {/* Brand Crest Header */}
            <div className="text-center mb-8">
              <div className="mx-auto w-14 h-14 rounded-full border-2 border-secondary/60 flex items-center justify-center bg-secondary/10 shadow-sm mb-4">
                <span className="font-display text-secondary text-2xl font-bold leading-none">
                  Y
                </span>
              </div>
              <span className="eyebrow justify-center">Join Hotel Yashdeep</span>
              <h1 className="heading-md mt-2 text-dark font-display">Create Your Account</h1>
              <p className="mt-2 text-sm text-muted max-w-sm mx-auto">
                Sign up to reserve confirmed tables, save your dining preferences, and view bookings.
              </p>
            </div>

            {/* Error Message */}
            {serverError && (
              <div
                role="alert"
                className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-800 shadow-sm animate-fadeIn"
                data-testid="customer-signup-error"
              >
                <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
                <span className="font-medium">{serverError}</span>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-5" data-testid="customer-signup-form" noValidate>
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-widest2 text-dark/70 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted/70">
                    <User size={17} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Aarti Deshmukh"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-[#faf8f5] text-dark placeholder:text-muted/40 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all"
                    data-testid="signup-name-input"
                  />
                </div>
                {errors.name && (
                  <span className="mt-1.5 block text-xs font-medium text-red-600">
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Email & Phone */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-widest2 text-dark/70 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted/70">
                      <Mail size={17} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={onChange}
                      placeholder="you@email.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-[#faf8f5] text-dark placeholder:text-muted/40 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all"
                      data-testid="signup-email-input"
                    />
                  </div>
                  {errors.email && (
                    <span className="mt-1.5 block text-xs font-medium text-red-600">
                      {errors.email}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-widest2 text-dark/70 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted/70">
                      <Phone size={17} />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={onChange}
                      placeholder="+91 9307129206"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-[#faf8f5] text-dark placeholder:text-muted/40 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all"
                      data-testid="signup-phone-input"
                    />
                  </div>
                  {errors.phone && (
                    <span className="mt-1.5 block text-xs font-medium text-red-600">
                      {errors.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-widest2 text-dark/70 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted/70">
                      <Lock size={17} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={onChange}
                      placeholder="At least 6 characters"
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-[#faf8f5] text-dark placeholder:text-muted/40 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all"
                      data-testid="signup-password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="mt-1.5 block text-xs font-medium text-red-600">
                      {errors.password}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-widest2 text-dark/70 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted/70">
                      <Lock size={17} />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={onChange}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-[#faf8f5] text-dark placeholder:text-muted/40 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all"
                      data-testid="signup-confirm-password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors p-1"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="mt-1.5 block text-xs font-medium text-red-600">
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-4 inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-xl bg-gradient-to-r from-primary via-[#8a2424] to-primary hover:from-dark hover:to-dark text-white disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.99]"
                data-testid="customer-signup-submit"
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin text-secondary" /> Creating account…
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    Create Account <ArrowRight size={16} />
                  </span>
                )}
              </button>
            </form>

            {/* Footer guarantee & Sign in link */}
            <div className="mt-8 pt-6 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
              <span className="flex items-center gap-1.5 text-muted/90">
                <ShieldCheck size={14} className="text-secondary" /> Email verified reservation
              </span>
              <span>
                Already registered?{" "}
                <Link
                  to={`/login?redirect=${encodeURIComponent(redirectTo)}`}
                  className="font-semibold text-primary hover:text-dark underline transition-colors"
                >
                  Sign in here
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
