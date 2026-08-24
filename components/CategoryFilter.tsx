"use client";

import clsx from "clsx";

import { categories } from "@/lib/categories";
import type { RecipeCategory } from "@/lib/types";

type CategoryFilterProps = {
  activeCategory: RecipeCategory;
  onChange: (category: RecipeCategory) => void;
};

export function CategoryFilter({ activeCategory, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {categories.map((category) => (
        <button
          className={clsx(
            "shrink-0 rounded-2xl border px-4 py-2.5 text-sm font-black transition",
            activeCategory === category
              ? "border-black bg-black text-white shadow-lg shadow-stone-950/15"
              : "border-stone-200 bg-white text-stone-700 hover:border-[#f8b62d] hover:text-[#f04b23]"
          )}
          key={category}
          onClick={() => onChange(category)}
          type="button"
        >
          {category}
        </button>
      ))}
    </div>
  );
}
