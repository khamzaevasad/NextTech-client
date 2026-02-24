"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { LoadingBar } from "@/components/web/LoadingBar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { CategorySearchPanel } from "@/components/admin/category/CategorySearchPanel";
import { CategoryTable } from "@/components/admin/category/CategoryTable";
import { CategoryFormModal } from "@/components/admin/category/CategoryFormModal";
import { Category } from "@/lib/types/category/category";
import { GET_CATEGORIES } from "@/apollo/user/user-query";
import {
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
} from "@/apollo/admin/admin-mutation";
import { CreateCategoryInput } from "@/lib/types/category/category.input";

const LIMIT = 10;

export default function CategoryPage() {
  const [searchText, setSearchText] = useState("");
  const [parentFilter, setParentFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  /* -------------------------------------------------------------------------- */
  /*                               APOLLO CLIENT                                */
  /* -------------------------------------------------------------------------- */

  const {
    data: categoryData,
    loading: categoryLoading,
    refetch: categoryRefetch,
  } = useQuery(GET_CATEGORIES, {
    variables: {
      input: {
        page,
        limit: LIMIT,
        search: {
          text: searchText || undefined,
          parentId:
            parentFilter === "ALL"
              ? undefined
              : parentFilter === "NULL"
                ? null
                : parentFilter,
        },
      },
    },
    fetchPolicy: "cache-and-network",
  });

  // Root categories
  const { data: rootCategoryData } = useQuery(GET_CATEGORIES, {
    variables: {
      input: {
        page: 1,
        limit: 100,
        search: { parentId: null },
      },
    },
    fetchPolicy: "cache-and-network",
  });

  const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY, {
    onCompleted: () => {
      toast.success("Category created successfully");
      categoryRefetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const [updateCategory, { loading: updating }] = useMutation(UPDATE_CATEGORY, {
    onCompleted: () => {
      toast.success("Category updated successfully");
      categoryRefetch();
    },
    onError: (err) => toast.error(err.message),
  });

  /* -------------------------------------------------------------------------- */
  /*                                  HANDLERS                                  */
  /* -------------------------------------------------------------------------- */

  const categories: Category[] = categoryData?.getCategories?.list || [];
  const totalCount =
    categoryData?.getCategories?.metaCounter?.[0]?.total || categories.length;
  const totalPages = Math.ceil(totalCount / LIMIT);

  const rootCategories: Category[] =
    rootCategoryData?.getCategories?.list || [];

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedCategory(null);
  };

  const handleSubmit = (input: CreateCategoryInput) => {
    if (selectedCategory) {
      updateCategory({
        variables: { input: { _id: selectedCategory._id, ...input } },
      });
    } else {
      createCategory({ variables: { input } });
    }
    handleFormClose();
  };

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <>
      <LoadingBar loading={categoryLoading} />
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">
            Category Management
          </h1>
          <CategorySearchPanel
            parentCategories={rootCategories}
            onSearch={(val) => {
              setSearchText(val);
              setPage(1);
            }}
            onParentChange={(val) => {
              setParentFilter(val);
              setPage(1);
            }}
          />
        </div>

        <div className="flex justify-end">
          <Button
            className="bg-pink-500 hover:bg-pink-600 text-white"
            onClick={() => setFormOpen(true)}
          >
            + New Category
          </Button>
        </div>

        <CategoryTable categories={categories} onEdit={handleEdit} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={page === p ? "default" : "outline"}
                className={cn(
                  "w-10 h-10",
                  page === p && "bg-pink-500 hover:bg-pink-600",
                )}
                onClick={() => handlePageChange(p)}
              >
                {p}
              </Button>
            ))}

            <Button
              variant="outline"
              size="icon"
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      <CategoryFormModal
        key={`category-${formOpen}-${selectedCategory?._id ?? "new"}`}
        open={formOpen}
        category={selectedCategory}
        parentCategories={rootCategories}
        onClose={handleFormClose}
        onSubmit={handleSubmit}
      />
    </>
  );
}
