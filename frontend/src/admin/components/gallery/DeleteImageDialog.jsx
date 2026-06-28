import { Trash2, X } from "lucide-react";

export default function DeleteImageDialog({ image, onConfirm, onCancel }) {
  if (!image) return null;

  return (
    <div className="dialog-backdrop" onClick={onCancel}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-icon">
          <Trash2 size={24} />
        </div>
        <div className="dialog-body">
          <h3 className="dialog-title">Delete Image</h3>
          <p className="dialog-desc">
            Are you sure you want to delete{" "}
            <strong>{image.filename || "this image"}</strong>? This action cannot
            be undone.
          </p>
        </div>
        <div className="dialog-preview">
          <img src={image.url} alt={image.filename} className="dialog-img" />
        </div>
        <div className="dialog-actions">
          <button className="btn-cancel" onClick={onCancel}>
            <X size={15} /> Cancel
          </button>
          <button className="btn-delete" onClick={onConfirm}>
            <Trash2 size={15} /> Delete
          </button>
        </div>
      </div>

      <style>{`
        .dialog-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(18, 8, 4, 0.60);
          z-index: 1100;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.18s ease;
          backdrop-filter: blur(4px);
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .dialog {
          background: #fff;
          border-radius: 16px;
          padding: 28px;
          width: 380px;
          max-width: 90vw;
          display: flex;
          flex-direction: column;
          gap: 18px;
          box-shadow: 0 20px 60px rgba(18, 8, 4, 0.22);
          animation: slideUp 0.2s ease;
        }
        @keyframes slideUp { from { transform: translateY(18px); opacity:0; } to { transform: none; opacity:1; } }
        .dialog-icon {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          background: #fff0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #dc3c3c;
        }
        .dialog-title {
          margin: 0 0 6px;
          font-size: 17px;
          font-weight: 700;
          color: #2c1810;
        }
        .dialog-desc {
          margin: 0;
          font-size: 14px;
          color: #6a5a52;
          line-height: 1.55;
        }
        .dialog-preview {
          border-radius: 10px;
          overflow: hidden;
          background: #f5ede0;
          height: 140px;
        }
        .dialog-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .dialog-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }
        .btn-cancel, .btn-delete {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 18px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.18s;
        }
        .btn-cancel {
          background: #f5ede0;
          color: #5a4a42;
        }
        .btn-cancel:hover {
          background: #eddece;
        }
        .btn-delete {
          background: #dc3c3c;
          color: #fff;
        }
        .btn-delete:hover {
          background: #c43030;
        }
      `}</style>
    </div>
  );
}