import React from "react";
import { MENU_CATEGORIES } from "../../services/menu.service";
export const CATEGORIES = MENU_CATEGORIES;

export default function CategoryTabs({ active, onChange, counts = {} }) {
  return (
    <div className="category-tabs-wrapper">
      <div className="category-tabs">
        {MENU_CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`category-tab${active === cat ? " active" : ""}`}
            onClick={() => onChange(cat)}
          >
            <span className="tab-label">{cat}</span>
            {counts[cat] !== undefined && (
              <span className="tab-count">{counts[cat]}</span>
            )}
          </button>
        ))}
      </div>

      <style>{`
        .category-tabs-wrapper {
          overflow-x: auto;
          padding-bottom: 2px;
          scrollbar-width: none;
        }
        .category-tabs-wrapper::-webkit-scrollbar { display: none; }

        .category-tabs {
          display: flex;
          gap: 6px;
          min-width: max-content;
        }

        .category-tab {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 16px;
          border-radius: 999px;
          border: 1.5px solid #e5e1d8;
          background: #fff;
          color: #6b6152;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s ease;
          white-space: nowrap;
        }

        .category-tab:hover {
          border-color: #b5936b;
          color: #3d2c1e;
          background: #faf7f2;
        }

        .category-tab.active {
          background: #2c1a0e;
          border-color: #2c1a0e;
          color: #f5e6c8;
        }

        .tab-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          height: 18px;
          padding: 0 5px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          background: rgba(0,0,0,0.08);
          color: inherit;
        }

        .category-tab.active .tab-count {
          background: rgba(255,255,255,0.18);
        }
      `}</style>
    </div>
  );
}