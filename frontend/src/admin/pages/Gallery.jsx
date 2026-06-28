import { useState, useEffect, useCallback, useMemo } from "react";
import { Upload, RefreshCw, Images } from "lucide-react";
import { galleryService } from "../services/gallery.service";
import GalleryGrid from "../components/gallery/GalleryGrid";
import GalleryFilters from "../components/gallery/GalleryFilters";
import GalleryPagination from "../components/gallery/GalleryPagination";
import ImageUploadModal from "../components/gallery/ImageUploadModal";

const ITEMS_PER_PAGE = 20;

// --- Demo / mock data for when backend is not connected ---
let mockIdCounter = 1;
const DEMO_IMAGES = Array.from({ length: 14 }, (_, i) => ({
  id: `demo-${i}`,
  url: `https://picsum.photos/seed/hotel${i}/640/480`,
  filename: `hotel-photo-${String(i + 1).padStart(2, "0")}.jpg`,
  category: ["restaurant", "ambiance", "food", "events", "exterior", "general"][i % 6],
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
}));

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [deletingIds, setDeletingIds] = useState(new Set());
  const [usingDemo, setUsingDemo] = useState(false);

  const fetchImages = useCallback(async (opts = {}) => {
    try {
      const data = await galleryService.getImages({
        page: opts.page ?? page,
        limit: ITEMS_PER_PAGE,
        category: (opts.category ?? category) === "all" ? "" : (opts.category ?? category),
        search: opts.search ?? search,
      });
      setImages(data.images || data.data || []);
      setTotalCount(data.total || data.count || 0);
      setUsingDemo(false);
    } catch {
      // Fall back to demo data
      setUsingDemo(true);
      const filtered = DEMO_IMAGES.filter((img) => {
        const cat = opts.category ?? category;
        const q = (opts.search ?? search).toLowerCase();
        return (
          (cat === "all" || img.category === cat) &&
          (!q || img.filename.toLowerCase().includes(q))
        );
      });
      setTotalCount(filtered.length);
      const p = opts.page ?? page;
      setImages(filtered.slice((p - 1) * ITEMS_PER_PAGE, p * ITEMS_PER_PAGE));
    }
  }, [page, category, search]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchImages().finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page, category]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setLoading(true);
      fetchImages({ page: 1, search }).finally(() => setLoading(false));
    }, 320);
    return () => clearTimeout(t);
  }, [search]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchImages();
    setRefreshing(false);
  };

  const handleUpload = async (files, cat, onProgress) => {
    if (usingDemo) {
      // Optimistic update in demo mode
      await new Promise((r) => setTimeout(r, 800));
      const newImgs = files.map((f) => ({
        id: `demo-new-${mockIdCounter++}`,
        url: URL.createObjectURL(f),
        filename: f.name,
        category: cat,
        createdAt: new Date().toISOString(),
      }));
      setImages((prev) => [...newImgs, ...prev]);
      setTotalCount((c) => c + newImgs.length);
      onProgress(100);
      return;
    }
    const uploaded = await galleryService.uploadImages(files, cat, onProgress);
    // Optimistic prepend
    setImages((prev) => [...uploaded, ...prev]);
    setTotalCount((c) => c + uploaded.length);
  };

  const handleDelete = async (image) => {
    const id = image.id || image._id;
    setDeletingIds((s) => new Set([...s, id]));
    // Optimistic removal
    setImages((prev) => prev.filter((img) => (img.id || img._id) !== id));
    setTotalCount((c) => Math.max(0, c - 1));
    try {
      if (!usingDemo) await galleryService.deleteImage(id);
    } catch {
      // Rollback
      setImages((prev) => [image, ...prev]);
      setTotalCount((c) => c + 1);
    } finally {
      setDeletingIds((s) => { const n = new Set(s); n.delete(id); return n; });
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="gallery-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Gallery</h1>
          <p className="page-sub">Manage photos shown on your hotel website.</p>
        </div>
        <div className="header-actions">
          {usingDemo && (
            <span className="demo-badge">Demo Mode</span>
          )}
          <button
            className="btn-icon"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh"
          >
            <RefreshCw size={16} className={refreshing ? "spinning" : ""} />
          </button>
          <button className="btn-upload" onClick={() => setShowUpload(true)}>
            <Upload size={16} />
            Upload Photos
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <Images size={16} />
          <span>{totalCount} {totalCount === 1 ? "photo" : "photos"} in gallery</span>
        </div>
      </div>

      {/* Filters */}
      <GalleryFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={handleCategoryChange}
        totalCount={totalCount}
      />

      {/* Grid */}
      <GalleryGrid
        images={images}
        loading={loading}
        onDelete={handleDelete}
        deletingIds={deletingIds}
      />

      {/* Pagination */}
      <GalleryPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Upload Modal */}
      {showUpload && (
        <ImageUploadModal
          onClose={() => setShowUpload(false)}
          onUpload={handleUpload}
        />
      )}

      <style>{`
        .gallery-page {
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 1400px;
        }
        .page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .page-title {
          margin: 0 0 4px;
          font-size: 28px;
          font-weight: 700;
          color: #2c1810;
          font-family: 'Georgia', serif;
        }
        .page-sub {
          margin: 0;
          font-size: 14px;
          color: #8a7468;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .demo-badge {
          font-size: 11px;
          font-weight: 600;
          color: #c9a96e;
          background: rgba(201,169,110,0.12);
          border: 1px solid rgba(201,169,110,0.3);
          padding: 4px 10px;
          border-radius: 20px;
          letter-spacing: 0.4px;
          text-transform: uppercase;
        }
        .btn-icon {
          width: 38px;
          height: 38px;
          border-radius: 9px;
          border: 1.5px solid #e8e0d8;
          background: #fff;
          color: #5a4a42;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.18s;
        }
        .btn-icon:hover:not(:disabled) { border-color: #c9a96e; color: #c9a96e; }
        .btn-icon:disabled { opacity: 0.5; cursor: not-allowed; }
        .spinning {
          animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .btn-upload {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 9px;
          background: #2c1810;
          color: #f5ede0;
          border: none;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.18s;
        }
        .btn-upload:hover { background: #3d2218; }
        .stats-bar {
          display: flex;
          gap: 20px;
          padding: 12px 18px;
          background: #fff;
          border: 1.5px solid #f0e8e0;
          border-radius: 10px;
        }
        .stat-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #5a4a42;
        }
        .stat-item svg { color: #c9a96e; }
        @media (max-width: 640px) {
          .gallery-page { padding: 20px 16px; }
          .page-title { font-size: 22px; }
        }
      `}</style>
    </div>
  );
}