"use client";

import { Category } from "@/types/faq";
import { useState } from "react";
import { categoryDirectLinkMap } from "@/data/faqs";

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
  const [copied, setCopied] = useState(false);

  // "문의/제안" 카테고리는 직접 링크가 있는 카테고리이므로 공유 아이콘 숨김
  const isDirectLinkCategory = categoryDirectLinkMap[selectedCategory] !== undefined;

  // 현재 카테고리의 질문 목록 페이지 URL 복사 함수
  const handleShareClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // 카테고리 선택 버튼 클릭 이벤트 전파 방지
    try {
      const categoryUrl = `/?category=${encodeURIComponent(selectedCategory)}`;
      const fullUrl = `${window.location.origin}${categoryUrl}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      // 2초 후 복사 완료 메시지 숨김
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("URL 복사 실패:", err);
      // 클립보드 API가 지원되지 않는 경우 대체 방법
      const categoryUrl = `/?category=${encodeURIComponent(selectedCategory)}`;
      const fullUrl = `${window.location.origin}${categoryUrl}`;
      const textArea = document.createElement("textarea");
      textArea.value = fullUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <>
      {/* 모바일 카테고리 선택 버튼 - 질문 목록 위에 표시 */}
      <div className="md:hidden flex items-center gap-2 mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-base font-medium text-gray-900 dark:text-gray-100 hover:text-[#14B8A6] transition-colors"
        >
          <span>{selectedCategory}</span>
          <svg
            className="w-4 h-4"
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
        {!isDirectLinkCategory && (
          <button
            onClick={handleShareClick}
            className="flex-shrink-0 p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            aria-label="카테고리 링크 공유하기"
            title={copied ? "복사됨!" : "카테고리 링크 공유하기"}
          >
            {copied ? (
              <svg
                className="w-4 h-4 text-[#14B8A6]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            )}
          </button>
        )}
      </div>

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

