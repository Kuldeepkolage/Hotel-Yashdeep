import { Search, LayoutGrid, List, UploadCloud, ChevronDown } from "lucide-react";
import { SORT_OPTIONS } from "./uploads.config";
import UploadFilters from "./UploadFilters";

export default function UploadToolbar({
  search, onSearch, type, onType, sort, onSort, view, onView, onUploadClick, resultCount,
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative block w-full lg:max-w-sm">
          <span className="sr-only">Search uploads</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search files..."
            className="h-11 w-full rounded-lg border border-[#e6dccd] bg-white pl-10 pr-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#2b1810]/50 focus:ring-2 focus:ring-[#2b1810]/10"
          />
        </label>

        <label className="relative block w-full sm:w-48">
          <span className="sr-only">Sort uploads</span>
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value)}
            className="h-11 w-full appearance-none rounded-lg border border-[#e6dccd] bg-white pl-3 pr-9 text-sm text-gray-800 outline-none focus:border-[#2b1810]/50 focus:ring-2 focus:ring-[#2b1810]/10"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        </label>

        <div className="flex items-center gap-3 lg:ml-auto">
          <div role="group" aria-label="View mode" className="flex overflow-hidden rounded-lg border border-[#e6dccd] bg-white">
            {[
              { v: "grid", Icon: LayoutGrid, label: "Grid view" },
              { v: "list", Icon: List, label: "List view" },
            ].map(({ v, Icon, label }) => (
              <button
                key={v}
                type="button"
                aria-label={label}
                aria-pressed={view === v}
                onClick={() => onView(v)}
                className={`flex h-11 w-11 items-center justify-center transition ${
                  view === v ? "bg-[#2b1810] text-white" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onUploadClick}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#2b1810] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3d2418]"
          >
            <UploadCloud className="h-4 w-4" /> Upload
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <UploadFilters value={type} onChange={onType} />
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
          {resultCount} {resultCount === 1 ? "result" : "results"}
        </p>
      </div>
    </div>
  );
}
