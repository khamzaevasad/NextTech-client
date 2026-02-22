"use client";

import { useState } from "react";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  _id: string;
  categoryName: string;
  categoryFilterKeys: string[];
  parentId: string | null;
  children?: Category[];
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onSelect: (categoryId: string, hasFilterKeys: boolean) => void;
}

export function CategorySelector({
  categories,
  selectedCategory,
  onSelect,
}: CategorySelectorProps) {
  const [expandedParent, setExpandedParent] = useState<string>("");

  // Get parent categories
  const parentCategories = categories.filter((cat) => !cat.parentId);

  // Get children
  const getChildren = (parentId: string): Category[] => {
    return categories.filter((cat) => cat.parentId === parentId);
  };

  const handleParentSelect = (parentId: string) => {
    setExpandedParent(expandedParent === parentId ? "" : parentId);
  };

  const handleChildSelect = (childId: string, filterKeys: string[]) => {
    const hasFilterKeys = filterKeys && filterKeys.length > 0;
    onSelect(childId, hasFilterKeys);
  };

  return (
    <div className="space-y-4">
      {/* Mobile/Tablet: Dropdown */}
      <div className="md:hidden space-y-2">
        <Select value={expandedParent} onValueChange={handleParentSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select parent category" />
          </SelectTrigger>
          <SelectContent>
            {parentCategories.map((parent) => (
              <SelectItem key={parent._id} value={parent._id}>
                {parent.categoryName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {expandedParent && (
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              const child = getChildren(expandedParent).find(
                (c) => c._id === value,
              );
              if (child) {
                handleChildSelect(child._id, child.categoryFilterKeys);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select child category" />
            </SelectTrigger>
            <SelectContent>
              {getChildren(expandedParent).map((child) => (
                <SelectItem key={child._id} value={child._id}>
                  {child.categoryName}
                  {child.categoryFilterKeys?.length > 0 && (
                    <span className="ml-2 text-xs text-green-600">
                      ✓ Has specs
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Desktop: Nested list */}
      <div className="hidden md:block space-y-2">
        {parentCategories.map((parent) => {
          const children = getChildren(parent._id);
          const isExpanded = expandedParent === parent._id;

          return (
            <div key={parent._id} className="border rounded-lg overflow-hidden">
              {/* Parent Category */}
              <button
                type="button"
                onClick={() => handleParentSelect(parent._id)}
                className={cn(
                  "w-full flex items-center justify-between p-4 hover:bg-muted transition-colors",
                  isExpanded && "bg-muted",
                )}
              >
                <span className="font-medium">{parent.categoryName}</span>
                <div className="flex items-center gap-2">
                  {children.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {children.length} subcategories
                    </span>
                  )}
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition-transform",
                      isExpanded && "rotate-90",
                    )}
                  />
                </div>
              </button>

              {/* Child Categories */}
              {isExpanded && children.length > 0 && (
                <div className="border-t bg-muted/30">
                  {children.map((child) => {
                    const hasFilterKeys =
                      child.categoryFilterKeys &&
                      child.categoryFilterKeys.length > 0;
                    const isSelected = selectedCategory === child._id;

                    return (
                      <button
                        key={child._id}
                        type="button"
                        onClick={() =>
                          handleChildSelect(child._id, child.categoryFilterKeys)
                        }
                        className={cn(
                          "w-full flex items-center justify-between p-3 pl-8 hover:bg-muted transition-colors border-b last:border-b-0",
                          isSelected && "bg-primary/10",
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{child.categoryName}</span>
                          {hasFilterKeys && (
                            <span className="text-xs text-green-600 font-medium">
                              ✓ Has specifications
                            </span>
                          )}
                          {!hasFilterKeys && (
                            <span className="text-xs text-amber-600 font-medium">
                              ⚠ No specifications
                            </span>
                          )}
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {isExpanded && children.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground border-t bg-muted/30">
                  No subcategories available
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected category info */}
      {selectedCategory && (
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm font-medium text-primary">
            Category selected successfully
          </p>
        </div>
      )}
    </div>
  );
}
