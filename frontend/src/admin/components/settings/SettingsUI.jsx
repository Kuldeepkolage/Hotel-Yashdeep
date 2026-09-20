import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

/* -------------------------------------------------------------------------
 * Shared building blocks for the Settings page.
 *
 * Kept self-contained on purpose: no icon library, no animation library and
 * no toast package is imported, so nothing here can break the Vite build if
 * it is not installed. Colours use Tailwind arbitrary values that match the
 * existing admin panel (dark brown #2b1810, maroon #7a1f2b, gold #c9922b,
 * cream page background supplied by AdminLayout).
 * ---------------------------------------------------------------------- */

export const HEADING_FONT = {
  fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
};

export const ui = {
  label:
    "block text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500",
  inputBase:
    "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-stone-50 disabled:opacity-70",
  inputOk: "border-stone-200 focus:border-[#2b1810] focus:ring-[#2b1810]/15",
  inputBad: "border-red-300 focus:border-red-500 focus:ring-red-500/15",
  btnCore:
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
  btnMd: "px-4 py-2.5 text-sm",
  btnSm: "px-3 py-1.5 text-xs",
  btnPrimary:
    "bg-[#2b1810] text-white shadow-sm hover:bg-[#3d2418] focus-visible:ring-[#2b1810]/50",
  btnSecondary:
    "border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 focus-visible:ring-stone-400/50",
  btnDanger:
    "bg-red-700 text-white shadow-sm hover:bg-red-800 focus-visible:ring-red-600/50",
  btnDangerOutline:
    "border border-red-200 bg-white text-red-700 hover:bg-red-50 focus-visible:ring-red-500/40",
};

export const btn = (...variants) => [ui.btnCore, ui.btnMd, ...variants].join(" ");

export const btnSmall = (...variants) => [ui.btnCore, ui.btnSm, ...variants].join(" ");

export const inputClass = (hasError = false, extra = "") =>
  [ui.inputBase, hasError ? ui.inputBad : ui.inputOk, extra].filter(Boolean).join(" ");

/* ------------------------------- formatting ---------------------------- */

const isValidDate = (d) => d instanceof Date && !Number.isNaN(d.getTime());

export const formatDate = (value) => {
  if (!value) return "N/A";
  const d = new Date(value);
  if (!isValidDate(d)) return "N/A";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

export const formatDateTime = (value) => {
  if (!value) return "N/A";
  const d = new Date(value);
  if (!isValidDate(d)) return "N/A";
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

/** Returns the trimmed string, or "N/A" when empty / missing. */
export const orNA = (value) => {
  if (value === undefined || value === null) return "N/A";
  const text = String(value).trim();
  return text ? text : "N/A";
};

/** Describes the browser the admin is using right now (read from the browser itself). */
export const describeThisDevice = () => {
  if (typeof navigator === "undefined") return "N/A";
  const ua = navigator.userAgent || "";
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\/|Opera/.test(ua)
      ? "Opera"
      : /Firefox\//.test(ua)
        ? "Firefox"
        : /Chrome\//.test(ua)
          ? "Chrome"
          : /Safari\//.test(ua)
            ? "Safari"
            : null;
  const os = /Windows/.test(ua)
    ? "Windows"
    : /Android/.test(ua)
      ? "Android"
      : /iPhone|iPad|iPod/.test(ua)
        ? "iOS"
        : /Mac OS X/.test(ua)
          ? "macOS"
          : /CrOS/.test(ua)
            ? "ChromeOS"
            : /Linux/.test(ua)
              ? "Linux"
              : null;
  return [browser, os].filter(Boolean).join(" on ") || "This browser";
};

/* --------------------------------- icons ------------------------------- */

const ICONS = {
  user: (
    <>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </>
  ),
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  ),
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  key: (
    <>
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-10-7-10-7a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="m1 1 22 22" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    </>
  ),
  monitor: (
    <>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </>
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </>
  ),
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  x: <path d="M18 6 6 18M6 6l12 12" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  refresh: (
    <>
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </>
  ),
};

export function Icon({ name, className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {ICONS[name] || null}
    </svg>
  );
}

export function Spinner({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`animate-spin motion-reduce:animate-none ${className}`}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* --------------------------------- layout ------------------------------ */

export function SectionCard({ id, icon, title, description, action, tone = "default", children }) {
  const headingId = `${id}-heading`;
  const danger = tone === "danger";

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`rounded-2xl border bg-white shadow-[0_1px_2px_rgba(43,24,16,0.04)] ${
        danger ? "border-red-200" : "border-stone-200"
      }`}
    >
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-100 px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          {icon ? (
            <span
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                danger ? "bg-red-50 text-red-700" : "bg-[#f6ebe6] text-[#7a1f2b]"
              }`}
            >
              <Icon name={icon} />
            </span>
          ) : null}
          <div>
            <h2 id={headingId} className="text-xl leading-tight text-[#2b1810]" style={HEADING_FONT}>
              {title}
            </h2>
            {description ? <p className="mt-1 text-sm text-stone-500">{description}</p> : null}
          </div>
        </div>
        {action || null}
      </header>
      <div className="px-5 py-5 sm:px-6">{children}</div>
    </section>
  );
}

export function Field({ id, label, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-stone-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

const NOTICE_TONES = {
  error: "border-red-100 bg-red-50 text-red-700",
  success: "border-emerald-100 bg-emerald-50 text-emerald-700",
  info: "border-stone-200 bg-stone-50 text-stone-600",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
};

export function Notice({ tone = "info", icon, children, action }) {
  const iconName = icon || (tone === "success" ? "checkCircle" : "alert");
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${NOTICE_TONES[tone]}`}
    >
      <div className="flex items-start gap-2.5">
        <Icon name={iconName} className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="font-medium">{children}</div>
      </div>
      {action || null}
    </div>
  );
}

export function Skeleton({ className = "h-4 w-full" }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse motion-reduce:animate-none rounded-md bg-stone-100 ${className}`}
    />
  );
}

/* -------------------------------- toasts ------------------------------- */

const TOAST_TONES = {
  success: "border-emerald-200 bg-white text-emerald-800",
  error: "border-red-200 bg-white text-red-700",
  info: "border-stone-200 bg-white text-stone-700",
};

export function ToastViewport({ toasts, onDismiss }) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      aria-live="polite"
      className="pointer-events-none fixed right-4 top-24 z-[70] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.type === "error" ? "alert" : "status"}
          className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg ${
            TOAST_TONES[t.type] || TOAST_TONES.info
          }`}
        >
          <Icon
            name={t.type === "success" ? "checkCircle" : "alert"}
            className="mt-0.5 h-4 w-4 shrink-0"
          />
          <p className="flex-1 font-medium">{t.message}</p>
          <button
            type="button"
            onClick={() => onDismiss(t.id)}
            aria-label="Dismiss notification"
            className="rounded-md p-0.5 text-stone-400 transition hover:text-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
          >
            <Icon name="x" className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
}

/* ------------------------------ confirm dialog ------------------------- */

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  loading = false,
  error = "",
  onConfirm,
  onCancel,
}) {
  const uid = useId();
  const titleId = `${uid}-title`;
  const descId = `${uid}-desc`;
  const panelRef = useRef(null);
  const cancelRef = useRef(null);

  // Latest values for the keyboard handler without re-running the focus effect.
  const latest = useRef({ loading, onCancel });
  latest.current = { loading, onCancel };

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        if (!latest.current.loading) {
          event.stopPropagation();
          latest.current.onCancel?.();
        }
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus();
      }
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  const danger = tone === "danger";

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#2b1810]/50 backdrop-blur-[2px]"
        onClick={() => {
          if (!loading) onCancel?.();
        }}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              danger ? "bg-red-50 text-red-700" : "bg-[#f6ebe6] text-[#7a1f2b]"
            }`}
          >
            <Icon name={danger ? "alert" : "shield"} className="h-5 w-5" />
          </span>
          <div>
            <h3 id={titleId} className="text-xl text-[#2b1810]" style={HEADING_FONT}>
              {title}
            </h3>
            <p id={descId} className="mt-1.5 text-sm leading-relaxed text-stone-600">
              {description}
            </p>
          </div>
        </div>

        {error ? (
          <p role="alert" className="mt-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={loading}
            className={btn(ui.btnSecondary)}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={btn(danger ? ui.btnDanger : ui.btnPrimary)}
          >
            {loading ? <Spinner /> : null}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}