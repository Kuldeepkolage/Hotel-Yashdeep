import { useEffect } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

function Toast({ toast, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  const ok = toast.type === "success";
  return (
    <div
      role="status"
      className={`flex items-start gap-3 rounded-xl border bg-white px-4 py-3 shadow-lg ${
        ok ? "border-emerald-200" : "border-red-200"
      }`}
    >
      {ok ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
      ) : (
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
      )}
      <p className="text-sm text-[#2b1810]">{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="ml-auto text-gray-400 hover:text-gray-700"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function UploadToast({ toasts, onDismiss }) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[70] flex w-[min(92vw,22rem)] flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <Toast toast={t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}
