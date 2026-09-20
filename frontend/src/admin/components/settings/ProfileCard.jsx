import {
  HEADING_FONT,
  Icon,
  Notice,
  Skeleton,
  btnSmall,
  formatDate,
  orNA,
  ui,
} from "./SettingsUI.jsx";

/**
 * Read-only summary of the signed-in admin.
 *
 * Props
 *  - profile : normalized profile (fetched from the API, or the AuthContext user as a fallback)
 *  - status  : "loading" | "ready" | "unavailable" | "error"
 *  - message : error text for the "error" state
 *  - onRetry : reload handler
 */
export default function ProfileCard({ profile, status, message, onRetry }) {
  const loading = status === "loading" && !profile;
  const failed = !profile && (status === "error" || status === "unavailable");
  const fromSessionOnly = Boolean(profile) && (status === "unavailable" || status === "error");

  const name = profile?.name?.trim();
  const initial = name ? name.charAt(0).toUpperCase() : "";

  const rows = [
    { key: "email", icon: "mail", label: "Email", value: orNA(profile?.email) },
    { key: "phone", icon: "phone", label: "Phone", value: orNA(profile?.phone) },
    { key: "role", icon: "shield", label: "Role", value: orNA(profile?.role) },
    { key: "created", icon: "calendar", label: "Account created", value: formatDate(profile?.createdAt) },
  ];

  return (
    <section
      id="settings-profile"
      aria-labelledby="settings-profile-heading"
      className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_1px_2px_rgba(43,24,16,0.04)]"
    >
      <div className="bg-[#2b1810] px-6 py-7 text-center">
        <div
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#c9922b]/60 bg-[#f6ebe6] text-3xl text-[#7a1f2b]"
          style={HEADING_FONT}
          aria-hidden="true"
        >
          {initial || <Icon name="user" className="h-8 w-8" />}
        </div>

        {loading ? (
          <div className="mx-auto mt-4 flex max-w-[12rem] flex-col items-center gap-2">
            <Skeleton className="h-6 w-full bg-white/10" />
            <Skeleton className="h-3 w-24 bg-white/10" />
          </div>
        ) : (
          <>
            <h2
              id="settings-profile-heading"
              className="mt-4 break-words text-2xl text-white"
              style={HEADING_FONT}
            >
              {orNA(profile?.name)}
            </h2>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#c9922b]">
              {orNA(profile?.role)}
            </p>
          </>
        )}
      </div>

      <div className="px-5 py-5 sm:px-6">
        {loading ? (
          <div className="space-y-5" aria-busy="true" aria-label="Loading profile">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        ) : failed ? (
          <Notice
            tone={status === "unavailable" ? "info" : "error"}
            action={
              status === "error" && onRetry ? (
                <button type="button" onClick={onRetry} className={btnSmall(ui.btnSecondary)}>
                  Retry
                </button>
              ) : null
            }
          >
            {status === "unavailable"
              ? "Profile details are not available right now."
              : message || "Could not load your profile."}
          </Notice>
        ) : (
          <>
            <dl className="space-y-4">
              {rows.map((row) => (
                <div key={row.key} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-50 text-stone-500">
                    <Icon name={row.icon} className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <dt className={ui.label}>{row.label}</dt>
                    <dd
                      className={`mt-1 break-words text-sm ${
                        row.value === "N/A" ? "text-stone-400" : "text-stone-800"
                      }`}
                    >
                      {row.value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            {fromSessionOnly ? (
              <p className="mt-5 border-t border-stone-100 pt-4 text-xs text-stone-500">
                Showing details from your current session. Live profile data could not be loaded.
              </p>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}