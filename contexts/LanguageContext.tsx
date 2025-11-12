"use client";

import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from "react";
import uiTranslations from "@/data/translations.en.json";
import faqsEn from "@/data/faqs.en.json";

type Language = "ko" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  getFAQ: (id: string) => any | null; // FAQ 번역 데이터 가져오기
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // 항상 한국어로 고정
  const [language] = useState<Language>("ko");
  const [mounted, setMounted] = useState(false);

  // 브라우저에서만 실행
  useEffect(() => {
    setMounted(true);
    // 언어는 항상 한국어로 고정되므로 localStorage에서 읽지 않음
  }, []);

  // 언어 설정 함수 (사용하지 않음 - 항상 한국어 고정)
  const setLanguage = (lang: Language) => {
    // 언어는 항상 한국어로 고정되므로 변경하지 않음
  };

  // UI 텍스트 번역
  const t = (key: string): string => {
    if (language === "ko") {
      return key;
    }
    return (uiTranslations as Record<string, string>)[key] || key;
  };

  // FAQ 번역 데이터 가져오기
  const getFAQ = (id: string) => {
    if (language === "ko") {
      return null; // 한국어는 원본 사용
    }
    return faqsEn.find((faq: any) => faq.id === id) || null;
  };

  // 마운트 전에는 한국어 기본값 반환
  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ 
        language: "ko", 
        setLanguage, 
        t: (key: string) => key,
        getFAQ: () => null
      }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t,
      getFAQ 
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}

