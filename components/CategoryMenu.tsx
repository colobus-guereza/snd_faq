"use client";

import { Category } from "@/types/faq";
import { categories } from "@/data/faqs";

interface CategoryMenuProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

export default function CategoryMenu({
  selectedCategory,
  onSelectCategory,
}: CategoryMenuProps) {
  return (
    <nav className="w-full">
      <ul className="space-y-0">
        {categories.map((category) => (
          <li key={category}>
            <button
              onClick={() => onSelectCategory(category)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                selectedCategory === category
                  ? "text-[#14B8A6] font-medium"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

