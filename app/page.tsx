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

  // 검색 가능한 FAQ 데이터 준비 (번역된 내용 포함)
  const searchableFaqs = useMemo(() => {
    return faqs.map((faq) => {
      const translatedFAQ = getFAQ(faq.id);
      return {
        ...faq,
        // 번역된 제목, 태그, 본문을 검색 가능한 필드로 추가
        searchTitle: translatedFAQ?.title || faq.title,
        searchTags: translatedFAQ?.tags || faq.tags || [],
        searchContent: translatedFAQ?.content || faq.content || "",
        // 원본도 유지 (태그는 배열로 병합)
        originalTags: faq.tags || [],
      };
    });
  }, [language, getFAQ]);

  // Fuse.js 설정 - 제목, 태그, 본문 모두 검색 가능
  const fuse = useMemo(
    () =>
      new Fuse(searchableFaqs, {
        keys: [
          { name: "searchTitle", weight: 0.5 }, // 제목에 높은 가중치
          { name: "searchTags", weight: 0.3 },   // 태그에 중간 가중치
          { name: "searchContent", weight: 0.2 }, // 본문에 낮은 가중치
        ],
        threshold: 0.5, // 검색 민감도 조정 (높을수록 관대함, 0.5는 중간 정도)
        minMatchCharLength: 2, // 최소 매칭 문자 길이 (2글자 이상)
        includeScore: true,
        // 태그 배열 검색을 위한 설정
        getFn: (obj, path) => {
          if (path === "searchTags") {
            return Array.isArray(obj.searchTags) ? obj.searchTags.join(" ") : "";
          }
          if (path === "searchContent") {
            // 본문 내용을 문자열로 반환 (null/undefined 처리)
            return obj.searchContent || "";
          }
          return obj[path as keyof typeof obj] || "";
        },
        // 부분 일치 검색 활성화
        ignoreLocation: true, // 위치 무시하고 전체 텍스트에서 검색
        findAllMatches: true, // 모든 일치 항목 찾기
      }),
    [searchableFaqs]
  );

  // 필터링된 FAQ 목록
  const filteredFaqs = useMemo(() => {
    let result: FAQ[] = [];

    // 검색어가 있으면 검색 결과 사용
    if (searchQuery.trim()) {
      const searchResults = fuse.search(searchQuery);
      // 검색 결과에서 원본 FAQ 객체 추출 (id로 매칭)
      result = searchResults.map((item) => {
        const searchableFaq = item.item;
        // 원본 FAQ 찾기
        return faqs.find((faq) => faq.id === searchableFaq.id) || searchableFaq;
      }).filter((faq): faq is FAQ => faq !== undefined);
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
