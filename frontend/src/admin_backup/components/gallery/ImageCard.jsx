import { useState } from "react";
import { Trash2, Tag, ZoomIn } from "lucide-react";
import { GALLERY_CATEGORIES } from "../../services/gallery.service";

export default function ImageCard({ image, onDelete, onPreview, isDeleting }) {
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const categoryLabel =
    GALLERY_CATEGORIES.find((c) => c.value === image.category)?.label || image.category;

  return (
    <div
      className={`image-card ${isDeleting ? "deleting" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="image-wrapper">
        {!imgLoaded && <div className="img-skeleton" />}
        <img
          src={image.url}
          alt={image.alt || image.filename}
          className={`card-img ${imgLoaded ? "loaded" : ""}`}
          onLoad={() => setImgLoaded(true)}
        />

        <div className={`card-overlay ${hovered ? "visible" : ""}`}>
          <button
            className="overlay-btn preview-btn"
            onClick={() => onPreview(image)}
            title="Preview"
          >
            <ZoomIn size={18} />
          </button>
          <button
            className="overlay-btn delete-btn"
            onClick={() => onDelete(image)}
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="card-info">
        <p className="card-name" title={image.filename}>
          {image.filename || "Untitled"}
        </p>
        <span className="card-category">
          <Tag size={11} />
          {categoryLabel}
        </span>
      </div>

      <style>{`
        .image-card {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          border: 1.5px solid #f0e8e0;
          transition: all 0.22s;
          cursor: pointer;
          position: relative;
        }
        .image-card:hover {
          border-color: #c9a96e;
          box-shadow: 0 6px 24px rgba(44, 24, 16, 0.10);
          transform: translateY(-2px);
        }
        .image-card.deleting {
          opacity: 0.4;
          pointer-events: none;
          transform: scale(0.97);
        }
        .image-wrapper {
          position: relative;
          aspect-ratio: 4/3;
          overflow: hidden;
          background: #f5ede0;
        }
        .img-skeleton {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #f0e8e0 25%, #faf4ee 50%, #f0e8e0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .card-img.loaded {
          opacity: 1;
        }
        .card-overlay {
          position: absolute;
          inset: 0;
          background: rgba(28, 14, 8, 0.52);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          opacity: 0;
          transition: opacity 0.22s;
        }
        .card-overlay.visible {
          opacity: 1;
        }
        .overlay-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.18s;
          backdrop-filter: blur(4px);
        }
        .preview-btn {
          background: rgba(255,255,255,0.88);
          color: #2c1810;
        }
        .preview-btn:hover {
          background: #fff;
          transform: scale(1.08);
        }
        .delete-btn {
          background: rgba(220, 60, 60, 0.88);
          color: #fff;
        }
        .delete-btn:hover {
          background: #dc3c3c;
          transform: scale(1.08);
        }
        .card-info {
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .card-name {
          margin: 0;
          font-size: 13px;
          font-weight: 500;
          color: #2c1810;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .card-category {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #8a7468;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>
    </div>
  );
}