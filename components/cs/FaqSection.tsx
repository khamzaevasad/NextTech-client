"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_FAQS } from "@/apollo/user/user-query";
import { EmptyState } from "@/components/web/EmptyState";
import { MessageCircleQuestion } from "lucide-react";
import { FaqSearch } from "./FaqSearch";
import { FaqCategoryTabs } from "./FaqCategoryTabs";
import { FaqList } from "./FaqList";
import { LoadingBar } from "../web/LoadingBar";
import { Faq } from "@/lib/types/faq/faq";
import { FaqCategory } from "@/lib/enums/faq.enum";

export function FaqSection() {
  const [activeCategory, setActiveCategory] = useState<FaqCategory>("GENERAL");
  const [searchQuery, setSearchQuery] = useState("");

  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */
  const { data, loading } = useQuery(GET_FAQS, {
    fetchPolicy: "cache-and-network",
    variables: {
      input: {
        page: 1,
        limit: 20,
        search: { faqCategory: activeCategory },
      },
    },
  });

  const allFaqs = data?.getFaqs?.list ?? [];

  const filteredFaqs = searchQuery.trim()
    ? allFaqs.filter((faq: Faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : allFaqs;

  return (
    <>
      <LoadingBar loading={loading} />
      <div className="space-y-6 flex items-center flex-col">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-1">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-muted-foreground">
            Find answers to common questions
          </p>
        </div>

        {/* Search */}
        <FaqSearch value={searchQuery} onChange={setSearchQuery} />

        {/* Category Tabs */}
        <FaqCategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* FAQ List */}
        {!loading && filteredFaqs.length === 0 ? (
          <EmptyState
            icon={<MessageCircleQuestion className="h-12 w-12" />}
            title="No questions found"
          />
        ) : (
          <FaqList faqs={filteredFaqs} />
        )}
      </div>
    </>
  );
}
