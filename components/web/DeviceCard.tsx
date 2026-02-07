import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import { Category } from "@/lib/types/category/category";
import { API_URL } from "@/lib/config";
import Image from "next/image";
import { Button } from "../ui/button";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "../ui/badge";

interface DeviceCardProps {
  category: Category;
  className?: string;
}

export default function DeviceCard({ className, category }: DeviceCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border/60",
        "transition-all duration-300 hover:border-pink-500/50 hover:shadow-md",
        className,
      )}
    >
      <CardContent>
        {/* image */}
        <div className="aspect-[4/3] overflow-hidden glow-wrapper">
          <div className="h-full w-full">
            <Image
              // `${API_URL}/${category.categoryImage}`
              src={"/asus1.webp"}
              alt={category.categoryName}
              fill
              className="object-contain p-4 sm:p-6"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
          </div>
        </div>
        <div className="text-center">
          <Badge variant={"outline"}>
            {category.categoryName} <ArrowUpRight />
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
