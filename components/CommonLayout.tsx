"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState, createContext, useContext, useMemo } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import CategoryMenu from "@/components/CategoryMenu";
import CategorySelectorMobile from "@/components/CategorySelectorMobile";
import { Category } from "@/types/faq";
import { categoryDirectLinkMap, categories, getAllTags } from "@/data/faqs";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // 메인 페이지인지 확인
  const isHomePage = pathname === "/";
  
  // 카테고리 타입 검증 함수
  const getValidCategory = (categoryParam: string | null): Category => {
    const validCategories: Category[] = [
      "기술특징",
      "튜닝리튠",
      "관리보관",
      "파손수리",
      "교육레슨",
      "결제배송",
    ];
    if (categoryParam && validCategories.includes(categoryParam as Category)) {
      return categoryParam as Category;
    }
    return "기술특징";
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

  // 선택된 태그 상태 관리 (URL 쿼리 파라미터에서 가져오기)
  const selectedTag = searchParams.get("tag");

  // 모든 태그 목록
  const allTags = useMemo(() => getAllTags(), []);

  // 태그 클릭 핸들러
  const handleTagClick = (tag: string) => {
    const categoryParam = searchParams.get("category");
    // 같은 태그를 다시 클릭하면 필터 해제
    if (selectedTag === tag) {
      if (categoryParam) {
        router.push(`/?category=${encodeURIComponent(categoryParam)}`);
      } else {
        router.push(`/`);
      }
    } else {
      // 현재 카테고리 정보를 유지하면서 태그 파라미터 추가
      if (categoryParam) {
        router.push(`/?category=${encodeURIComponent(categoryParam)}&tag=${encodeURIComponent(tag)}`);
      } else {
        router.push(`/?tag=${encodeURIComponent(tag)}`);
      }
    }
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    
    // 특정 카테고리는 바로 질문 페이지로 이동
    const directLinkQuestionId = categoryDirectLinkMap[category];
    if (directLinkQuestionId) {
      router.push(`/faq/${directLinkQuestionId}?category=${encodeURIComponent(category)}`);
      return;
    }
    
    // 일반 카테고리는 메인 페이지로 이동하면서 카테고리 정보 전달 (태그 필터 제거)
    router.push(`/?category=${encodeURIComponent(category)}`);
  };

  const handleTitleClick = () => {
    setSearchQuery("");
    setSelectedCategory("기술특징");
    router.push("/?category=기술특징");
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    // 검색어 입력 시 메인 페이지로 이동하여 검색 실행 (태그 필터 유지)
    if (!isHomePage) {
      const tagParam = searchParams.get("tag");
      if (tagParam) {
        router.push(`/?tag=${encodeURIComponent(tagParam)}`);
      } else {
        router.push("/");
      }
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
              suppressHydrationWarning
            >
              {mounted ? t("자주묻는 질문") : "자주묻는 질문"}
            </h1>
            <button
              onClick={handleShareClick}
              className="flex-shrink-0 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label={mounted ? t("링크 공유하기") : "링크 공유하기"}
              title={copied ? (mounted ? t("복사됨!") : "복사됨!") : (mounted ? t("링크 공유하기") : "링크 공유하기")}
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

          {/* 태그 필터 구현했으나 추후 사용 예정으로 현재 비활성화 */}
          {/* 태그 버튼 영역 - 검색바 아래, 카테고리/질문리스트 위 */}
          {/* {isHomePage && allTags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {allTags.map((tag) => {
                const isSelected = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isSelected
                        ? "bg-[#14B8A6] text-white shadow-md hover:bg-[#0d9488]"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          )} */}

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
