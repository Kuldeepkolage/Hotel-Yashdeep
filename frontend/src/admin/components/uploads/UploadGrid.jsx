import UploadCard, { ActionsMenu, UploadThumb } from "./UploadCard";
import { formatBytes, formatDate, getTypeLabel } from "./uploads.utils";

export default function UploadGrid({ items, view, onPreview, onDelete }) {
  if (view === "list") {
    return (
      <div className="overflow-hidden rounded-xl border border-[#eee6da] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-[#eee6da] bg-[#fbf8f3] text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                <th scope="col" className="px-4 py-3">File</th>
                <th scope="col" className="px-4 py-3">Type</th>
                <th scope="col" className="px-4 py-3">Size</th>
                <th scope="col" className="px-4 py-3">Uploaded</th>
                <th scope="col" className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-[#f3ede3] last:border-0 hover:bg-[#fbf8f3]">
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => onPreview(item)} className="flex items-center gap-3 text-left">
                      <span className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-[#f4eee4]">
                        <UploadThumb item={item} />
                      </span>
                      <span className="max-w-[16rem] truncate text-sm font-medium text-[#2b1810]" title={item.name}>{item.name}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600">{getTypeLabel(item)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatBytes(item.size)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(item.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <ActionsMenu label={item.name} onPreview={() => onPreview(item)} onDelete={() => onDelete(item)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <UploadCard key={item.id} item={item} onPreview={onPreview} onDelete={onDelete} />
      ))}
    </div>
  );
}
