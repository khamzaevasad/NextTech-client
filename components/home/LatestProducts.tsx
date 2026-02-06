import ProductCard from "../web/ProductCard";
import { ProductsInquiry } from "@/lib/types/product/product.input";
import { useState } from "react";
import { Product } from "@/lib/types/product/product";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "@/apollo/user/user-query";
import { T } from "@/lib/types/common";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

interface LatestProductsProps {
  initialInput?: ProductsInquiry;
}

function LatestProducts({
  initialInput = {
    page: 1,
    limit: 8,
    direction: "DESC",
    search: {},
  },
}: LatestProductsProps) {
  // const { initialInput } = props;
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
  console.log("product", products[0]?.storeData);
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
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default LatestProducts;
