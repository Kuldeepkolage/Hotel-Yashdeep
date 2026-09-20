import { useEffect, useMemo, useState } from "react";
import { mergeDefined, updateProfile } from "../../services/settings.service.js";
import SaveBar from "./SaveBar.jsx";
import { Field, Notice, SectionCard, Skeleton, btnSmall, inputClass, ui } from "./SettingsUI.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Edits the admin's own profile.
 *
 * Only fields the backend actually returned are editable / submitted:
 *  - name and email are always included
 *  - phone is included ONLY when the profile response contains a `phone` key
 *
 * Props
 *  - profile, status, message, onRetry : same as ProfileCard
 *  - onSaved(updatedProfile)           : parent state update after a successful save
 *  - notify(type, message)             : toast helper from Settings.jsx
 */
export default function AccountForm({ profile, status, message, onRetry, onSaved, notify }) {
  const showPhone = profile?.phone !== undefined;

  const initial = useMemo(
    () => ({
      name: profile?.name ?? "",
      email: profile?.email ?? "",
      phone: showPhone && profile?.phone != null ? String(profile.phone) : "",
    }),
    [profile?.name, profile?.email, profile?.phone, showPhone]
  );

  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Re-sync when the saved profile changes (first load, retry, or after saving).
  useEffect(() => {
    setValues(initial);
    setErrors({});
  }, [initial]);

  const dirty =
    values.name.trim() !== initial.name.trim() ||
    values.email.trim() !== initial.email.trim() ||
    (showPhone && values.phone.trim() !== initial.phone.trim());

  // Warn before closing / reloading the tab with unsaved edits.
  useEffect(() => {
    if (!dirty) return undefined;
    const handler = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const validateField = (field, raw) => {
    const value = String(raw ?? "").trim();
    if (field === "name") {
      if (!value) return "Name is required.";
      if (value.length < 2) return "Name must be at least 2 characters.";
      if (value.length > 80) return "Name must be 80 characters or fewer.";
    }
    if (field === "email") {
      if (!value) return "Email is required.";
      if (!EMAIL_RE.test(value)) return "Enter a valid email address.";
    }
    if (field === "phone" && value) {
      const digits = value.replace(/\D/g, "");
      if (!/^[+\d\s()-]+$/.test(value) || digits.length < 7 || digits.length > 15) {
        return "Enter a valid phone number (7–15 digits).";
      }
    }
    return "";
  };

  const fields = showPhone ? ["name", "email", "phone"] : ["name", "email"];

  const validateAll = (current) => {
    const next = {};
    fields.forEach((field) => {
      const error = validateField(field, current[field]);
      if (error) next[field] = error;
    });
    return next;
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setValues((prev) => ({ ...prev, [field]: value }));
    setFormError("");
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
  };

  const handleBlur = (field) => () => {
    setErrors((prev) => ({ ...prev, [field]: validateField(field, values[field]) }));
  };

  const handleDiscard = () => {
    setValues(initial);
    setErrors({});
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving || !dirty) return;

    const nextErrors = validateAll(values);
    setErrors(nextErrors);
    const firstInvalid = fields.find((field) => nextErrors[field]);
    if (firstInvalid) {
      document.getElementById(`account-${firstInvalid}`)?.focus();
      return;
    }

    // Only supported fields are ever sent.
    const payload = { name: values.name.trim(), email: values.email.trim() };
    if (showPhone) payload.phone = values.phone.trim();

    setSaving(true);
    setFormError("");
    try {
      const updated = await updateProfile(payload);
      onSaved?.(mergeDefined(mergeDefined(profile, payload), updated));
      notify?.("success", "Profile updated.");
    } catch (err) {
      setFormError(
        err.unavailable
          ? "Profile updates are not available yet. The server has no profile update endpoint."
          : err.message
      );
    } finally {
      setSaving(false);
    }
  };

  const inputProps = (field, extra = {}) => ({
    id: `account-${field}`,
    name: field,
    value: values[field],
    onChange: handleChange(field),
    onBlur: handleBlur(field),
    disabled: saving,
    "aria-invalid": errors[field] ? "true" : "false",
    "aria-describedby": errors[field] ? `account-${field}-error` : undefined,
    className: inputClass(Boolean(errors[field])),
    ...extra,
  });

  let body;
  if (status === "loading") {
    body = (
      <div className="grid gap-5 sm:grid-cols-2" aria-busy="true" aria-label="Loading account form">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  } else if (status === "unavailable") {
    body = <Notice tone="info">Profile editing is not available right now.</Notice>;
  } else if (status === "error") {
    body = (
      <Notice
        tone="error"
        action={
          onRetry ? (
            <button type="button" onClick={onRetry} className={btnSmall(ui.btnSecondary)}>
              Retry
            </button>
          ) : null
        }
      >
        {message || "Could not load your profile."}
      </Notice>
    );
  } else {
    body = (
      <form onSubmit={handleSubmit} noValidate>
        {formError ? (
          <div className="mb-5">
            <Notice tone="error">{formError}</Notice>
          </div>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="account-name" label="Full name" error={errors.name}>
            <input type="text" autoComplete="name" placeholder="Your name" {...inputProps("name")} />
          </Field>

          <Field id="account-email" label="Email address" error={errors.email}>
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...inputProps("email")}
            />
          </Field>

          {showPhone ? (
            <Field id="account-phone" label="Phone" error={errors.phone} hint="Optional.">
              <input
                type="tel"
                autoComplete="tel"
                placeholder="+91 98765 43210"
                {...inputProps("phone")}
              />
            </Field>
          ) : null}
        </div>

        <SaveBar dirty={dirty} saving={saving} onDiscard={handleDiscard} />
      </form>
    );
  }

  return (
    <SectionCard
      id="settings-account"
      icon="user"
      title="Account"
      description="Update the details linked to your administrator account."
    >
      {body}
    </SectionCard>
  );
}