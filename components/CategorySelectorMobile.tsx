"use client";

import { Category } from "@/types/faq";
import { useState } from "react";

interface CategorySelectorMobileProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
  categories: readonly Category[];
}

export default function CategorySelectorMobile({
  selectedCategory,
  onSelectCategory,
  categories,
}: CategorySelectorMobileProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 모바일 카테고리 선택 버튼 - 질문 목록 위에 표시 */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden w-full flex items-center justify-between px-4 py-3 mb-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="text-base font-medium text-gray-900 dark:text-gray-100">
          {selectedCategory}
        </span>
        <svg
          className="w-5 h-5 text-gray-500 dark:text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* 모바일 카테고리 메뉴 모달 */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* 오버레이 */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* 메뉴 패널 */}
          <div className="absolute inset-x-0 top-0 bg-white dark:bg-gray-900 shadow-lg max-h-[80vh] overflow-y-auto">
            {/* 헤더 */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                카테고리 선택
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                aria-label="닫기"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            
            {/* 카테고리 목록 */}
            <nav className="p-4">
              <ul className="space-y-1">
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => {
                        onSelectCategory(category);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        selectedCategory === category
                          ? "text-[#14B8A6] font-medium bg-gray-100 dark:bg-gray-800"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

