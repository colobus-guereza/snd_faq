"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState, createContext, useContext } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import CategoryMenu from "@/components/CategoryMenu";
import CategorySelectorMobile from "@/components/CategorySelectorMobile";
import { Category } from "@/types/faq";
import { categoryDirectLinkMap, categories } from "@/data/faqs";

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

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    // 검색어 입력 시 메인 페이지로 이동하여 검색 실행
    if (!isHomePage) {
      router.push("/");
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter 키를 누르면 메인 페이지로 이동하여 검색 실행 (이미 메인 페이지면 유지)
    if (e.key === "Enter" && !isHomePage) {
      router.push("/");
    }
  };

  // URL 복사 상태 관리
  const [copied, setCopied] = useState(false);
  
  // 초기화면(메인 페이지) URL 복사 함수
  const handleShareClick = async () => {
    try {
      const homeUrl = `${window.location.origin}/`;
      await navigator.clipboard.writeText(homeUrl);
      setCopied(true);
      // 2초 후 복사 완료 메시지 숨김
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("URL 복사 실패:", err);
      // 클립보드 API가 지원되지 않는 경우 대체 방법
      const homeUrl = `${window.location.origin}/`;
      const textArea = document.createElement("textarea");
      textArea.value = homeUrl;
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
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-center gap-2">
            <h1 
              onClick={handleTitleClick}
              className="text-left text-4xl font-bold text-gray-900 dark:text-gray-100 cursor-pointer hover:text-[#14B8A6] transition-colors"
            >
              자주묻는 질문
            </h1>
            <button
              onClick={handleShareClick}
              className="flex-shrink-0 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="링크 공유하기"
              title={copied ? "복사됨!" : "링크 공유하기"}
            >
              {copied ? (
                <svg
                  className="w-5 h-5 text-[#14B8A6]"
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
                  className="w-5 h-5"
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
          </div>

          <div className="mb-10 flex justify-start">
            <div className="w-full max-w-2xl">
              <SearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                hasResults={true}
              />
            </div>
          </div>

          {/* 모바일: 카테고리 선택 버튼 (질문 목록 위에 표시) */}
          <div className="md:hidden mb-4">
            <CategorySelectorMobile
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
              categories={categories}
            />
          </div>

          {/* 카테고리와 질문 목록 사이의 여백은 globals.css의 --category-list-gap 변수로 조절 가능 */}
          <div className="flex flex-row items-start" style={{ gap: 'var(--category-list-gap)' }}>
            {/* 웹: 카테고리 사이드바 (md 이상에서만 표시) */}
            <aside className="hidden md:block w-[125px] shrink-0">
              <CategoryMenu
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategorySelect}
              />
            </aside>

            {/* 질문 목록 섹션 */}
            <section className="flex-1 w-full">
              {children}
            </section>
          </div>
        </main>
      </div>
    </SearchContext.Provider>
  );
}
