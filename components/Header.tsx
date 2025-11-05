"use client";

import { useState } from "react";

type Language = "한국어" | "English";

export default function Header() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("한국어");

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative h-6 w-6 rounded-full bg-blue-600">
              <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"></div>
            </div>
            <span className="text-sm font-medium text-gray-700">
              고객센터
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <button
                type="button"
                className={`text-sm transition-colors ${
                  selectedLanguage === "한국어"
                    ? "font-bold text-gray-900"
                    : "font-medium text-gray-700 hover:text-gray-900"
                }`}
                onClick={() => setSelectedLanguage("한국어")}
              >
                한국어
              </button>
              <span className="text-sm text-gray-400">/</span>
              <button
                type="button"
                className={`text-sm transition-colors ${
                  selectedLanguage === "English"
                    ? "font-bold text-gray-900"
                    : "font-medium text-gray-700 hover:text-gray-900"
                }`}
                onClick={() => setSelectedLanguage("English")}
              >
                English
              </button>
            </div>
            <button
              type="button"
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => {
                // TODO: 라이트/다크 모드 전환 기능 구현 예정
              }}
              aria-label="테마 전환"
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
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

