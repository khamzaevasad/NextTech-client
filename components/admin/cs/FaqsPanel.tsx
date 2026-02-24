"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, RefreshCw } from "lucide-react";
import { FaqCategory } from "@/lib/enums/faq.enum";
import { Faq } from "@/lib/types/faq/faq";
import { GET_FAQS_BY_ADMIN } from "@/apollo/admin/admin-query";
import FaqTable from "./FaqTable";
import FaqFormModal from "./FaqFormModal";

const LIMIT = 15;

const FAQ_CATEGORIES: Array<{ value: FaqCategory | "ALL"; label: string }> = [
  { value: "ALL", label: "All Categories" },
  { value: "GENERAL", label: "General" },
  { value: "PAYMENT", label: "Payment" },
  { value: "ACCOUNT", label: "Account" },
  { value: "SERVICE", label: "Service" },
  { value: "SELLER", label: "Seller" },
];

export default function FaqsPanel() {
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<FaqCategory | "ALL">(
    "ALL",
  );
  const [editFaq, setEditFaq] = useState<Faq | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { data, loading, refetch } = useQuery(GET_FAQS_BY_ADMIN, {
    variables: {
      input: {
        page,
        limit: LIMIT,
        search: categoryFilter !== "ALL" ? { faqCategory: categoryFilter } : {},
      },
    },
    fetchPolicy: "cache-and-network",
  });

  const faqs: Faq[] = data?.getFaqsByAdmin?.list ?? [];
  const total: number = data?.getFaqsByAdmin?.metaCounter?.total ?? 0;

  const handleFilterChange = (val: string) => {
    setCategoryFilter(val as FaqCategory | "ALL");
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Select value={categoryFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-44 h-9">
              <SelectValue placeholder="Filter category" />
            </SelectTrigger>
            <SelectContent>
              {FAQ_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => refetch()}
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <Button
          size="sm"
          className="h-9 gap-1.5"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New FAQ
        </Button>
      </div>

      {/* Table */}
      <FaqTable
        faqs={faqs}
        total={total}
        page={page}
        limit={LIMIT}
        onPageChange={setPage}
        onEdit={(faq) => setEditFaq(faq)}
        loading={loading}
      />

      {/* Modals */}
      <FaqFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={refetch}
      />
      <FaqFormModal
        open={!!editFaq}
        onClose={() => setEditFaq(null)}
        faq={editFaq}
        onSuccess={refetch}
      />
    </div>
  );
}
