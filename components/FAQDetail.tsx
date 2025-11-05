"use client";

import { useRouter } from "next/navigation";
import { FAQ } from "@/types/faq";

interface FAQDetailProps {
  faq: FAQ;
}

export default function FAQDetail({ faq }: FAQDetailProps) {
  const router = useRouter();

  return (
    <div className="w-full">
      <button
        onClick={() => router.push("/")}
        className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
      >
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span className="text-sm font-medium">질문 목록</span>
      </button>

      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
        {faq.title}
      </h1>

      {faq.tags && faq.tags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {faq.tags.map((tag, index) => (
            <span
              key={index}
              className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {faq.content && (
        <div className="prose prose-sm max-w-none">
          {faq.content.split("\n\n").map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      )}

      {!faq.content && (
        <p className="text-gray-500 dark:text-gray-400">내용이 준비되지 않았습니다.</p>
      )}
    </div>
  );
}
