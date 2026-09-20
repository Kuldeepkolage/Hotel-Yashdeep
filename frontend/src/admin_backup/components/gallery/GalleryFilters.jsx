import { Search, X } from "lucide-react";
import { GALLERY_CATEGORIES } from "../../services/gallery.service";

export default function GalleryFilters({ search, setSearch, category, setCategory, totalCount }) {
  return (
    <div className="gallery-filters">
      <div className="filters-top">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search images..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch("")}>
              <X size={14} />
            </button>
          )}
        </div>
        <span className="result-count">
          {totalCount} {totalCount === 1 ? "image" : "images"}
        </span>
      </div>

      <div className="category-tabs">
        {GALLERY_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            className={`category-tab ${category === cat.value ? "active" : ""}`}
            onClick={() => setCategory(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <style>{`
        .gallery-filters {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .filters-top {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .search-box {
          position: relative;
          flex: 1;
          min-width: 200px;
          max-width: 380px;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9b8ea0;
          pointer-events: none;
        }
        .search-input {
          width: 100%;
          padding: 10px 36px 10px 38px;
          border: 1.5px solid #e8e0d8;
          border-radius: 8px;
          background: #fff;
          font-size: 14px;
          color: #2c1810;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .search-input:focus {
          border-color: #c9a96e;
        }
        .search-input::placeholder {
          color: #b0a09a;
        }
        .search-clear {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #9b8ea0;
          display: flex;
          align-items: center;
          padding: 2px;
        }
        .result-count {
          font-size: 13px;
          color: #8a7468;
          white-space: nowrap;
          margin-left: auto;
        }
        .category-tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .category-tab {
          padding: 7px 16px;
          border-radius: 20px;
          border: 1.5px solid #e8e0d8;
          background: #fff;
          font-size: 13px;
          color: #5a4a42;
          cursor: pointer;
          transition: all 0.18s;
          white-space: nowrap;
        }
        .category-tab:hover {
          border-color: #c9a96e;
          color: #c9a96e;
        }
        .category-tab.active {
          background: #2c1810;
          border-color: #2c1810;
          color: #f5ede0;
        }
      `}</style>
    </div>
  );
}