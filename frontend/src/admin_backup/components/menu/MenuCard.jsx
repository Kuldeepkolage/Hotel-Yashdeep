import React from "react";
import { Edit2, Trash2, Star, Sparkles, UtensilsCrossed } from "lucide-react";

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='260' viewBox='0 0 400 260'%3E%3Crect width='400' height='260' fill='%23f0ece4'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='40' fill='%23c8bfb5'%3E🍽%3C/text%3E%3C/svg%3E";

export default function MenuCard({ item, onEdit, onDelete, onToggleAvailable, onToggleRecommended }) {
  return (
    <div className={`menu-card${!item.available ? " unavailable" : ""}`}>
      {/* Image */}
      <div className="card-image-wrap">
        <img
          src={item.image_url || PLACEHOLDER}
          alt={item.name}
          className="card-image"
          onError={(e) => { e.target.src = PLACEHOLDER; }}
          loading="lazy"
        />

        {/* Veg indicator */}
        <div className={`veg-badge ${item.veg ? "veg" : "non-veg"}`}>
          <span className="veg-dot" />
        </div>

        {/* Badges */}
        <div className="card-badges">
          {item.is_special && (
            <span className="badge badge-special">
              <Sparkles size={10} />
              Special
            </span>
          )}
          {item.is_recommended && (
            <span className="badge badge-rec">
              <Star size={10} />
              Recommended
            </span>
          )}
        </div>

        {/* Unavailable overlay */}
        {!item.available && (
          <div className="unavail-overlay">
            <UtensilsCrossed size={20} />
            <span>Unavailable</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-name">{item.name}</h3>
          <span className="card-price">₹{Number(item.price).toFixed(0)}</span>
        </div>

        {item.description && (
          <p className="card-desc">{item.description}</p>
        )}

        <div className="card-meta">
          <span className="meta-category">{item.category}</span>
        </div>

        {/* Toggles */}
        <div className="card-toggles">
          <label className="mini-toggle">
            <span className={`mini-toggle-switch${item.available ? " on" : ""}`}
              onClick={() => onToggleAvailable(item)}
              role="switch"
              aria-checked={item.available}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") onToggleAvailable(item); }}
            >
              <span className="mini-thumb" />
            </span>
            <span className="mini-label">Available</span>
          </label>

          <label className="mini-toggle">
            <span className={`mini-toggle-switch${item.is_recommended ? " on" : ""}`}
              onClick={() => onToggleRecommended(item)}
              role="switch"
              aria-checked={item.is_recommended}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") onToggleRecommended(item); }}
            >
              <span className="mini-thumb" />
            </span>
            <span className="mini-label">Recommend</span>
          </label>
        </div>

        {/* Actions */}
        <div className="card-actions">
          <button className="card-btn edit" onClick={() => onEdit(item)}>
            <Edit2 size={13} />
            Edit
          </button>
          <button className="card-btn delete" onClick={() => onDelete(item)}>
            <Trash2 size={13} />
            Remove
          </button>
        </div>
      </div>

      <style>{`
        .menu-card {
          background: #fff;
          border: 1.5px solid #ede9e0;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.2s, transform 0.18s;
        }

        .menu-card:hover {
          box-shadow: 0 8px 30px rgba(44,26,14,0.1);
          transform: translateY(-2px);
        }

        .menu-card.unavailable { opacity: 0.72; }

        .card-image-wrap {
          position: relative;
          height: 170px;
          overflow: hidden;
          background: #f5f1eb;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .menu-card:hover .card-image { transform: scale(1.04); }

        .veg-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          width: 22px;
          height: 22px;
          border-radius: 4px;
          background: #fff;
          border: 1.5px solid currentColor;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }

        .veg-badge.veg { color: #22c55e; }
        .veg-badge.non-veg { color: #ef4444; }

        .veg-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: currentColor;
        }

        .card-badges {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          z-index: 1;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          border-radius: 999px;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.2px;
        }

        .badge-special {
          background: #1a0f08;
          color: #f5e6c8;
        }

        .badge-rec {
          background: #fef9c3;
          color: #854d0e;
          border: 1px solid #fde047;
        }

        .unavail-overlay {
          position: absolute;
          inset: 0;
          background: rgba(20,10,5,0.55);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          z-index: 2;
        }

        .card-content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
        }

        .card-name {
          font-size: 15px;
          font-weight: 700;
          color: #1a0f08;
          margin: 0;
          line-height: 1.3;
          flex: 1;
        }

        .card-price {
          font-size: 16px;
          font-weight: 800;
          color: #2c1a0e;
          flex-shrink: 0;
        }

        .card-desc {
          font-size: 12.5px;
          color: #9b8b7a;
          line-height: 1.55;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-meta {
          display: flex;
          align-items: center;
        }

        .meta-category {
          font-size: 11.5px;
          font-weight: 600;
          color: #b5936b;
          background: #fdf6ec;
          padding: 3px 9px;
          border-radius: 999px;
          border: 1px solid #f0dfc0;
        }

        .card-toggles {
          display: flex;
          gap: 14px;
          padding-top: 2px;
        }

        .mini-toggle {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .mini-toggle-switch {
          width: 32px;
          height: 18px;
          border-radius: 999px;
          background: #ddd8d0;
          position: relative;
          cursor: pointer;
          transition: background 0.18s;
          display: block;
          flex-shrink: 0;
          outline: none;
        }

        .mini-toggle-switch:focus-visible {
          box-shadow: 0 0 0 3px rgba(181,147,107,0.3);
        }

        .mini-toggle-switch.on { background: #2c1a0e; }

        .mini-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #fff;
          transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }

        .mini-toggle-switch.on .mini-thumb { transform: translateX(14px); }

        .mini-label {
          font-size: 12px;
          color: #9b8b7a;
          font-weight: 500;
          user-select: none;
        }

        .card-actions {
          display: flex;
          gap: 8px;
          margin-top: auto;
          padding-top: 4px;
        }

        .card-btn {
          flex: 1;
          height: 36px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          transition: all 0.15s;
        }

        .card-btn.edit {
          border: 1.5px solid #e5e1d8;
          background: #fff;
          color: #3d2c1e;
        }

        .card-btn.edit:hover {
          background: #faf6f1;
          border-color: #b5936b;
          color: #2c1a0e;
        }

        .card-btn.delete {
          border: 1.5px solid #fca5a5;
          background: #fff5f5;
          color: #c0392b;
        }

        .card-btn.delete:hover {
          background: #fee2e2;
          border-color: #ef4444;
        }
      `}</style>
    </div>
  );
}