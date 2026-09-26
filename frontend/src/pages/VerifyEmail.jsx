import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  RotateCw,
  Mail,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useCustomerAuth } from "../context/CustomerAuthContext.jsx";
import PageTransition from "../components/common/PageTransition.jsx";

export default function VerifyEmail() {
  const { verifyOtp, resendOtp, isAuthenticated, loading: authLoading } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const emailParam = queryParams.get("email") || "";
  const redirectTo = queryParams.get("redirect") || "/reservations";

  const [email, setEmail] = useState(location.state?.email || emailParam);
  const [otp, setOtp] = useState("");
  const [devCode, setDevCode] = useState(location.state?.devOtp || null);
  const [errors, setErrors] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [serverError, setServerError] = useState("");
  const [resendSuccess, setResendSuccess] = useState("");
  const [cooldown, setCooldown] = useState(60);

  if (!authLoading && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const onOtpChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(val);
    if (errors) setErrors("");
    if (serverError) setServerError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrors("Email address is required.");
      return;
    }
    if (otp.length !== 6) {
      setErrors("Please enter the complete 6-digit code.");
      return;
    }

    setSubmitting(true);
    setServerError("");
    setResendSuccess("");

    try {
      await verifyOtp({ email: email.trim(), otp: otp.trim() });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Verification failed. Please check the code and try again.";
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    if (!email.trim()) {
      setServerError("Please specify your email address to resend the code.");
      return;
    }

    setResending(true);
    setServerError("");
    setResendSuccess("");

    try {
      const res = await resendOtp({ email: email.trim() });
      if (res?.devOtp) {
        setDevCode(res.devOtp);
      }
      setResendSuccess("A fresh 6-digit code has been dispatched to your email.");
      setCooldown(60);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Could not resend code. Please wait a minute and try again.";
      setServerError(message);
    } finally {
      setResending(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[90vh] flex items-center justify-center pt-24 sm:pt-28 pb-12 px-4 relative overflow-hidden">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/4 -left-36 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-36 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div
            className="rounded-3xl bg-white/95 backdrop-blur-md border border-secondary/25 shadow-[0_24px_64px_-16px_rgba(44,24,16,0.12)] p-8 md:p-11 transition-all text-center"
            data-testid="verify-email-card"
          >
            {/* Crest Header */}
            <div className="mx-auto w-14 h-14 rounded-full border-2 border-secondary/60 flex items-center justify-center bg-secondary/10 shadow-sm mb-4">
              <Mail size={24} className="text-secondary" />
            </div>
            <span className="eyebrow justify-center">Email Verification</span>
            <h1 className="heading-md mt-2 text-dark font-display">Enter Your Code</h1>
            <p className="mt-2 text-sm text-muted">
              We sent a 6-digit verification code to{" "}
              <span className="font-semibold text-dark break-all">{email || "your email address"}</span>.
            </p>

            {/* Server Error */}
            {serverError && (
              <div
                role="alert"
                className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-800 shadow-sm text-left animate-fadeIn"
                data-testid="verify-email-error"
              >
                <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
                <span className="font-medium">{serverError}</span>
              </div>
            )}

            {/* Resend Success */}
            {resendSuccess && (
              <div
                role="status"
                className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-sm text-emerald-800 shadow-sm text-left animate-fadeIn"
                data-testid="verify-email-success"
              >
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                <span className="font-medium">{resendSuccess}</span>
              </div>
            )}

            {/* Dev Mode OTP Indicator (when SMTP is not configured) */}
            {devCode && (
              <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-300/80 text-amber-950 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-left shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  <div>
                    <span className="font-semibold text-amber-900 block text-[11px] uppercase tracking-wider">Dev Mode Code</span>
                    <span className="font-mono text-base font-bold tracking-[0.2em] text-primary">{devCode}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOtp(devCode);
                    setErrors("");
                  }}
                  className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-amber-200/80 hover:bg-amber-300 text-amber-900 font-semibold text-xs transition-colors shrink-0 shadow-xs"
                >
                  Click to Auto-Fill
                </button>
              </div>
            )}

            <form onSubmit={onSubmit} className="mt-8 space-y-6" data-testid="verify-otp-form">
              {!emailParam && (
                <div className="text-left">
                  <label className="block text-[11px] font-semibold uppercase tracking-widest2 text-dark/70 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-[#faf8f5] text-dark placeholder:text-muted/40 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all"
                    data-testid="verify-email-input"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-widest2 text-dark/70 mb-3">
                  6-Digit Verification PIN
                </label>
                <div className="flex justify-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={onOtpChange}
                    maxLength={6}
                    placeholder="••••••"
                    className="w-64 text-center text-3xl font-mono tracking-[0.45em] py-3.5 px-4 rounded-2xl border-2 border-secondary/40 bg-[#faf8f5] text-dark focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/15 focus:bg-white shadow-sm transition-all"
                    data-testid="otp-input"
                    autoFocus
                  />
                </div>
                {errors && (
                  <span className="mt-2 block text-xs font-medium text-red-600 text-center">
                    {errors}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting || otp.length !== 6}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-xl bg-gradient-to-r from-primary via-[#8a2424] to-primary hover:from-dark hover:to-dark text-white disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.99]"
                data-testid="verify-submit-button"
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin text-secondary" /> Verifying…
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    Verify & Continue <ArrowRight size={16} />
                  </span>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-border/80 flex flex-col items-center gap-3 text-sm">
              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0 || resending}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary hover:text-dark disabled:text-muted/60 disabled:cursor-not-allowed transition-colors py-1 px-3 rounded-lg hover:bg-primary/5"
                data-testid="resend-otp-button"
              >
                <RotateCw size={13} className={resending ? "animate-spin" : ""} />
                {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend 6-digit code"}
              </button>

              <div className="text-muted text-xs">
                Need to change your email?{" "}
                <Link to="/signup" className="font-semibold text-primary hover:text-dark underline">
                  Start over
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
