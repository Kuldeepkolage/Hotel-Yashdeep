import React from "react";
import { Edit2, Trash2, Star, Sparkles } from "lucide-react";

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23f0ece4'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='24' fill='%23c8bfb5'%3E🍽%3C/text%3E%3C/svg%3E";

export default function MenuTable({ items, onEdit, onDelete, onToggleAvailable, onToggleRecommended }) {
  if (!items.length) return null;

  return (
    <div className="table-wrapper">
      <table className="menu-table">
        <thead>
          <tr>
            <th className="col-item">Dish</th>
            <th className="col-cat">Category</th>
            <th className="col-price">Price</th>
            <th className="col-type">Type</th>
            <th className="col-avail">Available</th>
            <th className="col-rec">Recommend</th>
            <th className="col-badges">Badges</th>
            <th className="col-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id} className={!item.available ? "row-unavail" : ""}>
              {/* Dish */}
              <td className="col-item">
                <div className="dish-cell">
                  <img
                    src={item.image_url || PLACEHOLDER}
                    alt={item.name}
                    className="dish-thumb"
                    onError={(e) => { e.target.src = PLACEHOLDER; }}
                    loading="lazy"
                  />
                  <div className="dish-info">
                    <span className="dish-name">{item.name}</span>
                    {item.description && (
                      <span className="dish-desc">{item.description}</span>
                    )}
                  </div>
                </div>
              </td>

              {/* Category */}
              <td className="col-cat">
                <span className="tag-category">{item.category}</span>
              </td>

              {/* Price */}
              <td className="col-price">
                <span className="price-cell">₹{Number(item.price).toFixed(0)}</span>
              </td>

              {/* Type */}
              <td className="col-type">
                <div className={`veg-indicator ${item.veg ? "veg" : "non-veg"}`}>
                  <span className="veg-dot" />
                  {item.veg ? "Veg" : "Non-Veg"}
                </div>
              </td>

              {/* Available */}
              <td className="col-avail">
                <div
                  className={`row-toggle${item.available ? " on" : ""}`}
                  onClick={() => onToggleAvailable(item)}
                  role="switch"
                  aria-checked={item.available}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") onToggleAvailable(item); }}
                >
                  <span className="row-thumb" />
                </div>
              </td>

              {/* Recommended */}
              <td className="col-rec">
                <div
                  className={`row-toggle${item.is_recommended ? " on" : ""}`}
                  onClick={() => onToggleRecommended(item)}
                  role="switch"
                  aria-checked={item.is_recommended}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") onToggleRecommended(item); }}
                >
                  <span className="row-thumb" />
                </div>
              </td>

              {/* Badges */}
              <td className="col-badges">
                <div className="badges-cell">
                  {item.is_special && (
                    <span className="row-badge special">
                      <Sparkles size={9} />
                      Special
                    </span>
                  )}
                  {item.is_recommended && (
                    <span className="row-badge rec">
                      <Star size={9} />
                      Pick
                    </span>
                  )}
                </div>
              </td>

              {/* Actions */}
              <td className="col-actions">
                <div className="actions-cell">
                  <button className="tbl-btn edit" onClick={() => onEdit(item)} title="Edit dish">
                    <Edit2 size={14} />
                  </button>
                  <button className="tbl-btn del" onClick={() => onDelete(item)} title="Delete dish">
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .table-wrapper {
          overflow-x: auto;
          border: 1.5px solid #ede9e0;
          border-radius: 14px;
          scrollbar-width: thin;
          scrollbar-color: #e0d9cf transparent;
        }

        .menu-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 780px;
          font-size: 13.5px;
        }

        .menu-table thead tr {
          background: #faf9f6;
          border-bottom: 1.5px solid #ede9e0;
        }

        .menu-table th {
          padding: 12px 16px;
          text-align: left;
          font-size: 11.5px;
          font-weight: 700;
          color: #9b8b7a;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .menu-table tbody tr {
          border-bottom: 1px solid #f0ece4;
          transition: background 0.12s;
        }

        .menu-table tbody tr:last-child { border-bottom: none; }
        .menu-table tbody tr:hover { background: #fdfaf6; }
        .menu-table tbody tr.row-unavail { opacity: 0.62; }

        .menu-table td {
          padding: 12px 16px;
          vertical-align: middle;
          color: #2c1a0e;
        }

        .dish-cell {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 200px;
        }

        .dish-thumb {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          object-fit: cover;
          border: 1px solid #ede9e0;
          flex-shrink: 0;
          background: #f5f1eb;
        }

        .dish-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .dish-name {
          font-weight: 700;
          color: #1a0f08;
          font-size: 14px;
        }

        .dish-desc {
          font-size: 12px;
          color: #a89880;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          max-width: 200px;
        }

        .tag-category {
          font-size: 11.5px;
          font-weight: 600;
          color: #b5936b;
          background: #fdf6ec;
          padding: 3px 9px;
          border-radius: 999px;
          border: 1px solid #f0dfc0;
          white-space: nowrap;
        }

        .price-cell {
          font-weight: 800;
          color: #2c1a0e;
          font-size: 14.5px;
        }

        .veg-indicator {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12.5px;
          font-weight: 600;
          white-space: nowrap;
        }

        .veg-indicator.veg { color: #16a34a; }
        .veg-indicator.non-veg { color: #dc2626; }

        .veg-dot {
          width: 9px;
          height: 9px;
          border-radius: 2px;
          background: currentColor;
          flex-shrink: 0;
        }

        .row-toggle {
          width: 36px;
          height: 20px;
          border-radius: 999px;
          background: #ddd8d0;
          position: relative;
          cursor: pointer;
          transition: background 0.18s;
          outline: none;
        }

        .row-toggle:focus-visible {
          box-shadow: 0 0 0 3px rgba(181,147,107,0.3);
        }

        .row-toggle.on { background: #2c1a0e; }

        .row-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #fff;
          transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }

        .row-toggle.on .row-thumb { transform: translateX(16px); }

        .badges-cell {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
        }

        .row-badge {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 2px 7px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 700;
        }

        .row-badge.special { background: #1a0f08; color: #f5e6c8; }
        .row-badge.rec { background: #fef9c3; color: #854d0e; border: 1px solid #fde047; }

        .actions-cell {
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .tbl-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1.5px solid #e5e1d8;
          background: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
          color: #6b6152;
        }

        .tbl-btn.edit:hover {
          background: #faf6f1;
          border-color: #b5936b;
          color: #2c1a0e;
        }

        .tbl-btn.del {
          border-color: #fca5a5;
          color: #c0392b;
          background: #fff5f5;
        }

        .tbl-btn.del:hover {
          background: #fee2e2;
          border-color: #ef4444;
        }
      `}</style>
    </div>
  );
}