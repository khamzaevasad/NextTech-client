"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Image from "next/image";
import { CardAction, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { API_URL } from "../../lib/config";
import { useState } from "react";
import { Product } from "@/lib/types/product/product";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";
import { T } from "@/lib/types/common";
import Link from "next/link";
import { useCartStore } from "@/stores/cartStore";

interface ProductCardProps {
  product: Product;
  className?: string;
  likeProductHandler?: (user: T, id: string) => Promise<void>;
  forceLiked?: boolean;
}

export default function ProductCard({
  product,
  className,
  likeProductHandler,
  forceLiked,
}: ProductCardProps) {
  const [currentSlide, setCurrentSlide] = useState<number>(1);

  const rating =
    product.productRatingCount > 0
      ? product.productRating / product.productRatingCount
      : 0;

  const currency = "USD";
  const formattedPrice = product.productPrice.toLocaleString("usd-US");
  const user = useReactiveVar(userVar);
  const { onAdd } = useCartStore();

  const isLiked =
    forceLiked || (product?.meLiked && product?.meLiked[0]?.myFavorite);

  return (
    <Link
      href={`/products/${product.productSlug}`}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border/60",
        "transition-all duration-300 hover:border-pink-500/50 hover:shadow-md dark:bg-[radial-gradient(35%_80%_at_30%_0%,--theme(--color-foreground/.1),transparent)]",
        className,
      )}
    >
      {/* IMAGE */}
      <div className="relative aspect-4/3 overflow-hidden glow-wrapper">
        <Swiper
          modules={[Pagination]}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet custom-bullet",
            bulletActiveClass:
              "swiper-pagination-bullet-active custom-bullet-active",
          }}
          onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex + 1)}
          className="h-full w-full product-image-swiper"
          spaceBetween={0}
          slidesPerView={1}
        >
          {product.productImages?.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-full w-full">
                <Image
                  src={`${API_URL}/${image}`}
                  alt={`${product.productName} - ${index + 1}`}
                  fill
                  className="object-contain p-4 sm:p-6"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  unoptimized
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Wishlist */}
        <button
          type="button"
          className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 rounded-full shadow-sm cursor-pointer"
          aria-label="Add to wishlist"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            likeProductHandler?.(user, product._id);
          }}
        >
          {isLiked ? (
            <Image
              src="/liked-true.png"
              alt="like-icon"
              width={20}
              height={20}
            />
          ) : (
            <Image
              src="/liked-false.png"
              alt="like-icon"
              width={20}
              height={20}
            />
          )}
        </button>

        {/* Brand Badge */}
        {product.productBrand && (
          <CardAction className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
            <Badge variant={"secondary"} className="">
              {product.productBrand.toLowerCase()}
            </Badge>
          </CardAction>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-2 right-2 z-10 bg-black/60 text-white text-[10px] sm:text-xs px-2 py-1 rounded backdrop-blur-sm">
          {currentSlide}/{product.productImages?.length || 1}
        </div>
      </div>

      {/* CONTENT */}
      <CardContent className="p-2 sm:p-4 space-y-2 sm:space-y-3 mt-5">
        {/* Product name */}
        <h3 className="text-xs sm:text-sm font-medium leading-snug line-clamp-1">
          {product.productName}
        </h3>

        <div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
              {/* Stars */}
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3 w-3 sm:h-4 sm:w-4",
                      i < Math.floor(rating)
                        ? "fill-pink-500 text-pink-500"
                        : "text-muted-foreground/60",
                    )}
                  />
                ))}
              </div>
            </div>
            {/* Views */}
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="w-3 h-3 sm:w-4 sm:h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12s-3.75 6.75-9.75 6.75S2.25 12 2.25 12z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                />
              </svg>
              <span>{product.productViews}</span>
            </div>
          </div>
        </div>
      </CardContent>

      {/* FOOTER */}
      <CardFooter className="p-3 sm:p-4 pt-0 flex flex-col gap-2 sm:gap-3 items-start">
        <div className="flex items-center justify-between w-full">
          <div className="text-lg sm:text-xl font-bold text-pink-600">
            {formattedPrice}{" "}
            <span className="text-sm sm:text-base font-semibold">
              {currency}
            </span>
          </div>

          <div className="py-2">
            <Badge variant={"secondary"}>
              {product.storeData?.storeName.toLocaleLowerCase()}
            </Badge>
          </div>
        </div>

        <Button
          size="lg"
          className="cursor-pointer w-full bg-pink-600 text-white font-semibold hover:bg-pink-500 transition-colors
                 text-xs sm:text-sm h-9 sm:h-11"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAdd({
              _id: product._id,
              productName: product.productName,
              productPrice: product.productPrice,
              productImages: product.productImages[0],
              productStock: product.productStock,
              productSlug: product?.productSlug,
              quantity: 1,
            });
          }}
        >
          <ShoppingCart className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Add to cart
        </Button>
      </CardFooter>
    </Link>
  );
}
