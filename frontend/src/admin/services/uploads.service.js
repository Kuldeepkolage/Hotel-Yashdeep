import api from "./api.js";
import { UPLOAD_CONFIG } from "../components/uploads/uploads.config.js";

/**
 * Normalize backend upload response into the format
 * expected by the Uploads UI.
 */
export function normalizeUpload(raw) {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const data = raw.data || raw;

  const url =
    data.url ||
    data.secure_url ||
    data.fileUrl ||
    data.location ||
    "";

  const publicId =
    data.publicId ||
    data.public_id ||
    data.filename ||
    "";

  return {
    id: publicId || url,

    name:
      data.originalName ||
      data.originalname ||
      data.name ||
      data.fileName ||
      (url
        ? url.split("/").pop()
        : "Uploaded image"),

    url,

    mimeType:
      data.mimeType ||
      data.mimetype ||
      data.contentType ||
      "image/*",

    size: Number(
      data.size ||
        data.bytes ||
        0
    ),

    createdAt:
      data.createdAt ||
      data.uploadedAt ||
      new Date().toISOString(),

    publicId,

    raw: data,
  };
}

/**
 * Upload one image.
 *
 * Backend:
 * POST /api/upload
 * field name: image
 */
export async function uploadFile(
  file,
  {
    onProgress,
    signal,
  } = {}
) {
  if (!file) {
    throw new Error("No file selected.");
  }

  const formData = new FormData();

  // IMPORTANT:
  // Backend upload.middleware + upload.controller
  // expects req.file from the "image" field.
  formData.append("image", file);

  const response = await api.post(
    "/upload",
    formData,
    {
      signal,

      // Explicitly tell Axios this is multipart data.
      headers: {
        "Content-Type": "multipart/form-data",
      },

      onUploadProgress: (event) => {
        if (
          !event.total ||
          !onProgress
        ) {
          return;
        }

        const progress = Math.round(
          (event.loaded * 100) /
            event.total
        );

        onProgress(progress);
      },
    }
  );

  const payload =
    response.data?.data ||
    response.data;

  return normalizeUpload(payload);
}

/**
 * Upload multiple images.
 *
 * Backend:
 * POST /api/upload/multiple
 * field name: images
 */
export async function uploadMultipleFiles(
  files,
  {
    onProgress,
    signal,
  } = {}
) {
  const formData = new FormData();

  Array.from(files || []).forEach(
    (file) => {
      formData.append("images", file);
    }
  );

  const response = await api.post(
    "/upload/multiple",
    formData,
    {
      signal,

      headers: {
        "Content-Type": "multipart/form-data",
      },

      onUploadProgress: (event) => {
        if (
          !event.total ||
          !onProgress
        ) {
          return;
        }

        const progress = Math.round(
          (event.loaded * 100) /
            event.total
        );

        onProgress(progress);
      },
    }
  );

  const payload =
    response.data?.data ||
    response.data;

  if (!Array.isArray(payload)) {
    return [];
  }

  return payload
    .map(normalizeUpload)
    .filter(Boolean);
}

/**
 * Upload hero image.
 *
 * Backend:
 * POST /api/upload/hero
 * field name: image
 */
export async function uploadHeroImage(
  file,
  { signal } = {}
) {
  const formData = new FormData();

  formData.append("image", file);

  const response = await api.post(
    "/upload/hero",
    formData,
    {
      signal,
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
}

/**
 * Upload gallery images.
 *
 * Backend:
 * POST /api/upload/gallery
 * field name: images
 */
export async function uploadGalleryImages(
  files,
  { signal } = {}
) {
  const formData = new FormData();

  Array.from(files || []).forEach(
    (file) => {
      formData.append("images", file);
    }
  );

  const response = await api.post(
    "/upload/gallery",
    formData,
    {
      signal,
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
}

/**
 * Upload menu images.
 *
 * Backend:
 * POST /api/upload/menu
 * field name: images
 */
export async function uploadMenuImages(
  files,
  { signal } = {}
) {
  const formData = new FormData();

  Array.from(files || []).forEach(
    (file) => {
      formData.append("images", file);
    }
  );

  const response = await api.post(
    "/upload/menu",
    formData,
    {
      signal,
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
}

/**
 * Delete an uploaded image.
 *
 * Backend:
 * DELETE /api/upload
 *
 * Body:
 * {
 *   url,
 *   publicId
 * }
 */
export async function deleteUpload(
  upload
) {
  let url = "";
  let publicId = "";

  if (
    upload &&
    typeof upload === "object"
  ) {
    url = upload.url || "";

    publicId =
      upload.publicId ||
      upload.raw?.publicId ||
      upload.raw?.public_id ||
      "";
  } else if (
    typeof upload === "string"
  ) {
    publicId = upload;
  }

  const response = await api.delete(
    "/upload",
    {
      data: {
        url,
        publicId,
      },
    }
  );

  return response.data;
}

/**
 * There is currently no GET /api/upload
 * endpoint in the backend.
 *
 * Therefore uploads are kept in the
 * current frontend session after upload.
 */
export async function getUploads(params = {}) {
  const response = await api.get("/upload", { params });
  const payload = response.data?.data || response.data || {};
  const items = (payload.items || []).map(normalizeUpload).filter(Boolean);
  return { items, meta: payload.meta || null };
}

export async function getUploadStats() {
  const response = await api.get("/upload/stats");
  return response.data?.data || response.data || null;
}

const uploadsService = {
  getUploads,
  getUploadStats,
  uploadFile,
  uploadMultipleFiles,
  uploadHeroImage,
  uploadGalleryImages,
  uploadMenuImages,
  deleteUpload,
  normalizeUpload,
};

export default uploadsService;