"use client";

import Link from "next/link";
import { FAQ } from "@/types/faq";

interface FAQDetailProps {
  faq: FAQ;
  returnCategory?: string;
}

export default function FAQDetail({ faq, returnCategory }: FAQDetailProps) {
  const backHref = returnCategory 
    ? `/?category=${encodeURIComponent(returnCategory)}`
    : "/";
  
  // "문의/제안" 카테고리 질문(id: "7")은 뒤로가기 버튼 숨김
  const isInquiryPage = faq.id === "7";
  
  // "문의/제안" 카테고리 질문은 타이틀 변경
  const displayTitle = isInquiryPage ? "문의와 제안" : faq.title;

  return (
    <div className="w-full">
      {!isInquiryPage && (
        <Link
          href={backHref}
          prefetch={true}
          className="mb-6 inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
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
        </Link>
      )}

      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
        {displayTitle}
      </h1>

      {!isInquiryPage && faq.tags && faq.tags.length > 0 && (
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
          {isInquiryPage ? (
            // "문의/제안" 페이지는 특별한 렌더링
            <div className="flex flex-col gap-3">
              {faq.content.split("\n").map((line, index) => (
                <p key={index} className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {line}
                </p>
              ))}
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                - 유튜브: <a
                  href="https://www.youtube.com/@sndhandpanofficial2990"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#14B8A6] transition-colors underline"
                >
                  https://www.youtube.com/@sndhandpanofficial2990
                </a>
              </p>
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                - 인스타: <a
                  href="https://www.instagram.com/snd_handpan_official/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#14B8A6] transition-colors underline"
                >
                  https://www.instagram.com/snd_handpan_official/
                </a>
              </p>
            </div>
          ) : (
            // 일반 페이지는 기존 방식 유지
            faq.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {paragraph}
              </p>
            ))
          )}
        </div>
      )}

      {!faq.content && (
        <p className="text-gray-500 dark:text-gray-400">내용이 준비되지 않았습니다.</p>
      )}
    </div>
  );
}
