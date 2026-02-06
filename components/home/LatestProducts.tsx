import ProductCard from "../web/ProductCard";
import { ProductsInquiry } from "@/lib/types/product/product.input";
import { useState } from "react";
import { Product } from "@/lib/types/product/product";
import { useMutation, useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "@/apollo/user/user-query";
import { T } from "@/lib/types/common";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { toast } from "sonner";
import { error } from "console";
import { Member } from "@/lib/types/member/member";
import { Message } from "@/lib/enums/common.enum";
import { LIKE_TARGET_PRODUCT } from "@/apollo/user/user-mutation";

interface LatestProductsProps {
  initialInput?: ProductsInquiry;
}

function LatestProducts({
  initialInput = {
    page: 1,
    limit: 8,
    sort: "createdAt",
    search: {},
  },
}: LatestProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  /* ------------------------------ APOLLO CLIENT ----------------------------- */
  const {
    loading: getProductsLoading,
    error: getProductsError,
    refetch: getProductsRefetch,
    data: getProductsData,
  } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "cache-and-network",
    variables: { input: initialInput },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setProducts(data?.getProducts?.list ?? []);
    },
  });

  const [LikeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT, {});

  /* -------------------------------- HANDLERS -------------------------------- */
  const likeProductHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

      await LikeTargetProduct({
        variables: {
          input: id,
        },
      });

      await getProductsRefetch({ input: initialInput });
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

  // TODO: MODIFY LOADING SPINER
  // if (getProductsLoading) return <h3 className="text-center">Loading...</h3>;
  return (
    <div className="my-8">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-semibold my-6">Latest Products</h2>
        <Link href="/products" className={buttonVariants({ variant: "ghost" })}>
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-3">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            likeProductHandler={likeProductHandler}
          />
        ))}
      </div>
    </div>
  );
}

export default LatestProducts;
