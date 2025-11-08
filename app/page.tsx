"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import FAQList from "@/components/FAQList";
import { useSearch } from "@/components/CommonLayout";
import { faqs } from "@/data/faqs";
import { FAQ, Category } from "@/types/faq";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const searchParams = useSearchParams();
  const { searchQuery } = useSearch();
  const { language, getFAQ } = useLanguage();
  
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
  const selectedCategory = getValidCategory(searchParams.get("category"));
  
  // 선택된 태그 가져오기
  const selectedTag = searchParams.get("tag");

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
      result = faqs.filter((faq) => faq.category === selectedCategory);
      // 가나다순으로 정렬 (번역된 제목 기준)
      result.sort((a, b) => {
        const titleA = getFAQ(a.id)?.title || a.title;
        const titleB = getFAQ(b.id)?.title || b.title;
        return titleA.localeCompare(titleB, "ko");
      });
    }

    // 태그 필터링 적용
    if (selectedTag) {
      result = result.filter((faq) => {
        const translatedFAQ = getFAQ(faq.id);
        const tagsToCheck = translatedFAQ ? translatedFAQ.tags : faq.tags;
        return tagsToCheck && tagsToCheck.includes(selectedTag);
      });
      // 태그 필터링 후에도 가나다순 정렬 유지
      result.sort((a, b) => {
        const titleA = getFAQ(a.id)?.title || a.title;
        const titleB = getFAQ(b.id)?.title || b.title;
        return titleA.localeCompare(titleB, "ko");
      });
    }

    return result;
  }, [searchQuery, selectedCategory, selectedTag, fuse, language, getFAQ]);

  return (
    <FAQList faqs={filteredFaqs} selectedCategory={selectedCategory} />
  );
}
