"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const currentTheme = resolvedTheme || theme || "light";
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  const handleLanguageClick = (lang: "ko" | "en") => {
    setLanguage(lang);
  };

  if (!mounted) {
    return null;
  }

  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative h-6 w-6 rounded-full bg-[#14B8A6]">
              <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white dark:bg-gray-900"></div>
            </div>
            <a
              href="https://handpan.co.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-gray-700 dark:text-gray-300 no-underline hover:no-underline cursor-pointer"
            >
              Sound & Design
            </a>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <button
                type="button"
                className={`text-sm transition-colors ${
                  language === "ko"
                    ? "font-bold text-gray-900 dark:text-gray-100"
                    : "font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
                onClick={() => handleLanguageClick("ko")}
              >
                한국어
              </button>
              <span className="text-sm text-gray-400 dark:text-gray-600">/</span>
              <button
                type="button"
                className={`text-sm transition-colors ${
                  language === "en"
                    ? "font-bold text-gray-900 dark:text-gray-100"
                    : "font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
                onClick={() => handleLanguageClick("en")}
              >
                English
              </button>
            </div>
            <button
              type="button"
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={toggleTheme}
              aria-label={t("테마 전환")}
            >
              {(resolvedTheme || theme) === "dark" ? (
                // Sun icon (라이트 모드로 전환)
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
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                // Moon icon (다크 모드로 전환)
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
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
