"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  hasResults: boolean;
}

export default function SearchBar({
  value,
  onChange,
  onKeyDown,
  hasResults,
}: SearchBarProps) {
  return (
    <div className="w-full">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
          <svg
            className="h-5 w-5 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
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
          onKeyDown={onKeyDown}
          placeholder="검색어를 입력하세요"
          className="w-full border-0 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 py-3.5 pl-8 pr-4 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-b-2 focus:border-blue-500 dark:focus:border-[#14B8A6]"
        />
      </div>
    </div>
  );
}

