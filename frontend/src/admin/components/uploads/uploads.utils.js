import { UPLOAD_CONFIG } from "./uploads.config";

export const HEADING_FONT = { fontFamily: '"Playfair Display", Georgia, serif' };

export function formatBytes(bytes) {
  const n = Number(bytes);
  if (!n || n < 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(Math.floor(Math.log(n) / Math.log(1024)), units.length - 1);
  const v = n / Math.pow(1024, i);
  return `${v >= 10 || i === 0 ? Math.round(v) : v.toFixed(1)} ${units[i]}`;
}

export function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

const EXT_KIND = {
  jpg: "image", jpeg: "image", png: "image", webp: "image", gif: "image", avif: "image", svg: "image",
  mp4: "video", webm: "video", mov: "video",
  pdf: "document", doc: "document", docx: "document", txt: "document",
};

export function getKind(item) {
  const mime = (item?.mimeType || "").toLowerCase();
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("application/") || mime.startsWith("text/")) return "document";
  const ext = (item?.name || "").split(".").pop().toLowerCase();
  return EXT_KIND[ext] || "document";
}

export function getTypeLabel(item) {
  const ext = (item?.name || "").includes(".") ? item.name.split(".").pop().toUpperCase() : "";
  if (ext) return ext;
  const mime = item?.mimeType || "";
  return mime.split("/")[1]?.toUpperCase() || "FILE";
}

export function validateFile(file, accepted) {
  if (!accepted.includes(file.type)) {
    return `"${file.name}" is not a supported file type.`;
  }
  const max = UPLOAD_CONFIG.maxFileSizeMB * 1024 * 1024;
  if (file.size > max) {
    return `"${file.name}" is larger than ${UPLOAD_CONFIG.maxFileSizeMB} MB.`;
  }
  if (file.size === 0) return `"${file.name}" is empty.`;
  return null;
}

export function getErrorMessage(err, fallback = "Something went wrong. Please try again.") {
  return err?.response?.data?.message || err?.response?.data?.error || err?.message || fallback;
}
