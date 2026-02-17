"use client";
import { GET_STORES } from "@/apollo/user/user-query";
import { Input } from "@/components/ui/input";
import StoreCard from "@/components/web/StoreCard";
import { Direction } from "@/lib/enums/comment.enum";
import { StoresInquiry } from "@/lib/types/store/store.input";
import { useMutation, useQuery } from "@apollo/client";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SortOption, T } from "@/lib/types/common";
import { cn } from "@/lib/utils";
import { LoadingBar } from "@/components/web/LoadingBar";
import { LIKE_TARGET_STORE } from "@/apollo/user/user-mutation";
import { Message } from "@/lib/enums/common.enum";
import { toast } from "sonner";

const SORT_OPTIONS: SortOption[] = [
  { label: "Newest First", value: "createdAt" },
  { label: "Recently Updated", value: "updatedAt" },
  { label: "Most Viewed", value: "storeViews" },
  { label: "Most Liked", value: "storeLikes" },
];

export default function StorePage() {
  const [filters, setFilters] = useState<StoresInquiry>({
    page: 1,
    limit: 12,
    sort: "createdAt",
    direction: Direction.DESC,
    search: {},
  });
  const [searchText, setSearchText] = useState(filters.search.text || "");

  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */
  const [likeTargetStore] = useMutation(LIKE_TARGET_STORE, {});

  const {
    data: storeData,
    loading: storeLoading,
    refetch: storeRefetch,
  } = useQuery(GET_STORES, {
    variables: {
      input: filters,
    },
    fetchPolicy: "cache-and-network",
  });

  const stores = storeData?.getStores?.list || [];

  const totalStores =
    storeData?.getStores?.metaCounter?.[0]?.total ?? stores.length;

  const totalPages = Math.ceil(totalStores / filters.limit);

  /* -------------------------------------------------------------------------- */
  /*                                  HANDLERS                                  */
  /* -------------------------------------------------------------------------- */

  const likeStoreHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

      await likeTargetStore({
        variables: {
          input: id,
        },
      });

      await storeRefetch({ input: filters });
      toast("success");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log("likeStoreHandler error", err.message);
        toast(err.message);
      } else {
        toast("Unexpected error occurred");
      }
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    setFilters((prev) => ({
      ...prev,
      page: 1,
      search: {
        ...prev.search,
        text: value.trim() || undefined,
      },
    }));
  };

  const handleClearSearch = () => {
    setSearchText("");
    setFilters((prev) => ({
      ...prev,
      page: 1,
      search: {
        ...prev.search,
        text: undefined,
      },
    }));
  };

  const handleSortChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      sort: value,
      direction: Direction.DESC,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <LoadingBar loading={storeLoading} />
      <div className="my-8 space-y-6">
        {/* FILTERS SECTION */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search Filter */}
          <div className="space-y-2 w-full sm:w-96">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search Store by name..."
                value={searchText}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 pr-9 h-10 bg-background border-border focus:border-pink-500 focus:ring-pink-500 transition-colors"
              />
              {searchText && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {searchText && (
              <p className="text-xs text-muted-foreground">
                Searching for:{" "}
                <span className="text-pink-500 font-medium">{searchText}</span>
              </p>
            )}
          </div>

          {/* Sort Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Sort by:
            </span>
            <Select value={filters.sort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full sm:w-45 h-10 border-border focus:border-pink-500 focus:ring-pink-500">
                <SelectValue placeholder="Select sort" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-950/20"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Info */}
        {totalStores > 0 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>
              Showing{" "}
              {stores.length > 0 ? (filters.page - 1) * filters.limit + 1 : 0}-
              {Math.min(filters.page * filters.limit, totalStores)} of{" "}
              {totalStores} stores
            </p>
            <p>
              Page {filters.page} of {totalPages || 1}
            </p>
          </div>
        )}

        {/* STORES GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-3">
          {stores.length > 0 ? (
            stores.map((store) => (
              <StoreCard
                likeStoreHandler={likeStoreHandler}
                key={store._id}
                store={store}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">
                {searchText
                  ? `No stores found for "${searchText}"`
                  : "No stores available"}
              </p>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={filters.page === 1}
              onClick={() => handlePageChange(filters.page - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={filters.page === p ? "default" : "outline"}
                className={cn(
                  "w-10 h-10",
                  filters.page === p && "bg-pink-500 hover:bg-pink-600",
                )}
                onClick={() => handlePageChange(p)}
              >
                {p}
              </Button>
            ))}

            <Button
              variant="outline"
              size="icon"
              disabled={filters.page === totalPages}
              onClick={() => handlePageChange(filters.page + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
