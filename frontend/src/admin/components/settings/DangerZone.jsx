import { useState } from "react";
import { logoutAllDevices } from "../../services/settings.service.js";
import { ConfirmDialog, Icon, SectionCard, btn, ui } from "./SettingsUI.jsx";

/**
 * "Logout from all devices". Account deletion is intentionally NOT included
 * because no delete-account endpoint is part of the current backend contract.
 *
 * Props
 *  - onLoggedOut : the EXISTING logout function from AuthContext. It is called
 *                  after the server confirms, so this browser is signed out
 *                  through the app's normal flow (token clearing, redirect).
 *  - notify      : toast helper
 */
export default function DangerZone({ onLoggedOut, notify }) {
  const [open, setOpen] = useState(false);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  const close = () => {
    if (working) return;
    setOpen(false);
    setError("");
  };

  const confirm = async () => {
    setWorking(true);
    setError("");
    try {
      await logoutAllDevices();
    } catch (err) {
      setWorking(false);
      setError(
        err.unavailable
          ? "Logging out of all devices is not available yet. The server has no logout-all endpoint."
          : err.message
      );
      return;
    }

    setWorking(false);
    setOpen(false);
    notify?.("success", "You have been signed out of all devices.");

    if (typeof onLoggedOut === "function") {
      try {
        await onLoggedOut();
      } catch {
        /* the server-side sign-out already succeeded; ProtectedRoute handles the rest */
      }
    }
  };

  return (
    <>
      <SectionCard
        id="settings-danger"
        icon="alert"
        tone="danger"
        title="Danger zone"
        description="Actions here affect every device signed in to your account."
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-stone-800">Logout from all devices</h3>
            <p className="mt-1 max-w-xl text-sm text-stone-500">
              Ends every active session, including this one. You will need to sign in again everywhere.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={btn(ui.btnDangerOutline, "shrink-0")}
          >
            <Icon name="logout" />
            Logout from all devices
          </button>
        </div>
      </SectionCard>

      <ConfirmDialog
        open={open}
        title="Logout from all devices?"
        description="Every device signed in to this account, including this one, will be signed out. You'll need to log in again."
        confirmLabel="Logout everywhere"
        loading={working}
        error={error}
        onConfirm={confirm}
        onCancel={close}
      />
    </>
  );
}