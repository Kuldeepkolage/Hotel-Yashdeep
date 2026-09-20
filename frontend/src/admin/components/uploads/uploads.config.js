export const UPLOAD_CONFIG = {
  // Backend expects this exact field name
  fieldName: "image",

  // Backend multer limit = 5 MB
  maxFileSizeMB: 5,

  pageSize: 12,

  searchDebounceMs: 350,

  accept: {
    image: [
      "image/jpeg",
      "image/png",
      "image/webp",
    ],
  },
};

export const ACCEPTED_MIME_TYPES =
  Object.values(
    UPLOAD_CONFIG.accept
  ).flat();

export const ACCEPT_ATTRIBUTE =
  ACCEPTED_MIME_TYPES.join(",");

export const TYPE_FILTERS = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "image",
    label: "Images",
  },
];

export const SORT_OPTIONS = [
  {
    value: "newest",
    label: "Newest",
  },
  {
    value: "oldest",
    label: "Oldest",
  },
  {
    value: "name-asc",
    label: "Name A-Z",
  },
  {
    value: "name-desc",
    label: "Name Z-A",
  },
  {
    value: "largest",
    label: "Largest",
  },
  {
    value: "smallest",
    label: "Smallest",
  },
];