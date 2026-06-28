import React, { useRef, useState } from "react";
import { Upload, X, ImagePlus, Loader2 } from "lucide-react";
import { uploadMenuImage } from "../../services/menu.service";

export default function ImageUploader({ value, onChange, onError }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      onError?.("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      onError?.("Image must be under 5 MB.");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadMenuImage(file);
      onChange(url);
    } catch (err) {
      onError?.(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }

  return (
    <div className="image-uploader">
      {value ? (
        <div className="image-preview-wrap">
          <img src={value} alt="Dish" className="image-preview" />
          <div className="image-overlay">
            <button
              type="button"
              className="image-change-btn"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? <Loader2 size={14} className="spin" /> : <Upload size={14} />}
              {uploading ? "Uploading…" : "Change"}
            </button>
            <button
              type="button"
              className="image-remove-btn"
              onClick={() => onChange("")}
              disabled={uploading}
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`upload-zone${dragging ? " dragging" : ""}${uploading ? " loading" : ""}`}
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          {uploading ? (
            <>
              <Loader2 size={28} className="spin upload-zone-icon" />
              <p className="upload-label">Uploading image…</p>
            </>
          ) : (
            <>
              <ImagePlus size={28} className="upload-zone-icon" />
              <p className="upload-label">Drop image here or <span className="upload-link">browse</span></p>
              <p className="upload-hint">PNG, JPG, WEBP — max 5 MB</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files[0])}
      />

      <style>{`
        .image-uploader { width: 100%; }

        .image-preview-wrap {
          position: relative;
          width: 100%;
          height: 180px;
          border-radius: 12px;
          overflow: hidden;
          border: 1.5px solid #e5e1d8;
        }

        .image-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .image-preview-wrap:hover .image-overlay { opacity: 1; }

        .image-change-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 8px;
          border: none;
          background: #fff;
          color: #2c1a0e;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .image-remove-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: none;
          background: rgba(255,255,255,0.15);
          color: #fff;
          cursor: pointer;
          transition: background 0.15s;
        }

        .image-remove-btn:hover { background: rgba(220,38,38,0.8); }

        .upload-zone {
          width: 100%;
          height: 150px;
          border: 2px dashed #d4cfc7;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.18s;
          background: #faf9f6;
        }

        .upload-zone:hover, .upload-zone.dragging {
          border-color: #b5936b;
          background: #fdf6ec;
        }

        .upload-zone.loading { cursor: not-allowed; }

        .upload-zone-icon { color: #a89880; }

        .upload-zone:hover .upload-zone-icon,
        .upload-zone.dragging .upload-zone-icon { color: #b5936b; }

        .upload-label {
          font-size: 13.5px;
          color: #6b6152;
          margin: 0;
        }

        .upload-link { color: #b5936b; font-weight: 600; text-decoration: underline; }

        .upload-hint {
          font-size: 11.5px;
          color: #b5a898;
          margin: 0;
        }

        .spin {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}