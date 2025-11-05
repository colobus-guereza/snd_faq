"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import CategoryMenu from "@/components/CategoryMenu";
import { useState } from "react";
import { Category } from "@/types/faq";

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  
  // 카테고리 타입 검증 함수
  const getValidCategory = (categoryParam: string | null): Category => {
    const validCategories: Category[] = [
      "질문 Top 10",
      "결제/배송",
      "튜닝/리튠",
      "수리 A/S",
      "관리법",
      "특징",
      "레슨/교육",
      "문의/제안",
    ];
    if (categoryParam && validCategories.includes(categoryParam as Category)) {
      return categoryParam as Category;
    }
    return "질문 Top 10";
  };

  // URL 쿼리 파라미터에서 초기 카테고리 설정
  const [selectedCategory, setSelectedCategory] = useState<Category>(() => {
    return getValidCategory(searchParams.get("category"));
  });

  // URL 쿼리 파라미터 변경 시 카테고리 업데이트
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const newCategory = getValidCategory(categoryParam);
    setSelectedCategory((prevCategory) => {
      if (prevCategory !== newCategory) {
        return newCategory;
      }
      return prevCategory;
    });
  }, [searchParams]);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    router.push(`/?category=${encodeURIComponent(category)}`);
  };

  const handleTitleClick = () => {
    setSearchQuery("");
    setSelectedCategory("질문 Top 10");
    router.push("/?category=질문 Top 10");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 
          onClick={handleTitleClick}
          className="mb-10 text-left text-4xl font-bold text-gray-900 dark:text-gray-100 cursor-pointer hover:text-[#14B8A6] transition-colors"
        >
          자주묻는 질문
        </h1>

        <div className="mb-10 flex justify-start">
          <div className="w-full max-w-2xl">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              hasResults={true}
            />
          </div>
        </div>

        <div className="flex flex-row gap-12 items-start">
          <aside className="w-[125px] shrink-0">
            <CategoryMenu
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />
          </aside>

          <section className="flex-1">
            {children}
          </section>
        </div>
      </main>
    </div>
  );
}
