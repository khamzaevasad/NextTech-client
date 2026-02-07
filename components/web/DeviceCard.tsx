import { cn } from "@/lib/utils";
import { Category } from "@/lib/types/category/category";
import { API_URL } from "@/lib/config";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "../ui/badge";
import Link from "next/link";

interface DeviceCardProps {
  category: Category;
  className?: string;
}

export default function DeviceCard({ className, category }: DeviceCardProps) {
  return (
    <Link
      href="#"
      className={cn(
        "block group relative overflow-hidden rounded-xl border border-border/60 bg-background",
        "transition-all duration-300 hover:border-pink-500/50 dark:bg-[radial-gradient(35%_80%_at_30%_0%,--theme(--color-foreground/.1),transparent)] hover:shadow-md",
        className,
      )}
    >
      {/* image */}
      <div className="aspect-[4/3] overflow-hidden relative">
        <Image
          src={`${API_URL}/${category.categoryImage}`}
          alt={category.categoryName}
          fill
          className="object-contain p-4 sm:p-6"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
        />
      </div>

      <div className="text-center py-4 px-2">
        <Badge variant={"outline"}>
          {category.categoryName.toLowerCase()}{" "}
          <ArrowUpRight className="ml-1 w-3 h-3" />
        </Badge>
      </div>
    </Link>
  );
}
