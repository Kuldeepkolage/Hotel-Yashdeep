import { useState } from "react";
import { Images } from "lucide-react";
import ImageCard from "./ImageCard";
import DeleteImageDialog from "./DeleteImageDialog";

export default function GalleryGrid({ images, loading, onDelete, deletingIds }) {
  const [previewImage, setPreviewImage] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await onDelete(deleteTarget);
    setDeleteTarget(null);
  };

  if (loading) {
    return (
      <div className="gallery-grid">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="card-placeholder" />
        ))}
        <style>{gridStyles}</style>
      </div>
    );
  }

  if (!images.length) {
    return (
      <div className="gallery-empty">
        <div className="empty-icon">
          <Images size={48} strokeWidth={1.2} />
        </div>
        <h3>No images yet</h3>
        <p>Upload your first photo to start building the gallery.</p>
        <style>{emptyStyles}</style>
      </div>
    );
  }

  return (
    <>
      <div className="gallery-grid">
        {images.map((img) => (
          <ImageCard
            key={img.id || img._id}
            image={img}
            onDelete={setDeleteTarget}
            onPreview={setPreviewImage}
            isDeleting={deletingIds.has(img.id || img._id)}
          />
        ))}
        <style>{gridStyles}</style>
      </div>

      {/* Lightbox */}
      {previewImage && (
        <div className="lightbox" onClick={() => setPreviewImage(null)}>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setPreviewImage(null)}>✕</button>
            <img src={previewImage.url} alt={previewImage.filename} className="lightbox-img" />
            <div className="lightbox-meta">
              <span className="lightbox-name">{previewImage.filename}</span>
              <span className="lightbox-cat">{previewImage.category}</span>
            </div>
          </div>
          <style>{lightboxStyles}</style>
        </div>
      )}

      <DeleteImageDialog
        image={deleteTarget}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}

const gridStyles = `
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 18px;
  }
  .card-placeholder {
    border-radius: 12px;
    aspect-ratio: 4/3;
    background: linear-gradient(90deg, #f0e8e0 25%, #faf4ee 50%, #f0e8e0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

const emptyStyles = `
  .gallery-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 24px;
    gap: 12px;
    text-align: center;
  }
  .empty-icon {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    background: #f5ede0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #c9a96e;
    margin-bottom: 8px;
  }
  .gallery-empty h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #2c1810;
  }
  .gallery-empty p {
    margin: 0;
    font-size: 14px;
    color: #8a7468;
  }
`;

const lightboxStyles = `
  .lightbox {
    position: fixed;
    inset: 0;
    background: rgba(18, 8, 4, 0.88);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.18s ease;
    backdrop-filter: blur(6px);
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .lightbox-inner {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
  }
  .lightbox-close {
    position: absolute;
    top: -44px;
    right: 0;
    background: rgba(255,255,255,0.12);
    border: none;
    color: #fff;
    font-size: 18px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.18s;
  }
  .lightbox-close:hover { background: rgba(255,255,255,0.22); }
  .lightbox-img {
    max-width: 90vw;
    max-height: 78vh;
    border-radius: 10px;
    object-fit: contain;
    box-shadow: 0 24px 80px rgba(0,0,0,0.5);
  }
  .lightbox-meta {
    display: flex;
    gap: 14px;
    align-items: center;
  }
  .lightbox-name {
    color: #f5ede0;
    font-size: 14px;
    font-weight: 500;
  }
  .lightbox-cat {
    color: #c9a96e;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }
`;