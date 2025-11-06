"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState, createContext, useContext } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import CategoryMenu from "@/components/CategoryMenu";
import { Category } from "@/types/faq";
import { categoryDirectLinkMap } from "@/data/faqs";

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within CommonLayout");
  }
  return context;
}

interface CommonLayoutProps {
  children: React.ReactNode;
}

export default function CommonLayout({ children }: CommonLayoutProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  
  // 메인 페이지인지 확인
  const isHomePage = pathname === "/";
  
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
    
    // 특정 카테고리는 바로 질문 페이지로 이동
    const directLinkQuestionId = categoryDirectLinkMap[category];
    if (directLinkQuestionId) {
      router.push(`/faq/${directLinkQuestionId}?category=${encodeURIComponent(category)}`);
      return;
    }
    
    // 일반 카테고리는 메인 페이지로 이동하면서 카테고리 정보 전달
    router.push(`/?category=${encodeURIComponent(category)}`);
  };

  const handleTitleClick = () => {
    setSearchQuery("");
    setSelectedCategory("질문 Top 10");
    router.push("/?category=질문 Top 10");
  };

  const handleSearchClick = () => {
    // FAQ 상세 페이지에서 검색바 클릭 시 메인 페이지로 이동
    if (!isHomePage) {
      router.push("/");
    }
  };

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
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
                onChange={isHomePage ? setSearchQuery : () => {}}
                hasResults={true}
                onClick={!isHomePage ? handleSearchClick : undefined}
              />
            </div>
          </div>

          {/* 카테고리와 질문 목록 사이의 여백은 globals.css의 --category-list-gap 변수로 조절 가능 */}
          <div className="flex flex-row items-start" style={{ gap: 'var(--category-list-gap)' }}>
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
    </SearchContext.Provider>
  );
}
