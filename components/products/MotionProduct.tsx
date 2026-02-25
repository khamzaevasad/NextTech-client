"use client";

// https://motion-primitives.com/docs/infinite-slider

import { useMutation, useQuery } from "@apollo/client";
import { InfiniteSlider } from "../motion-primitives/infinite-slider";
import { GET_PRODUCTS } from "@/apollo/user/user-query";
import { useMemo } from "react";
import { Product } from "@/lib/types/product/product";
import { EmptyState } from "../web/EmptyState";
import { Package } from "lucide-react";
import ProductCard from "../web/ProductCard";
import { ProductsInquiry } from "@/lib/types/product/product.input";
import { LIKE_TARGET_PRODUCT } from "@/apollo/user/user-mutation";
import { T } from "@/lib/types/common";
import { Message } from "@/lib/enums/common.enum";
import { toast } from "sonner";

interface TopProductsProps {
  initialInput?: ProductsInquiry;
}

export function MotionProduct({
  initialInput = {
    page: 1,
    limit: 40,
    search: {},
  },
}: TopProductsProps) {
  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLINET                               */
  /* -------------------------------------------------------------------------- */
  const { data, loading, refetch } = useQuery(GET_PRODUCTS, {
    variables: { input: initialInput },
    fetchPolicy: "cache-and-network",
  });
  const [LikeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

  const likeProductHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

      await LikeTargetProduct({
        variables: { input: id },
      });

      await refetch({ input: initialInput });
      toast.success("Success");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log("LikeProductHandler error", err.message);
        toast.error(err.message);
      } else {
        toast.error("Unexpected error occurred");
      }
    }
  };

  const topProducts: Product[] = useMemo(() => {
    const list = data?.getProducts?.list ?? [];

    return [...list]
      .filter((p) => p.productRating > 0 && p.productRatingCount > 0)
      .sort(
        (a, b) =>
          b.productRating * b.productRatingCount -
          a.productRating * a.productRatingCount,
      )
      .slice(0, 20);
  }, [data]);

  if (loading) return null;

  if (!topProducts.length)
    return <EmptyState icon={<Package />} title="No top Product Found" />;

  return (
    <div className="overflow-hidden py-4 mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <InfiniteSlider gap={20} reverse={true} speed={54} speedOnHover={20}>
        {topProducts.map((product) => (
          <div key={product._id} className="w-70 shrink-0">
            <ProductCard
              likeProductHandler={likeProductHandler}
              product={product}
            />
          </div>
        ))}
      </InfiniteSlider>
    </div>
  );
}
