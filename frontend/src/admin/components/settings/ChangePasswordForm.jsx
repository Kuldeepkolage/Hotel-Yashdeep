import { useState } from "react";
import { changePassword } from "../../services/settings.service.js";
import { Field, Icon, Notice, SectionCard, Spinner, btn, inputClass, ui } from "./SettingsUI.jsx";

const MIN_LENGTH = 8;
const MAX_LENGTH = 128;

const EMPTY = { currentPassword: "", newPassword: "", confirmPassword: "" };
const HIDDEN = { currentPassword: false, newPassword: false, confirmPassword: false };

/**
 * Passwords live only in this component's React state. They are never logged,
 * never written to localStorage / sessionStorage, and are wiped after a
 * successful change.
 */
export default function ChangePasswordForm({ notify }) {
  const [values, setValues] = useState(EMPTY);
  const [visible, setVisible] = useState(HIDDEN);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [done, setDone] = useState(false);

  const validateField = (field, current) => {
    const value = current[field];
    if (field === "currentPassword") {
      if (!value) return "Enter your current password.";
    }
    if (field === "newPassword") {
      if (!value) return "Enter a new password.";
      if (value.length < MIN_LENGTH) return `Use at least ${MIN_LENGTH} characters.`;
      if (value.length > MAX_LENGTH) return `Use ${MAX_LENGTH} characters or fewer.`;
      if (current.currentPassword && value === current.currentPassword) {
        return "New password must be different from your current password.";
      }
    }
    if (field === "confirmPassword") {
      if (!value) return "Confirm your new password.";
      if (value !== current.newPassword) return "Passwords do not match.";
    }
    return "";
  };

  const fields = ["currentPassword", "newPassword", "confirmPassword"];

  const validateAll = (current) => {
    const next = {};
    fields.forEach((field) => {
      const error = validateField(field, current);
      if (error) next[field] = error;
    });
    return next;
  };

  const handleChange = (field) => (event) => {
    const next = { ...values, [field]: event.target.value };
    setValues(next);
    setFormError("");
    setDone(false);

    // Re-check fields that already show an error (and the confirm field, which depends on the new one).
    setErrors((prev) => {
      const updated = { ...prev };
      fields.forEach((name) => {
        if (prev[name] || (name === "confirmPassword" && field === "newPassword" && next.confirmPassword)) {
          const error = validateField(name, next);
          if (error) updated[name] = error;
          else delete updated[name];
        }
      });
      return updated;
    });
  };

  const handleBlur = (field) => () => {
    if (!values[field]) return;
    const error = validateField(field, values);
    setErrors((prev) => {
      const updated = { ...prev };
      if (error) updated[field] = error;
      else delete updated[field];
      return updated;
    });
  };

  const toggle = (field) => setVisible((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving) return;

    const nextErrors = validateAll(values);
    setErrors(nextErrors);
    const firstInvalid = fields.find((field) => nextErrors[field]);
    if (firstInvalid) {
      document.getElementById(`password-${firstInvalid}`)?.focus();
      return;
    }

    setSaving(true);
    setFormError("");
    setDone(false);
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      setValues(EMPTY);
      setVisible(HIDDEN);
      setErrors({});
      setDone(true);
      notify?.("success", "Password changed successfully.");
    } catch (err) {
      setFormError(
        err.unavailable
          ? "Password changes are not available yet. The server has no change-password endpoint."
          : err.message
      );
    } finally {
      setSaving(false);
    }
  };

  const renderPasswordField = ({ field, label, autoComplete, hint }) => {
    const id = `password-${field}`;
    const describedBy = errors[field] ? `${id}-error` : hint ? `${id}-hint` : undefined;

    return (
      <Field id={id} label={label} error={errors[field]} hint={hint}>
        <div className="relative">
          <input
            id={id}
            name={field}
            type={visible[field] ? "text" : "password"}
            value={values[field]}
            onChange={handleChange(field)}
            onBlur={handleBlur(field)}
            disabled={saving}
            autoComplete={autoComplete}
            spellCheck={false}
            aria-invalid={errors[field] ? "true" : "false"}
            aria-describedby={describedBy}
            className={inputClass(Boolean(errors[field]), "pr-11")}
          />
          <button
            type="button"
            onClick={() => toggle(field)}
            disabled={saving}
            aria-label={`${visible[field] ? "Hide" : "Show"} ${label.toLowerCase()}`}
            aria-pressed={visible[field]}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-stone-400 transition hover:text-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2b1810]/40 disabled:cursor-not-allowed"
          >
            <Icon name={visible[field] ? "eyeOff" : "eye"} />
          </button>
        </div>
      </Field>
    );
  };

  return (
    <SectionCard
      id="settings-password"
      icon="key"
      title="Change password"
      description="Choose a strong password that you don't use anywhere else."
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-5">
          {formError ? <Notice tone="error">{formError}</Notice> : null}
          {done ? <Notice tone="success">Your password has been updated.</Notice> : null}

          <div className="max-w-md">
            {renderPasswordField({
              field: "currentPassword",
              label: "Current password",
              autoComplete: "current-password",
            })}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {renderPasswordField({
              field: "newPassword",
              label: "New password",
              autoComplete: "new-password",
              hint: `At least ${MIN_LENGTH} characters.`,
            })}
            {renderPasswordField({
              field: "confirmPassword",
              label: "Confirm new password",
              autoComplete: "new-password",
            })}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button type="submit" disabled={saving} className={btn(ui.btnPrimary)}>
            {saving ? <Spinner /> : null}
            {saving ? "Updating…" : "Update password"}
          </button>
        </div>
      </form>
    </SectionCard>
  );
}