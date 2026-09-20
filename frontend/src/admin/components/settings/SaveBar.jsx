import { Spinner, btn, ui } from "./SettingsUI.jsx";

/**
 * Sticky footer for a form. Render it INSIDE the <form> so the Save button
 * (type="submit") submits it.
 *
 * Props
 *  - dirty     : whether there are unsaved changes
 *  - saving    : request in flight
 *  - onDiscard : resets the form to its last saved values
 */
export default function SaveBar({ dirty, saving, onDiscard, saveLabel = "Save changes" }) {
  return (
    <div className="sticky bottom-4 z-10 mt-6">
      <div
        className={`flex flex-col gap-3 rounded-2xl border px-4 py-3 shadow-md transition sm:flex-row sm:items-center sm:justify-between ${
          dirty ? "border-amber-200 bg-amber-50" : "border-stone-200 bg-stone-50"
        }`}
      >
        <p
          className={`text-sm font-medium ${dirty ? "text-amber-800" : "text-stone-500"}`}
          role="status"
          aria-live="polite"
        >
          {dirty ? "You have unsaved changes." : "No unsaved changes."}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDiscard}
            disabled={!dirty || saving}
            className={btn(ui.btnSecondary)}
          >
            Discard
          </button>
          <button type="submit" disabled={!dirty || saving} className={btn(ui.btnPrimary)}>
            {saving ? <Spinner /> : null}
            {saving ? "Saving…" : saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}