import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// Namespace import so this works whether hooks/useAuth.js uses a default export
// (export default useAuth) or a named export (export const useAuth).
import * as authHook from "../hooks/useAuth.js";
import {
  getProfile,
  getSessions,
  normalizeProfile,
} from "../services/settings.service.js";
import AccountForm from "../components/settings/AccountForm.jsx";
import ChangePasswordForm from "../components/settings/ChangePasswordForm.jsx";
import DangerZone from "../components/settings/DangerZone.jsx";
import ProfileCard from "../components/settings/ProfileCard.jsx";
import SecuritySettings from "../components/settings/SecuritySettings.jsx";
import SessionList from "../components/settings/SessionList.jsx";
import { HEADING_FONT, ToastViewport } from "../components/settings/SettingsUI.jsx";

const useAuth = authHook.default ?? authHook.useAuth ?? (() => ({}));

const TOAST_MS = 4500;

export default function Settings() {
  /* ---- existing authentication (unchanged) ---- */
  const auth = useAuth() || {};
  const authUser = auth.currentUser ?? null;
  const logout = auth.logout;

  /* ---- toasts ---- */
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismissToast = useCallback((id) => {
    const timer = timers.current.get(id);
    if (timer) window.clearTimeout(timer);
    timers.current.delete(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (type, message) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((prev) => [...prev.slice(-2), { id, type, message }]);
      timers.current.set(
        id,
        window.setTimeout(() => dismissToast(id), TOAST_MS)
      );
    },
    [dismissToast]
  );

  useEffect(() => {
    const active = timers.current;
    return () => {
      active.forEach((timer) => window.clearTimeout(timer));
      active.clear();
    };
  }, []);

  /* ---- profile ---- */
  const [profileState, setProfileState] = useState({ status: "loading", data: null, message: "" });

  const loadProfile = useCallback(async () => {
    setProfileState((prev) => ({ ...prev, status: "loading", message: "" }));
    try {
      const data = await getProfile();
      setProfileState({ status: "ready", data, message: "" });
    } catch (err) {
      setProfileState({
        status: err.unavailable ? "unavailable" : "error",
        data: null,
        message: err.message,
      });
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Prefer live API data; fall back to the AuthContext user so the profile card is never empty.
  const profile = useMemo(
    () => profileState.data ?? normalizeProfile(authUser),
    [profileState.data, authUser]
  );

  const handleProfileSaved = useCallback(
    (updated) => {
      setProfileState({ status: "ready", data: updated, message: "" });
      // Keep the header in sync if AuthContext exposes a refresh/update function.
      if (typeof auth.refreshUser === "function") auth.refreshUser();
      else if (typeof auth.updateUser === "function") auth.updateUser(updated);
    },
    [auth]
  );

  /* ---- sessions ---- */
  const [sessions, setSessions] = useState({ status: "loading", items: [], message: "" });

  const loadSessions = useCallback(async () => {
    setSessions((prev) => ({ ...prev, status: "loading", message: "" }));
    try {
      const items = await getSessions();
      setSessions({ status: "ready", items, message: "" });
    } catch (err) {
      setSessions({
        status: err.unavailable ? "unavailable" : "error",
        items: [],
        message: err.message,
      });
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-4xl font-medium text-[#2b1810]" style={HEADING_FONT}>
          Settings
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Manage your administrator account and security settings.
        </p>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-6">
          <ProfileCard
            profile={profile}
            status={profileState.status}
            message={profileState.message}
            onRetry={loadProfile}
          />
        </div>

        <div className="min-w-0 space-y-6">
          <AccountForm
            profile={profile}
            status={profileState.status}
            message={profileState.message}
            onRetry={loadProfile}
            onSaved={handleProfileSaved}
            notify={notify}
          />
          <ChangePasswordForm notify={notify} />
          <SecuritySettings
            profile={profile}
            sessions={sessions}
            onReload={loadSessions}
            notify={notify}
          />
          <SessionList sessions={sessions} onReload={loadSessions} notify={notify} />
          <DangerZone onLoggedOut={logout} notify={notify} />
        </div>
      </div>

      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}