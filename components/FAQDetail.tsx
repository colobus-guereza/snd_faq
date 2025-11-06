"use client";

import Link from "next/link";
import { FAQ } from "@/types/faq";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FAQDetailProps {
  faq: FAQ;
  returnCategory?: string;
}

export default function FAQDetail({ faq, returnCategory }: FAQDetailProps) {
  const { language, t, getFAQ } = useLanguage();
  const backHref = returnCategory 
    ? `/?category=${encodeURIComponent(returnCategory)}`
    : "/";
  
  // "문의/제안" 카테고리 질문(id: "7")은 뒤로가기 버튼 숨김
  const isInquiryPage = faq.id === "7";
  
  // 영어일 경우 번역된 FAQ 데이터 사용
  const translatedFAQ = getFAQ(faq.id);
  
  // "문의/제안" 카테고리 질문은 타이틀 변경
  const displayTitle = isInquiryPage 
    ? t("문의와 제안")
    : (translatedFAQ ? translatedFAQ.title : faq.title);
  
  // 번역된 내용 사용
  const displayContent = translatedFAQ ? translatedFAQ.content : faq.content;
  const displayTags = translatedFAQ ? translatedFAQ.tags : faq.tags;
  
  // URL 복사 상태 관리
  const [copied, setCopied] = useState(false);
  
  // 현재 페이지 URL 복사 함수
  const handleShareClick = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      // 2초 후 복사 완료 메시지 숨김
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("URL 복사 실패:", err);
      // 클립보드 API가 지원되지 않는 경우 대체 방법
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
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
          <span className="text-sm font-medium">{t("질문 목록")}</span>
        </Link>
      )}

      <div className="mb-4 flex items-center gap-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {displayTitle}
        </h1>
        <button
          onClick={handleShareClick}
          className="flex-shrink-0 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label={t("링크 공유하기")}
          title={copied ? t("복사됨!") : t("링크 공유하기")}
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

      {!isInquiryPage && displayTags && displayTags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {displayTags.map((tag: string, index: number) => (
            <span
              key={index}
              className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {displayContent && (
        <div className="prose prose-sm max-w-none">
          {isInquiryPage ? (
            // "문의/제안" 페이지는 특별한 렌더링
            <div className="flex flex-col gap-3">
              {displayContent.split("\n").map((line: string, index: number) => (
                <p key={index} className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {line}
                </p>
              ))}
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                · {t("유튜브")}: <a
                  href="https://www.youtube.com/@sndhandpanofficial2990"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#14B8A6] transition-colors underline"
                >
                  https://www.youtube.com/@sndhandpanofficial2990
                </a>
              </p>
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                · {t("인스타")}: <a
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
            displayContent.split("\n\n").map((paragraph: string, index: number) => (
              <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {paragraph}
              </p>
            ))
          )}
        </div>
      )}

      {!displayContent && (
        <p className="text-gray-500 dark:text-gray-400">{t("내용이 준비되지 않았습니다.")}</p>
      )}
    </div>
  );
}
