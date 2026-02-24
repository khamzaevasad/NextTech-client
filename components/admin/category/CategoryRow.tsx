"use client";

import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, ChevronRight, ChevronDown, ImageOff } from "lucide-react";
import Image from "next/image";
import { API_URL } from "@/lib/config";
import { Category } from "@/lib/types/category/category";

interface CategoryRowProps {
  category: Category;
  depth?: number;
  onEdit: (category: Category) => void;
}

export function CategoryRow({ category, depth = 0, onEdit }: CategoryRowProps) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <>
      <TableRow className="group hover:bg-muted/30 transition-colors">
        {/* IMAGE */}
        <TableCell className="hidden md:table-cell">
          <div className="relative size-10 rounded-lg border overflow-hidden bg-muted flex items-center justify-center">
            {category.categoryImage ? (
              <Image
                src={`${API_URL}/${category.categoryImage}`}
                alt={category.categoryName}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <ImageOff className="size-4 text-muted-foreground" />
            )}
          </div>
        </TableCell>

        {/* NAME with indent + expand */}
        <TableCell className="font-semibold py-4">
          <div
            className="flex items-center gap-1"
            style={{ paddingLeft: `${depth * 20}px` }}
          >
            {hasChildren ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 shrink-0"
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? (
                  <ChevronDown className="size-3.5" />
                ) : (
                  <ChevronRight className="size-3.5" />
                )}
              </Button>
            ) : (
              <span className="w-5 shrink-0" />
            )}
            <span className="truncate max-w-[160px]">
              {category.categoryName}
            </span>
            {!category.parentId && (
              <Badge variant="outline" className="text-[10px] ml-1 shrink-0">
                Root
              </Badge>
            )}
          </div>
        </TableCell>

        {/* SLUG */}
        <TableCell className="hidden md:table-cell text-muted-foreground text-sm font-mono truncate max-w-[140px]">
          {category.categorySlug}
        </TableCell>

        {/* FILTER KEYS */}
        <TableCell className="hidden md:table-cell">
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {category.categoryFilterKeys?.slice(0, 3).map((key) => (
              <span
                key={key}
                className="inline-block px-1.5 py-0.5 rounded bg-muted text-[10px] font-medium text-muted-foreground"
              >
                {key}
              </span>
            ))}
            {(category.categoryFilterKeys?.length ?? 0) > 3 && (
              <span className="text-[10px] text-muted-foreground">
                +{category.categoryFilterKeys!.length - 3}
              </span>
            )}
          </div>
        </TableCell>

        {/* ACTIONS */}
        <TableCell className="text-right">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-rose-50 hover:text-pink-500 cursor-pointer"
            onClick={() => onEdit(category)}
          >
            <Edit size={16} />
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
}
