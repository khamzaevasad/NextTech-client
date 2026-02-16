"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import {
  ProductsInquiry,
  SpecFilterInput,
} from "@/lib/types/product/product.input";
import { PRICE_RANGE } from "@/lib/config";
import { GET_FILTER_OPTIONS } from "@/apollo/user/user-query";
import { Category } from "@/lib/types/category/category";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterOptions {
  brands: string[];
  specOptions: Record<string, string[]>;
  filterKeys: string[];
}

interface ProductFilterProps {
  filters: ProductsInquiry;
  onFilterChange: (filters: ProductsInquiry) => void;
  categories: Category[];
  categoryId?: string;
  className?: string;
}

const SPEC_LABELS: Record<string, string> = {
  processor: "Processor",
  cpu: "CPU",
  gpu: "Graphics Card",
  ram: "RAM",
  storage: "Storage",
  display: "Display",
  refreshRate: "Refresh Rate",
};

export function ProductFilter({
  filters,
  onFilterChange,
  categories,
  categoryId,
  className,
}: ProductFilterProps) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [priceRange, setPriceRange] = useState([
    filters.search.priceRange?.start || PRICE_RANGE.min,
    filters.search.priceRange?.end || PRICE_RANGE.max,
  ]);
  const [searchText, setSearchText] = useState(filters.search.text || "");

  // Spec filter
  const { data: filterOptionsData, loading: filterOptionsLoading } = useQuery<{
    getFilterOptions: FilterOptions;
  }>(GET_FILTER_OPTIONS, { variables: { categoryId }, skip: !categoryId });

  const filterOptions = filterOptionsData?.getFilterOptions || {
    brands: [],
    specOptions: {},
    filterKeys: [],
  };

  // update filter
  const handlePriceCommit = (values: number[]) => {
    updateFilters({ priceRange: { start: values[0], end: values[1] } });
  };

  const updateFilters = (searchUpdates: Partial<ProductsInquiry["search"]>) => {
    const newFilters = {
      ...localFilters,
      search: { ...localFilters.search, ...searchUpdates },
      page: 1,
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSpecToggle = (key: string, value: string) => {
    const currentSpecs = localFilters.search.specs || [];
    const specIndex = currentSpecs.findIndex((s) => s.key === key);
    let newSpecs: SpecFilterInput[];

    if (specIndex === -1) {
      newSpecs = [...currentSpecs, { key, values: [value] }];
    } else {
      const spec = currentSpecs[specIndex];
      const newValues = spec.values.includes(value)
        ? spec.values.filter((v) => v !== value)
        : [...spec.values, value];
      newSpecs =
        newValues.length === 0
          ? currentSpecs.filter((_, i) => i !== specIndex)
          : currentSpecs.map((s, i) =>
              i === specIndex ? { ...s, values: newValues } : s,
            );
    }
    updateFilters({ specs: newSpecs.length ? newSpecs : undefined });
  };

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    if (value.trim()) {
      updateFilters({ text: value.trim() });
    } else {
      updateFilters({ text: undefined });
    }
  };

  const handleClearSearch = () => {
    setSearchText("");
    updateFilters({ text: undefined });
  };

  const parents = categories.filter((c) => !c.parentId);

  return (
    <aside
      className={cn(
        "space-y-6 bg-background/50 p-4 rounded-xl border",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2 font-bold text-lg">
          <SlidersHorizontal className="w-5 h-5" /> Filters
        </div>
        {(filters.search.categoryId ||
          filters.search.priceRange ||
          filters.search.text) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchText("");
              setPriceRange([PRICE_RANGE.min, PRICE_RANGE.max]);
              onFilterChange({ ...filters, page: 1, search: {} });
            }}
          >
            Clear
          </Button>
        )}
      </div>

      {/* SEARCH INPUT */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">
          Search Products
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by product name..."
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

      {/* 1. CATEGORIES IERARXIYA */}
      <div className="space-y-2 pt-4 border-t">
        <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">
          Categories
        </h3>
        <Accordion type="single" collapsible className="w-full border-none">
          <div
            onClick={() => updateFilters({ categoryId: undefined })}
            className={cn(
              "py-2 px-2 text-sm cursor-pointer rounded-md transition-colors",
              !categoryId
                ? "bg-pink-500/10 text-pink-500 font-bold"
                : "hover:bg-accent",
            )}
          >
            All Products
          </div>
          {parents.map((parent) => {
            const children = categories.filter(
              (c) => c.parentId === parent._id,
            );
            const isActive =
              categoryId === parent._id ||
              children.some((c) => c._id === categoryId);

            return (
              <AccordionItem
                key={parent._id}
                value={parent._id}
                className="border-none"
              >
                <div className="flex items-center">
                  {children.length > 0 ? (
                    <AccordionTrigger className="p-2 hover:no-underline flex-1 text-sm">
                      <span
                        className={cn(isActive && "text-pink-500 font-medium")}
                      >
                        {parent.categoryName}
                      </span>
                    </AccordionTrigger>
                  ) : (
                    <div
                      onClick={() => updateFilters({ categoryId: parent._id })}
                      className={cn(
                        "p-2 text-sm flex-1 cursor-pointer",
                        categoryId === parent._id && "text-pink-500 font-bold",
                      )}
                    >
                      {parent.categoryName}
                    </div>
                  )}
                </div>
                <AccordionContent className="pl-4 pb-1">
                  <div className="flex flex-col gap-1 border-l ml-2 pl-3">
                    {children.map((child) => (
                      <div
                        key={child._id}
                        onClick={() => updateFilters({ categoryId: child._id })}
                        className={cn(
                          "py-1.5 text-sm cursor-pointer hover:text-pink-500 transition-all",
                          categoryId === child._id
                            ? "text-pink-500 font-bold"
                            : "text-muted-foreground",
                        )}
                      >
                        {child.categoryName}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      {/* 2. PRICE FILTER */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-semibold text-sm uppercase text-muted-foreground">
          Price Range
        </h3>
        <div className="flex gap-2">
          <Input
            type="number"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
            onBlur={() => handlePriceCommit(priceRange)}
            className="h-8"
          />
          <Input
            type="number"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
            onBlur={() => handlePriceCommit(priceRange)}
            className="h-8"
          />
        </div>
        <Slider
          min={PRICE_RANGE.min}
          max={PRICE_RANGE.max}
          step={100}
          value={priceRange}
          onValueChange={setPriceRange}
          onValueCommit={handlePriceCommit}
          className="py-4"
        />
      </div>

      {/* 3. DYNAMIC SPECS */}
      {!filterOptionsLoading &&
        filterOptions.filterKeys.map((key) => (
          <div key={key} className="pt-4 border-t space-y-3">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground">
              {SPEC_LABELS[key] || key}
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {filterOptions.specOptions[key]?.map((opt) => (
                <div key={opt} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${key}-${opt}`}
                    checked={localFilters.search.specs
                      ?.find((s) => s.key === key)
                      ?.values.includes(opt)}
                    onCheckedChange={() => handleSpecToggle(key, opt)}
                  />
                  <Label
                    htmlFor={`${key}-${opt}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {opt}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ))}
    </aside>
  );
}
