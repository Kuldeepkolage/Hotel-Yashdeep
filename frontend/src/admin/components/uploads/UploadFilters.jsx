import { TYPE_FILTERS } from "./uploads.config";

export default function UploadFilters({ value, onChange }) {
  return (
    <div role="group" aria-label="Filter by file type" className="flex flex-wrap gap-2">
      {TYPE_FILTERS.map((f) => {
        const active = value === f.value;
        return (
          <button
            key={f.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(f.value)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              active
                ? "border-[#2b1810] bg-[#2b1810] text-white"
                : "border-[#e6dccd] bg-white text-gray-700 hover:border-[#2b1810]/40"
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
