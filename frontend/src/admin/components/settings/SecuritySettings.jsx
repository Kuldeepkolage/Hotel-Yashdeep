import { useMemo, useState } from "react";
import { revokeSession } from "../../services/settings.service.js";
import {
  ConfirmDialog,
  Icon,
  SectionCard,
  btn,
  describeThisDevice,
  formatDateTime,
  orNA,
  ui,
} from "./SettingsUI.jsx";

/**
 * Security overview. Every value shown is either read from the profile /
 * sessions responses or from the browser the admin is using right now.
 *
 * Props
 *  - profile  : normalized profile (or null)
 *  - sessions : same state object SessionList receives
 *  - onReload : refetches sessions
 *  - notify   : toast helper
 */
export default function SecuritySettings({ profile, sessions, onReload, notify }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [working, setWorking] = useState(false);
  const [dialogError, setDialogError] = useState("");

  const thisDevice = useMemo(() => describeThisDevice(), []);

  const sessionsReady = sessions.status === "ready";
  const otherSessions = sessionsReady
    ? sessions.items.filter((s) => !s.current && s.id)
    : [];
  const canSignOutOthers = sessionsReady && otherSessions.length > 0;

  const activeCount =
    sessions.status === "loading"
      ? "…"
      : sessionsReady
        ? String(sessions.items.length)
        : "N/A";

  const tiles = [
    { key: "device", icon: "monitor", label: "This device", value: thisDevice },
    { key: "account", icon: "user", label: "Signed in as", value: orNA(profile?.email) },
    { key: "last", icon: "clock", label: "Last login", value: formatDateTime(profile?.lastLogin) },
    { key: "active", icon: "shield", label: "Active sessions", value: activeCount },
  ];

  const closeDialog = () => {
    if (working) return;
    setConfirmOpen(false);
    setDialogError("");
  };

  const signOutOthers = async () => {
    setWorking(true);
    setDialogError("");

    const results = await Promise.allSettled(otherSessions.map((s) => revokeSession(s.id)));
    const failed = results.filter((r) => r.status === "rejected");
    const succeeded = results.length - failed.length;

    setWorking(false);

    if (failed.length === 0) {
      notify?.(
        "success",
        `Signed out ${succeeded} other session${succeeded === 1 ? "" : "s"}.`
      );
      setConfirmOpen(false);
      onReload?.();
      return;
    }

    if (succeeded > 0) onReload?.();
    const reason = failed[0].reason;
    setDialogError(
      succeeded > 0
        ? `Signed out ${succeeded}, but ${failed.length} could not be signed out. ${reason?.message || ""}`.trim()
        : reason?.unavailable
          ? "Signing out other sessions is not available yet. The server has no session endpoint."
          : reason?.message || "Could not sign out the other sessions."
    );
  };

  return (
    <>
      <SectionCard
        id="settings-security"
        icon="shield"
        title="Security"
        description="A snapshot of how your account is currently signed in."
      >
        <dl className="grid gap-4 sm:grid-cols-2">
          {tiles.map((tile) => (
            <div key={tile.key} className="flex items-start gap-3 rounded-xl border border-stone-100 p-4">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-50 text-stone-500">
                <Icon name={tile.icon} className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <dt className={ui.label}>{tile.label}</dt>
                <dd
                  className={`mt-1 break-words text-sm ${
                    tile.value === "N/A" ? "text-stone-400" : "text-stone-800"
                  }`}
                >
                  {tile.value}
                </dd>
              </div>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex flex-col gap-3 border-t border-stone-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-stone-500">
            {canSignOutOthers
              ? `${otherSessions.length} other session${otherSessions.length === 1 ? " is" : "s are"} signed in to your account.`
              : sessionsReady
                ? "No other sessions are signed in to your account."
                : "Session controls appear here when session data is available."}
          </p>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={!canSignOutOthers}
            className={btn(ui.btnSecondary, "shrink-0")}
          >
            <Icon name="logout" />
            Sign out other sessions
          </button>
        </div>
      </SectionCard>

      <ConfirmDialog
        open={confirmOpen}
        title="Sign out other sessions?"
        description="Every other device signed in to your account will be signed out. This device stays signed in."
        confirmLabel="Sign out others"
        loading={working}
        error={dialogError}
        onConfirm={signOutOthers}
        onCancel={closeDialog}
      />
    </>
  );
}