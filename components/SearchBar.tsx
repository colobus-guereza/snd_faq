"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  hasResults: boolean;
}

export default function SearchBar({
  value,
  onChange,
  hasResults,
}: SearchBarProps) {
  return (
    <div className="w-full">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="검색어를 입력하세요"
          className="w-full rounded-lg border border-gray-300 bg-white py-3.5 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      {value && !hasResults && (
        <p className="mt-3 text-center text-sm text-gray-500">
          검색 결과가 없습니다.
        </p>
      )}
    </div>
  );
}

