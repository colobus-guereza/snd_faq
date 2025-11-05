"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import CategoryMenu from "@/components/CategoryMenu";
import FAQList from "@/components/FAQList";
import { faqs, top10QuestionIds } from "@/data/faqs";
import { FAQ, Category } from "@/types/faq";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("질문 Top 10");

  // Fuse.js 설정
  const fuse = useMemo(
    () =>
      new Fuse(faqs, {
        keys: ["title"],
        threshold: 0.3,
        includeScore: true,
      }),
    []
  );

  // 필터링된 FAQ 목록
  const filteredFaqs = useMemo(() => {
    let result: FAQ[] = [];

    // 검색어가 있으면 검색 결과 사용
    if (searchQuery.trim()) {
      const searchResults = fuse.search(searchQuery);
      result = searchResults.map((item) => item.item);
    } else {
      // 검색어가 없으면 카테고리별 필터링
      if (selectedCategory === "질문 Top 10") {
        // Top 10 질문 ID 리스트를 순서대로 필터링
        result = top10QuestionIds
          .map((id) => faqs.find((faq) => faq.id === id))
          .filter((faq): faq is FAQ => faq !== undefined);
      } else {
        result = faqs.filter((faq) => faq.category === selectedCategory);
        // 조회수 순으로 정렬
        result.sort((a, b) => b.views - a.views);
      }
    }

    return result;
  }, [searchQuery, selectedCategory, fuse]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 
          onClick={() => router.push("/")}
          className="mb-10 text-left text-4xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
        >
          자주묻는 질문
        </h1>

        <div className="mb-10 flex justify-center">
          <div className="w-full max-w-2xl">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              hasResults={filteredFaqs.length > 0}
            />
          </div>
        </div>

        <div className="flex flex-row gap-12 items-start">
          <aside className="w-[125px] shrink-0">
            <CategoryMenu
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </aside>

          <section className="flex-1">
            <FAQList faqs={filteredFaqs} />
          </section>
        </div>
      </main>
    </div>
  );
}
