import { useState } from "react";
import { revokeSession } from "../../services/settings.service.js";
import {
  ConfirmDialog,
  Icon,
  Notice,
  SectionCard,
  Skeleton,
  Spinner,
  btnSmall,
  formatDateTime,
  orNA,
  ui,
} from "./SettingsUI.jsx";

/**
 * Lists active sessions returned by the backend. No records are ever
 * fabricated: if the sessions endpoint is missing, the card says so.
 *
 * Props
 *  - sessions : { status: "loading" | "ready" | "unavailable" | "error", items: [], message }
 *  - onReload : refetches sessions
 *  - notify   : toast helper
 */
export default function SessionList({ sessions, onReload, notify }) {
  const [target, setTarget] = useState(null);
  const [revoking, setRevoking] = useState(false);
  const [dialogError, setDialogError] = useState("");

  const closeDialog = () => {
    if (revoking) return;
    setTarget(null);
    setDialogError("");
  };

  const confirmRevoke = async () => {
    if (!target?.id) return;
    setRevoking(true);
    setDialogError("");
    try {
      await revokeSession(target.id);
      notify?.("success", "Session signed out.");
      setTarget(null);
      onReload?.();
    } catch (err) {
      setDialogError(
        err.unavailable
          ? "Signing out a single session is not available yet. The server has no session endpoint."
          : err.message
      );
    } finally {
      setRevoking(false);
    }
  };

  const refreshButton = (
    <button
      type="button"
      onClick={onReload}
      disabled={sessions.status === "loading"}
      className={btnSmall(ui.btnSecondary)}
    >
      {sessions.status === "loading" ? <Spinner className="h-3.5 w-3.5" /> : <Icon name="refresh" className="h-3.5 w-3.5" />}
      Refresh
    </button>
  );

  let body;
  if (sessions.status === "loading") {
    body = (
      <ul className="space-y-3" aria-busy="true" aria-label="Loading sessions">
        {[0, 1].map((i) => (
          <li key={i} className="flex items-center gap-4 rounded-xl border border-stone-100 p-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-3 w-64 max-w-full" />
            </div>
          </li>
        ))}
      </ul>
    );
  } else if (sessions.status === "unavailable") {
    body = (
      <Notice tone="info" icon="monitor">
        Session management is not available.
      </Notice>
    );
  } else if (sessions.status === "error") {
    body = (
      <Notice
        tone="error"
        action={
          <button type="button" onClick={onReload} className={btnSmall(ui.btnSecondary)}>
            Retry
          </button>
        }
      >
        {sessions.message || "Could not load your sessions."}
      </Notice>
    );
  } else if (!sessions.items.length) {
    body = (
      <div className="flex flex-col items-center px-4 py-8 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-50 text-stone-400">
          <Icon name="monitor" className="h-5 w-5" />
        </span>
        <p className="mt-3 text-sm font-semibold text-stone-800">No active sessions reported</p>
        <p className="mt-1 text-sm text-stone-500">The server did not return any sessions for your account.</p>
      </div>
    );
  } else {
    body = (
      <ul className="space-y-3">
        {sessions.items.map((session, index) => {
          const meta = [
            session.ip ? `IP ${session.ip}` : null,
            session.location || null,
            `Last active ${formatDateTime(session.lastActive)}`,
          ].filter(Boolean);

          return (
            <li
              key={session.id ?? index}
              className="flex flex-col gap-3 rounded-xl border border-stone-100 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-50 text-stone-500">
                  <Icon name="monitor" className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="break-words text-sm font-semibold text-stone-800">
                      {orNA(session.device)}
                    </p>
                    {session.current ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                        Current session
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 break-words text-xs text-stone-500">{meta.join(" · ")}</p>
                </div>
              </div>

              {!session.current && session.id ? (
                <button
                  type="button"
                  onClick={() => setTarget(session)}
                  className={btnSmall(ui.btnDangerOutline, "shrink-0")}
                >
                  <Icon name="logout" className="h-3.5 w-3.5" />
                  Sign out
                </button>
              ) : null}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <>
      <SectionCard
        id="settings-sessions"
        icon="monitor"
        title="Active sessions"
        description="Devices currently signed in to this administrator account."
        action={sessions.status === "unavailable" ? null : refreshButton}
      >
        {body}
      </SectionCard>

      <ConfirmDialog
        open={Boolean(target)}
        title="Sign out this session?"
        description={`${orNA(target?.device)} will be signed out and will need to log in again.`}
        confirmLabel="Sign out session"
        loading={revoking}
        error={dialogError}
        onConfirm={confirmRevoke}
        onCancel={closeDialog}
      />
    </>
  );
}