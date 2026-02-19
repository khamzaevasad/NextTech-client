"use client";

import Image from "next/image";
import { MapPin, Star, Eye, Heart, Package, Store } from "lucide-react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { _Store } from "@/lib/types/store/store";
import { API_URL } from "@/lib/config";
import { T } from "@/lib/types/common";
import { userVar } from "@/apollo/store";
import { useReactiveVar } from "@apollo/client";
import { useRouter } from "next/navigation";

interface StoreCardProps {
  store: _Store;
  className?: string;
  likeStoreHandler?: (user: T, id: string) => Promise<void>;
}

export default function StoreCard({
  store,
  className,
  likeStoreHandler,
}: StoreCardProps) {
  const isLiked = store?.meLiked && store?.meLiked[0]?.myFavorite;
  const router = useRouter();
  const user = useReactiveVar(userVar);

  /* -------------------------------------------------------------------------- */
  /*                                  HANDLERS                                  */
  /* -------------------------------------------------------------------------- */

  const getProfile = (_id) => {
    router.replace(_id === user._id ? "profile/me" : `/profile/${_id}`);
  };

  return (
    <Link
      href={`/stores/${store._id}`}
      className={cn(
        "group relative block overflow-hidden rounded-xl border border-border/60",
        "transition-all duration-300 hover:border-pink-500/50 hover:shadow-md",
        "dark:bg-[radial-gradient(35%_80%_at_30%_0%,--theme(--color-foreground/.1),transparent)]",
        className,
      )}
    >
      {/* HEADER - Store Logo & Info */}
      <div className="relative aspect-video overflow-hidden  dark:to-purple-950/20">
        {store.storeLogo ? (
          <Image
            src={`${API_URL}/${store.storeLogo}`}
            alt={store.storeName}
            fill
            className="object-contain p-4 sm:p-6"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={false}
            unoptimized
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Store className="h-16 w-16 sm:h-20 sm:w-20 text-pink-300 dark:text-pink-700" />
          </div>
        )}

        {/* Wishlist Button */}
        {isLiked !== null ? (
          <button
            type="button"
            className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 rounded-full shadow-sm cursor-pointer"
            aria-label="Like store"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              likeStoreHandler?.(user, store._id);
            }}
          >
            {isLiked ? (
              <Image src="/liked-true.png" alt="liked" width={20} height={20} />
            ) : (
              <Image src="/liked-false.png" alt="like" width={20} height={20} />
            )}
          </button>
        ) : (
          ""
        )}

        {/* Status Badge */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
          <Badge variant={"secondary"}>{store.storeStatus.toLowerCase()}</Badge>
        </div>

        {/* Owner Avatar - Bottom Left */}
        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 z-10">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-white dark:border-gray-800 shadow-lg">
            <AvatarImage
              src={`${API_URL}/${store.ownerData?.memberImage}`}
              alt={store.ownerData?.memberNick}
            />
            <AvatarFallback className="bg-pink-500 text-white text-xs sm:text-sm">
              {store.ownerData?.memberNick[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* CONTENT */}
      <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        {/* Store Name */}
        <div>
          <h3 className="text-sm sm:text-base font-semibold leading-tight line-clamp-1">
            {store.storeName}
          </h3>
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            by {store.ownerData?.memberNick}
          </p>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {store.storeDesc}
        </p>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-pink-500" />
          <span>{store.storeAddress}</span>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between pt-1">
          {/* Rating */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3 w-3 sm:h-4 sm:w-4",
                    i < Math.floor(store.storeRating)
                      ? "fill-pink-500 text-pink-500"
                      : "text-muted-foreground/40",
                  )}
                />
              ))}
            </div>
            <span className="text-[10px] sm:text-xs text-muted-foreground">
              ({store.storeComments})
            </span>
          </div>

          {/* Views */}
          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{store.storeViews}</span>
          </div>
        </div>
      </CardContent>

      {/* FOOTER */}
      <CardFooter className="p-3 sm:p-4 pt-0 flex flex-col gap-2 sm:gap-3">
        {/* Products & Likes */}
        <div className="flex items-center justify-between w-full text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Package className="h-4 w-4 text-pink-500" />
            <span className="font-medium text-foreground">
              {store.storeProductsCount}
            </span>
            <span>products</span>
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Heart
              className={cn(
                "h-4 w-4",
                isLiked && "fill-pink-500 text-pink-500",
              )}
            />
            <span>{store.storeLikes}</span>
          </div>
        </div>

        {/* Visit Button */}
        <Button
          size="lg"
          className="w-full bg-pink-600 text-white font-semibold hover:bg-pink-500 transition-colors
                     text-xs sm:text-sm h-9 sm:h-11 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            getProfile(store.ownerData?._id);
          }}
        >
          <Store className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Visit Owner Profile
        </Button>
      </CardFooter>
    </Link>
  );
}
