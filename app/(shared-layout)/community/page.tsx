"use client";

import { useState } from "react";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import CommunityHeader from "@/components/community/CommunityHeader";
import ArticleGrid from "@/components/community/ArticleGrid";

export default function CommunityPage() {
  const [activeCategory, setActiveCategory] = useState("FREE");

  return (
    <div className="my-8">
      <CommunityHeader activeCategory={activeCategory} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <CommunitySidebar
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          <main className="flex-1">
            <ArticleGrid category={activeCategory} />
          </main>
        </div>
      </div>
    </div>
  );
}
