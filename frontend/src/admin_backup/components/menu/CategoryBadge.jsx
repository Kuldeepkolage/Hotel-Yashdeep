// src/admin/components/menu/CategoryBadge.jsx
import React from "react";

const CATEGORY_COLORS = {
  Starter: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200" },
  "Main Course": { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
  Chinese: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200" },
  Tandoor: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" },
  Rice: { bg: "bg-lime-100", text: "text-lime-700", border: "border-lime-200" },
  Biryani: { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" },
  Dessert: { bg: "bg-pink-100", text: "text-pink-700", border: "border-pink-200" },
  Beverage: { bg: "bg-sky-100", text: "text-sky-700", border: "border-sky-200" },
  Beer: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-300" },
  Mocktail: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
};

export default function CategoryBadge({ category }) {
  const colors = CATEGORY_COLORS[category] ?? {
    bg: "bg-stone-100",
    text: "text-stone-600",
    border: "border-stone-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}
    >
      {category}
    </span>
  );
}