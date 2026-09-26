import { useState, useEffect, useCallback, useMemo } from "react";
import { Upload, RefreshCw, Images, Sparkles } from "lucide-react";
import { galleryService } from "../services/gallery.service";
import GalleryGrid from "../components/gallery/GalleryGrid";
import GalleryFilters from "../components/gallery/GalleryFilters";
import GalleryPagination from "../components/gallery/GalleryPagination";
import ImageUploadModal from "../components/gallery/ImageUploadModal";
import AdminPageHeader from "../components/common/AdminPageHeader.jsx";

const ITEMS_PER_PAGE = 20;

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
    } catch (err) {
      setImages([]);
      setTotalCount(0);
      throw err;
    }
  }, [page, category, search]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchImages().catch(() => {}).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page, category, fetchImages]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setLoading(true);
      fetchImages({ page: 1, search }).catch(() => {}).finally(() => setLoading(false));
    }, 320);
    return () => clearTimeout(t);
  }, [search, fetchImages]);

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
    const uploaded = await galleryService.uploadImages(files, cat, onProgress);
    setImages((prev) => [...uploaded, ...prev]);
    setTotalCount((c) => c + uploaded.length);
  };

  const handleDelete = async (image) => {
    const id = image.id || image._id;
    setDeletingIds((s) => new Set([...s, id]));
    setImages((prev) => prev.filter((img) => (img.id || img._id) !== id));
    setTotalCount((c) => Math.max(0, c - 1));
    try {
      await galleryService.deleteImage(id);
    } catch {
      setImages((prev) => [image, ...prev]);
      setTotalCount((c) => c + 1);
    } finally {
      setDeletingIds((s) => { const n = new Set(s); n.delete(id); return n; });
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6 sm:space-y-8" data-testid="admin-gallery">
      {/* Page Header */}
      <AdminPageHeader
        title="Gallery"
        subtitle="Manage photo gallery albums, dining hall moments, and food showcase pictures."
        icon={Images}
        badge={`${totalCount} Photos`}
        actions={
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-dark/70 hover:text-dark hover:border-primary/50 transition-all disabled:opacity-50"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-soft hover:bg-primary-hover active:scale-[0.98] transition-all"
            >
              <Upload size={15} />
              Upload Photos
            </button>
          </div>
        }
      />

      {/* Filters Card */}
      <div className="rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-soft">
        <GalleryFilters
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={handleCategoryChange}
          totalCount={totalCount}
        />
      </div>

      {/* Gallery Grid */}
      <div className="rounded-2xl border border-border bg-white p-4 sm:p-6 shadow-soft min-h-[300px]">
        <GalleryGrid
          images={images}
          loading={loading}
          onDelete={handleDelete}
          deletingIds={deletingIds}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <GalleryPagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Upload Modal */}
      {showUpload && (
        <ImageUploadModal
          onClose={() => setShowUpload(false)}
          onUpload={handleUpload}
        />
      )}
    </div>
  );
}