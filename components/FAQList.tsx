"use client";

import { useRouter } from "next/navigation";
import { FAQ } from "@/types/faq";

interface FAQListProps {
  faqs: FAQ[];
}

export default function FAQList({ faqs }: FAQListProps) {
  const router = useRouter();

  if (faqs.length === 0) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-gray-500">표시할 질문이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-0">
      {faqs.map((faq) => (
        <div
          key={faq.id}
          onClick={() => router.push(`/faq/${faq.id}`)}
          className="cursor-pointer py-4 transition-colors hover:text-blue-600"
        >
          <div className="flex items-center gap-3">
            <span className="text-gray-900">
              Q
            </span>
            <h3 className="flex-1 text-gray-900 text-[15px] leading-relaxed">
              {faq.title}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}

