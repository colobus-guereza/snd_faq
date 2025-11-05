"use client";

import { useRouter } from "next/navigation";
import { FAQ, Category } from "@/types/faq";

interface FAQListProps {
  faqs: FAQ[];
  selectedCategory: Category;
}

export default function FAQList({ faqs, selectedCategory }: FAQListProps) {
  const router = useRouter();

  if (faqs.length === 0) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">표시할 질문이 없습니다.</p>
      </div>
    );
  }

  const handleFAQClick = (faqId: string) => {
    // 현재 카테고리 정보를 URL에 포함해서 이동
    const categoryParam = encodeURIComponent(selectedCategory);
    router.push(`/faq/${faqId}?category=${categoryParam}`);
  };

  return (
    <div className="w-full space-y-0">
      {faqs.map((faq) => (
        <div
          key={faq.id}
          onClick={() => handleFAQClick(faq.id)}
          className="cursor-pointer py-4 px-3 -mx-3 rounded-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-[#14B8A6] hover:shadow-[0_1px_3px_rgba(20,184,166,0.3)] hover:scale-[1.01]"
        >
          <div className="flex items-center gap-3">
            <span className="text-gray-900 dark:text-gray-100">
              Q
            </span>
            <h3 className="flex-1 text-gray-900 dark:text-gray-100 text-[15px] leading-relaxed">
              {faq.title}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}

