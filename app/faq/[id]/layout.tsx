"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import CategoryMenu from "@/components/CategoryMenu";
import { useState } from "react";
import { Category } from "@/types/faq";

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("질문 Top 10");

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    router.push("/");
  };

  const handleTitleClick = () => {
    setSearchQuery("");
    setSelectedCategory("질문 Top 10");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 
          onClick={handleTitleClick}
          className="mb-10 text-left text-4xl font-bold text-gray-900 dark:text-gray-100 cursor-pointer hover:text-[#14B8A6] transition-colors"
        >
          자주묻는 질문
        </h1>

        <div className="mb-10 flex justify-center">
          <div className="w-full max-w-2xl">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              hasResults={true}
            />
          </div>
        </div>

        <div className="flex flex-row gap-12 items-start">
          <aside className="w-[125px] shrink-0">
            <CategoryMenu
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />
          </aside>

          <section className="flex-1">
            {children}
          </section>
        </div>
      </main>
    </div>
  );
}
