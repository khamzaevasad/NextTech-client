import { API_URL } from "@/lib/config";
import { Member } from "@/lib/types/member/member";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { User } from "lucide-react";

interface SellerCardProps {
  seller: Member;
  className?: string;
}

function SellerCard({ className, seller }: SellerCardProps) {
  return (
    <div
      className={cn(
        "block group relative overflow-hidden rounded-xl border border-border/60 bg-background",
        "transition-all duration-300 hover:border-pink-500/50 dark:bg-[radial-gradient(35%_80%_at_30%_0%,--theme(--color-foreground/.1),transparent)] hover:shadow-md",
        className,
      )}
    >
      {/* seller Images */}
      <div className="aspect-[3/4] overflow-hidden relative glow-wrapper">
        {seller?.memberImage ? (
          <Image
            src={`${API_URL}/${seller.memberImage}`}
            alt={seller.memberNick}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
            <User className="w-1/3 h-1/3 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 text-center py-4 px-2 to-transparent">
        <h2 className="text-xl font-bold text-white">
          {seller.memberNick.toUpperCase()}
        </h2>
        <Badge variant={"secondary"} className="text-xs mt-2">
          {seller.memberType.toLowerCase()}
        </Badge>
      </div>
    </div>
  );
}

export default SellerCard;
