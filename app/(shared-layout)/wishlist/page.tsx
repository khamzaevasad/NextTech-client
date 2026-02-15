"use client";
import { userVar } from "@/apollo/store";
import { LIKE_TARGET_PRODUCT } from "@/apollo/user/user-mutation";
import { GET_PRODUCTS } from "@/apollo/user/user-query";
import { Button, buttonVariants } from "@/components/ui/button";
import ProductCard from "@/components/web/ProductCard";
import { Direction } from "@/lib/enums/comment.enum";
import { Message } from "@/lib/enums/common.enum";
import { T } from "@/lib/types/common";
import { Product } from "@/lib/types/product/product";
import { ProductsInquiry } from "@/lib/types/product/product.input";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@apollo/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function WishListPage() {
  const [wishList, setWishList] = useState<ProductsInquiry>({
    page: 1,
    limit: 8,
    sort: "createdAt",
    onlyMyWishlist: true,
    direction: Direction.DESC,
    search: {},
  });
  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */
  const [LikeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT, {});
  const { data: wishListData, refetch: getProductsRefetch } = useQuery(
    GET_PRODUCTS,
    {
      variables: {
        input: wishList,
      },
      fetchPolicy: "cache-first",
    },
  );

  const favoriteProducts = wishListData?.getProducts?.list || [];

  /* -------------------------------------------------------------------------- */
  /*                                  HANDLERS                                  */
  /* -------------------------------------------------------------------------- */
  const handlePageChange = (newPage: number) => {
    setWishList((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const likeProductHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

      await LikeTargetProduct({
        variables: {
          input: id,
        },
      });

      await getProductsRefetch({ input: wishList });
      toast("success");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log("likePropertyHandler error", err.message);
        toast(err.message);
      } else {
        toast("Unexpected error occurred");
      }
    }
  };

  const totalProducts =
    wishListData?.getProducts?.metaCounter?.[0]?.total ??
    favoriteProducts.length;
  const totalPages = Math.ceil(totalProducts / wishList.limit);

  return (
    <div className="my-8">
      <div>
        <h2 className="text-4xl font-semibold my-6 text-center">Favorites</h2>
      </div>
      {favoriteProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-3">
            {favoriteProducts.map((product: Product) => (
              <ProductCard
                likeProductHandler={likeProductHandler}
                key={product._id}
                product={product}
              />
            ))}
          </div>
          {/* Pagination */}

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={wishList.page === 1}
                onClick={() => handlePageChange(wishList.page - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={wishList.page === p ? "default" : "outline"}
                  className={cn(
                    "w-10 h-10",
                    wishList.page === p && "bg-pink-500 hover:bg-pink-600",
                  )}
                  onClick={() => handlePageChange(p)}
                >
                  {p}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                disabled={wishList.page === totalPages}
                onClick={() => handlePageChange(wishList.page + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-accent/10 rounded-3xl border-2 border-dashed">
          <div className="text-xl text-muted-foreground">
            <p>No favorites</p>
            <p> You haven&apos;t added any products to your favorites yet.</p>
            <p>
              Browse our catalog and click the heart to save items you like!
            </p>
          </div>
          <Link href={"/products"} className={`${buttonVariants({})} my-9`}>
            Start Shopping Button
          </Link>
        </div>
      )}
    </div>
  );
}
