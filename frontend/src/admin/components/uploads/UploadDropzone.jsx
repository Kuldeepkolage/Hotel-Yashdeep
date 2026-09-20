import { useCallback, useRef, useState } from "react";
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";

import { uploadFile } from "../../services/uploads.service";
import {
  ACCEPT_ATTRIBUTE,
  ACCEPTED_MIME_TYPES,
  UPLOAD_CONFIG,
} from "./uploads.config";
import {
  formatBytes,
  getErrorMessage,
  validateFile,
} from "./uploads.utils";

let counter = 0;

export default function UploadDropzone({
  onUploaded,
  onNotify,
  onClose,
}) {
  const inputRef = useRef(null);

  const [dragging, setDragging] = useState(false);
  const [queue, setQueue] = useState([]);

  const busy = queue.some(
    (q) => q.status === "uploading" || q.status === "pending"
  );

  const patch = useCallback((id, changes) => {
    setQueue((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, ...changes } : q
      )
    );
  }, []);

  const handleFiles = useCallback(
    async (fileList) => {
      const files = Array.from(fileList || []);

      if (!files.length) return;

      // Validate every selected file first
      const entries = files.map((file) => {
        const error = validateFile(
          file,
          ACCEPTED_MIME_TYPES
        );

        return {
          id: `u${++counter}`,
          file,
          progress: 0,
          status: error ? "error" : "pending",
          error,
          uploaded: null,
        };
      });

      setQueue((prev) => [...entries, ...prev]);

      let success = 0;

      let failed = entries.filter(
        (entry) => entry.status === "error"
      ).length;

      // Store the actual API responses here.
      // These are later sent to Uploads.jsx.
      const uploadedItems = [];

      // Upload valid files one by one
      for (
        const entry of entries.filter(
          (entry) => entry.status === "pending"
        )
      ) {
        patch(entry.id, {
          status: "uploading",
          progress: 0,
        });

        try {
          const uploaded = await uploadFile(
            entry.file,
            {
              onProgress: (progress) => {
                patch(entry.id, {
                  progress,
                });
              },
            }
          );

          if (uploaded) {
            uploadedItems.push(uploaded);
          }

          patch(entry.id, {
            status: "success",
            progress: 100,
            uploaded: uploaded || null,
          });

          success += 1;
        } catch (error) {
          patch(entry.id, {
            status: "error",
            error: getErrorMessage(
              error,
              "Upload failed."
            ),
          });

          failed += 1;
        }
      }

      // Notify successful uploads once
      if (success > 0) {
        onNotify?.(
          "success",
          `${success} file${
            success > 1 ? "s" : ""
          } uploaded successfully.`
        );

        // Send the actual uploaded API objects
        // back to the parent component.
        onUploaded?.(uploadedItems);
      }

      // Notify failed uploads once
      if (failed > 0) {
        onNotify?.(
          "error",
          `${failed} file${
            failed > 1 ? "s" : ""
          } could not be uploaded.`
        );
      }
    },
    [onNotify, onUploaded, patch]
  );

  const onDrop = (event) => {
    event.preventDefault();

    setDragging(false);

    if (!busy) {
      handleFiles(event.dataTransfer.files);
    }
  };

  const clearFinished = () => {
    setQueue((prev) =>
      prev.filter(
        (q) =>
          q.status === "uploading" ||
          q.status === "pending"
      )
    );
  };

  return (
    <section
      aria-label="Upload files"
      className="rounded-xl border border-[#eee6da] bg-white p-5 shadow-sm"
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#2b1810]">
          Upload media
        </h2>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close upload panel"
          className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Dropzone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Drop images here or press Enter to browse"
        onClick={() =>
          !busy && inputRef.current?.click()
        }
        onKeyDown={(event) => {
          if (
            (event.key === "Enter" ||
              event.key === " ") &&
            !busy
          ) {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!busy) {
            setDragging(true);
          }
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
          dragging
            ? "border-[#2b1810] bg-[#f8f4ee]"
            : "border-[#dccfbb] bg-[#fbf8f3] hover:border-[#2b1810]/50"
        } ${
          busy
            ? "cursor-not-allowed opacity-70"
            : ""
        }`}
      >
        {/* Upload Icon */}
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
          <UploadCloud className="h-6 w-6 text-[#2b1810]" />
        </div>

        {/* Main Text */}
        <p className="text-sm font-medium text-[#2b1810]">
          Drag &amp; drop images here, or{" "}
          <span className="underline">
            browse
          </span>
        </p>

        {/* Backend-compatible formats */}
        <p className="mt-1 text-xs text-gray-500">
          JPG, PNG and WebP images · up to{" "}
          {UPLOAD_CONFIG.maxFileSizeMB} MB each ·
          multiple files allowed
        </p>

        {/* Hidden File Input */}
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT_ATTRIBUTE}
          className="hidden"
          onChange={(event) => {
            handleFiles(event.target.files);

            // Allow selecting the same file again
            event.target.value = "";
          }}
        />
      </div>

      {/* Upload Queue */}
      {queue.length > 0 && (
        <div className="mt-4">
          <ul
            className="space-y-2"
            aria-live="polite"
          >
            {queue.map((q) => (
              <li
                key={q.id}
                className="rounded-lg border border-[#eee6da] px-3 py-2.5"
              >
                <div className="flex items-center gap-3">
                  {/* Status Icon */}
                  {q.status === "success" && (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  )}

                  {q.status === "error" && (
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                  )}

                  {(q.status === "uploading" ||
                    q.status === "pending") && (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#2b1810]" />
                  )}

                  {/* File Information */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-gray-800">
                      {q.file.name}
                    </p>

                    <p
                      className={`text-xs ${
                        q.status === "error"
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {q.status === "error" &&
                        q.error}

                      {q.status === "success" &&
                        `Uploaded · ${formatBytes(
                          q.file.size
                        )}`}

                      {q.status === "pending" &&
                        "Waiting..."}

                      {q.status === "uploading" &&
                        `Uploading ${q.progress}%`}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                {q.status === "uploading" && (
                  <div
                    className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#f1eadf]"
                    role="progressbar"
                    aria-valuenow={q.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="h-full rounded-full bg-[#2b1810] transition-all"
                      style={{
                        width: `${q.progress}%`,
                      }}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Clear Completed Uploads */}
          {!busy && (
            <button
              type="button"
              onClick={clearFinished}
              className="mt-3 text-xs font-medium text-gray-600 underline hover:text-gray-900"
            >
              Clear list
            </button>
          )}
        </div>
      )}
    </section>
  );
}