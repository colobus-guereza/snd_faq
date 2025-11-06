"use client";

import Link from "next/link";
import { FAQ, Category } from "@/types/faq";
import { useLanguage } from "@/contexts/LanguageContext";

interface FAQListProps {
  faqs: FAQ[];
  selectedCategory: Category;
}

export default function FAQList({ faqs, selectedCategory }: FAQListProps) {
  const { t, getFAQ } = useLanguage();
  
  if (faqs.length === 0) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">{t("표시할 질문이 없습니다.")}</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-0">
      {faqs.map((faq) => {
        const categoryParam = encodeURIComponent(selectedCategory);
        const href = `/faq/${faq.id}?category=${categoryParam}`;
        
        // 영어일 경우 번역된 FAQ 데이터 사용
        const translatedFAQ = getFAQ(faq.id);
        const displayTitle = translatedFAQ ? translatedFAQ.title : faq.title;
        
        return (
          <Link
            key={faq.id}
            href={href}
            prefetch={true}
            className="block py-4 px-3 -mx-3 rounded-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-[#14B8A6] hover:shadow-[0_1px_3px_rgba(20,184,166,0.3)] hover:scale-[1.01]"
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-900 dark:text-gray-100">
                Q
              </span>
              <h3 className="flex-1 text-gray-900 dark:text-gray-100 text-[15px] leading-relaxed">
                {displayTitle}
              </h3>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

