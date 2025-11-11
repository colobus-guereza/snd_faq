"use client";

import { Category } from "@/types/faq";
import { categories } from "@/data/faqs";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CategoryMenuProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

export default function CategoryMenu({
  selectedCategory,
  onSelectCategory,
}: CategoryMenuProps) {
  const [copiedCategory, setCopiedCategory] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  // 카테고리 URL 복사 함수
  const handleCategoryShare = async (e: React.MouseEvent<HTMLButtonElement>, category: Category) => {
    e.stopPropagation(); // 카테고리 선택 버튼 클릭 이벤트 전파 방지
    try {
      const categoryUrl = `/?category=${encodeURIComponent(category)}`;
      const fullUrl = `${window.location.origin}${categoryUrl}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopiedCategory(category);
      // 2초 후 복사 완료 메시지 숨김
      setTimeout(() => {
        setCopiedCategory(null);
      }, 2000);
    } catch (err) {
      console.error("URL 복사 실패:", err);
      // 클립보드 API가 지원되지 않는 경우 대체 방법
      const categoryUrl = `/?category=${encodeURIComponent(category)}`;
      const fullUrl = `${window.location.origin}${categoryUrl}`;
      const textArea = document.createElement("textarea");
      textArea.value = fullUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedCategory(category);
      setTimeout(() => {
        setCopiedCategory(null);
      }, 2000);
    }
  };

  return (
    <nav className="w-full">
      <ul className="space-y-0">
        {categories.map((category) => {
          const isSelected = selectedCategory === category;
          const isCopied = copiedCategory === category;
          
          return (
            <li key={category}>
              <div className="flex items-center group px-4 py-2.5 -mx-4 rounded-lg transition-all duration-200 group-hover:bg-gray-50 dark:group-hover:bg-gray-800 group-hover:shadow-[0_1px_3px_rgba(20,184,166,0.3)] group-hover:scale-[1.01]">
                <button
                  onClick={() => onSelectCategory(category)}
                  className={`inline-flex items-center gap-1 text-left text-sm ${
                    isSelected
                      ? "text-[#14B8A6] font-medium"
                      : "text-gray-700 dark:text-gray-300 group-hover:text-[#14B8A6] dark:group-hover:text-[#14B8A6]"
                  }`}
                >
                  <span suppressHydrationWarning>{mounted ? t(category) : category}</span>
                </button>
                {isSelected && (
                  <button
                    onClick={(e) => handleCategoryShare(e, category)}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="flex-shrink-0 p-0.5 ml-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors relative z-10"
                    aria-label={mounted ? `${t(category)} ${t("링크 공유하기")}` : `${category} 링크 공유하기`}
                    title={isCopied ? (mounted ? t("복사됨!") : "복사됨!") : (mounted ? `${t(category)} ${t("링크 공유하기")}` : `${category} 링크 공유하기`)}
                  >
                    {isCopied ? (
                      <svg
                        className="w-3.5 h-3.5 text-[#14B8A6]"
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
                        className="w-3.5 h-3.5"
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
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

