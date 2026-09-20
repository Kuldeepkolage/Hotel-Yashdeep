import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, CheckCircle, AlertCircle, ChevronDown } from "lucide-react";
import { GALLERY_CATEGORIES } from "../../services/gallery.service";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_MB = 10;

export default function ImageUploadModal({ onClose, onUpload }) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState("general");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState([]);
  const fileRef = useRef();

  const validateFiles = (incoming) => {
    const valid = [];
    const errs = [];
    for (const f of incoming) {
      if (!ACCEPTED.includes(f.type)) {
        errs.push(`${f.name}: unsupported format`);
      } else if (f.size > MAX_SIZE_MB * 1024 * 1024) {
        errs.push(`${f.name}: exceeds ${MAX_SIZE_MB}MB`);
      } else {
        valid.push({ file: f, preview: URL.createObjectURL(f), id: Math.random().toString(36) });
      }
    }
    return { valid, errs };
  };

  const addFiles = useCallback((incoming) => {
    const { valid, errs } = validateFiles(Array.from(incoming));
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.file.name));
      return [...prev, ...valid.filter((v) => !existing.has(v.file.name))];
    });
    if (errs.length) setErrors(errs);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const removeFile = (id) => {
    setFiles((prev) => {
      const f = prev.find((f) => f.id === id);
      if (f) URL.revokeObjectURL(f.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleUpload = async () => {
    if (!files.length) return;
    setUploading(true);
    setErrors([]);
    try {
      await onUpload(
        files.map((f) => f.file),
        category,
        (p) => setProgress(p)
      );
      setDone(true);
      setTimeout(() => {
        files.forEach((f) => URL.revokeObjectURL(f.preview));
        onClose();
      }, 1200);
    } catch (err) {
      setErrors([err.message || "Upload failed"]);
      setUploading(false);
    }
  };

  const categories = GALLERY_CATEGORIES.filter((c) => c.value !== "all");

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Upload Images</h2>
            <p className="modal-sub">JPG, PNG, WEBP, GIF · max {MAX_SIZE_MB}MB each</p>
          </div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Drop Zone */}
        <div
          className={`drop-zone ${dragging ? "dragging" : ""} ${files.length ? "has-files" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => !files.length && fileRef.current?.click()}
        >
          {files.length === 0 ? (
            <div className="drop-placeholder">
              <div className="drop-icon"><Upload size={28} /></div>
              <p className="drop-main">Drag & drop photos here</p>
              <p className="drop-sub">or <span className="drop-link" onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}>browse files</span></p>
            </div>
          ) : (
            <div className="preview-grid">
              {files.map((f) => (
                <div key={f.id} className="preview-item">
                  <img src={f.preview} alt={f.file.name} className="preview-img" />
                  <button className="remove-btn" onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}>
                    <X size={12} />
                  </button>
                </div>
              ))}
              <div className="add-more" onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}>
                <ImageIcon size={20} />
                <span>Add more</span>
              </div>
            </div>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          multiple
          accept={ACCEPTED.join(",")}
          style={{ display: "none" }}
          onChange={(e) => addFiles(e.target.files)}
        />

        {/* Errors */}
        {errors.length > 0 && (
          <div className="error-list">
            {errors.map((e, i) => (
              <div key={i} className="error-item"><AlertCircle size={14} />{e}</div>
            ))}
          </div>
        )}

        {/* Category */}
        <div className="field-row">
          <label className="field-label">Category</label>
          <div className="select-wrap">
            <select
              className="cat-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <ChevronDown size={15} className="select-arrow" />
          </div>
        </div>

        {/* Progress */}
        {uploading && (
          <div className="progress-wrap">
            <div className="progress-bar-bg">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>
            <span className="progress-label">
              {done ? <><CheckCircle size={14} /> Done!</> : `${progress}%`}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={uploading}>Cancel</button>
          <button
            className="btn-primary"
            onClick={handleUpload}
            disabled={!files.length || uploading}
          >
            {uploading ? "Uploading…" : `Upload ${files.length ? `(${files.length})` : ""}`}
          </button>
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(18, 8, 4, 0.62);
          z-index: 1100;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.18s ease;
          backdrop-filter: blur(5px);
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal {
          background: #fff;
          border-radius: 18px;
          padding: 28px;
          width: 540px;
          max-width: 94vw;
          max-height: 90vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-shadow: 0 28px 80px rgba(18, 8, 4, 0.25);
          animation: slideUp 0.22s ease;
        }
        @keyframes slideUp { from { transform: translateY(22px); opacity:0; } to { transform: none; opacity:1; } }
        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }
        .modal-title {
          margin: 0 0 4px;
          font-size: 20px;
          font-weight: 700;
          color: #2c1810;
        }
        .modal-sub {
          margin: 0;
          font-size: 13px;
          color: #9b8ea0;
        }
        .modal-close {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: none;
          background: #f5ede0;
          color: #5a4a42;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.18s;
        }
        .modal-close:hover { background: #eddece; }
        .drop-zone {
          border: 2px dashed #d8cec6;
          border-radius: 14px;
          padding: 24px;
          transition: all 0.2s;
          cursor: pointer;
          background: #faf6f2;
          min-height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .drop-zone.dragging {
          border-color: #c9a96e;
          background: #fdf5e8;
          box-shadow: 0 0 0 4px rgba(201,169,110,0.12);
        }
        .drop-zone.has-files {
          cursor: default;
          align-items: flex-start;
        }
        .drop-placeholder {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .drop-icon {
          width: 60px;
          height: 60px;
          border-radius: 14px;
          background: #f0e4d0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c9a96e;
          margin-bottom: 4px;
        }
        .drop-main {
          margin: 0;
          font-size: 15px;
          font-weight: 600;
          color: #2c1810;
        }
        .drop-sub {
          margin: 0;
          font-size: 13px;
          color: #8a7468;
        }
        .drop-link {
          color: #c9a96e;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
        }
        .preview-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          width: 100%;
        }
        .preview-item {
          position: relative;
          width: 80px;
          height: 80px;
          border-radius: 10px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .remove-btn {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(28, 14, 8, 0.72);
          color: #fff;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.16s;
        }
        .remove-btn:hover { background: #dc3c3c; }
        .add-more {
          width: 80px;
          height: 80px;
          border-radius: 10px;
          border: 2px dashed #d8cec6;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          cursor: pointer;
          color: #9b8ea0;
          font-size: 11px;
          transition: all 0.18s;
          flex-shrink: 0;
        }
        .add-more:hover { border-color: #c9a96e; color: #c9a96e; }
        .error-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .error-item {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
          color: #dc3c3c;
          padding: 8px 12px;
          background: #fff0f0;
          border-radius: 8px;
        }
        .field-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .field-label {
          font-size: 14px;
          font-weight: 500;
          color: #5a4a42;
          white-space: nowrap;
        }
        .select-wrap {
          position: relative;
          flex: 1;
        }
        .cat-select {
          width: 100%;
          padding: 9px 36px 9px 12px;
          border: 1.5px solid #e8e0d8;
          border-radius: 8px;
          background: #fff;
          font-size: 14px;
          color: #2c1810;
          outline: none;
          appearance: none;
          cursor: pointer;
          transition: border-color 0.18s;
        }
        .cat-select:focus { border-color: #c9a96e; }
        .select-arrow {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #9b8ea0;
          pointer-events: none;
        }
        .progress-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .progress-bar-bg {
          flex: 1;
          height: 6px;
          background: #f0e8e0;
          border-radius: 99px;
          overflow: hidden;
        }
        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #c9a96e, #e8c87a);
          border-radius: 99px;
          transition: width 0.3s ease;
        }
        .progress-label {
          font-size: 13px;
          color: #5a4a42;
          font-weight: 600;
          min-width: 44px;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .modal-footer {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          padding-top: 4px;
          border-top: 1px solid #f0e8e0;
        }
        .btn-secondary, .btn-primary {
          padding: 10px 22px;
          border-radius: 9px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.18s;
        }
        .btn-secondary {
          background: #f5ede0;
          color: #5a4a42;
        }
        .btn-secondary:hover:not(:disabled) { background: #eddece; }
        .btn-primary {
          background: #2c1810;
          color: #f5ede0;
        }
        .btn-primary:hover:not(:disabled) { background: #3d2218; }
        .btn-primary:disabled, .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}