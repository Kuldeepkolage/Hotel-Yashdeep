// src/admin/components/menu/MenuFormModal.jsx
// Fields match Menu model EXACTLY: name, category, description, price, image, isVeg, available
// category enum: Starter | Main Course | Chinese | Tandoor | Rice | Biryani | Dessert | Beverage | Beer | Mocktail

import React, { useState, useEffect } from "react";
import { X, Loader2, ChevronDown } from "lucide-react";
import { MENU_CATEGORIES } from "../../services/menu.service.js";
import PriceInput from "./PriceInput.jsx";
import ImageUploader from "./ImageUploader.jsx";

const EMPTY_FORM = {
  name: "",
  category: "Starter",
  description: "",
  price: "",
  image: "",
  isVeg: false,
  available: true,
};

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Dish name is required.";
  if (!form.category) errors.category = "Category is required.";
  if (form.price === "" || isNaN(Number(form.price)) || Number(form.price) < 0)
    errors.price = "Enter a valid price (₹0 or more).";
  return errors;
}

export default function MenuFormModal({ open, editItem, onClose, onSubmit, loading }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (open) {
      if (editItem) {
        setForm({
          name: editItem.name ?? "",
          category: editItem.category ?? "Starter",
          description: editItem.description ?? "",
          price: editItem.price?.toString() ?? "",
          image: editItem.image ?? "",
          isVeg: editItem.isVeg ?? false,
          available: editItem.available ?? true,
        });
      } else {
        setForm(EMPTY_FORM);
      }
      setErrors({});
    }
  }, [open, editItem]);

  if (!open) return null;

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function handleSubmit() {
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    // Build payload — field names EXACTLY match model
    const payload = {
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      price: parseFloat(form.price),
      image: form.image.trim(),
      isVeg: form.isVeg,
      available: form.available,
    };
    onSubmit(payload);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 flex-shrink-0">
          <div>
            <h2 className="font-bold text-stone-800 text-lg">
              {editItem ? "Edit Dish" : "Add New Dish"}
            </h2>
            <p className="text-stone-400 text-xs mt-0.5">
              {editItem ? "Update details below" : "Fill in all required fields"}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-600 disabled:opacity-50 transition"
          >
            <X size={17} />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1">
              Dish Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Paneer Tikka"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              disabled={loading}
              className={`w-full px-3 py-2.5 rounded-lg border text-sm bg-white text-stone-800
                placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition
                ${errors.name ? "border-red-400 focus:ring-red-300" : "border-stone-300"}
                ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                disabled={loading}
                className={`w-full pl-3 pr-8 py-2.5 rounded-lg border text-sm bg-white text-stone-800 appearance-none
                  focus:outline-none focus:ring-2 focus:ring-amber-400 transition cursor-pointer
                  ${errors.category ? "border-red-400 focus:ring-red-300" : "border-stone-300"}
                  ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {MENU_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            </div>
            {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
          </div>

          {/* Price */}
          <PriceInput
            value={form.price}
            onChange={(v) => set("price", v)}
            error={errors.price}
            disabled={loading}
          />

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Short description of the dish…"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              disabled={loading}
              className={`w-full px-3 py-2.5 rounded-lg border text-sm bg-white text-stone-800
                placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none transition
                border-stone-300 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          </div>

          {/* Image */}
          <ImageUploader
            value={form.image}
            onChange={(v) => set("image", v)}
            error={errors.image}
            disabled={loading}
          />

          {/* isVeg */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-2">
              Dish Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => set("isVeg", true)}
                disabled={loading}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition
                  ${form.isVeg
                    ? "bg-green-50 border-green-500 text-green-700"
                    : "bg-white border-stone-200 text-stone-500 hover:border-stone-300"}`}
              >
                <span className="w-3 h-3 rounded-sm border-2 border-green-600 bg-green-500 flex-shrink-0" />
                Vegetarian
              </button>
              <button
                type="button"
                onClick={() => set("isVeg", false)}
                disabled={loading}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition
                  ${!form.isVeg
                    ? "bg-red-50 border-red-500 text-red-700"
                    : "bg-white border-stone-200 text-stone-500 hover:border-stone-300"}`}
              >
                <span className="w-3 h-3 rounded-sm border-2 border-red-600 bg-red-500 flex-shrink-0" />
                Non-Veg
              </button>
            </div>
          </div>

          {/* available */}
          <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-100">
            <div>
              <p className="text-sm font-semibold text-stone-700">Mark as Available</p>
              <p className="text-xs text-stone-400 mt-0.5">Guests can see and order this dish</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.available}
              onClick={() => set("available", !form.available)}
              disabled={loading}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0
                ${form.available ? "bg-amber-700" : "bg-stone-300"}
                ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
                  ${form.available ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex gap-3 px-6 py-4 border-t border-stone-100 flex-shrink-0">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 font-semibold text-sm
              hover:bg-stone-50 disabled:opacity-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm
              flex items-center justify-center gap-2 disabled:opacity-60 transition"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : null}
            {loading
              ? editItem ? "Saving…" : "Adding…"
              : editItem ? "Save Changes" : "Add Dish"}
          </button>
        </div>
      </div>
    </div>
  );
}