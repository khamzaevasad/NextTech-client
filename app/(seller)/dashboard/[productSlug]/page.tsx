"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { GET_PRODUCT } from "@/apollo/user/user-query";
import { UpdateProductForm } from "@/components/dashboard/product/UpdateProductForm";
import { LoadingBar } from "@/components/web/LoadingBar";

interface EditProductPageProps {
  params: Promise<{
    productSlug: string;
  }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { productSlug } = use(params);
  const router = useRouter();

  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */
  const { data, loading, error, refetch } = useQuery(GET_PRODUCT, {
    variables: { input: productSlug },
    fetchPolicy: "cache-and-network",
    skip: !productSlug,
  });

  const product = data?.getProduct;

  return (
    <>
      <LoadingBar loading={loading} />
      <div className="container mx-auto max-w-5xl py-8 px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Product</h1>
            {product && (
              <p className="text-sm text-muted-foreground">
                {product.productName}
              </p>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-destructive mb-4">Failed to load product</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        )}

        {/* Form */}
        {product && !loading && (
          <UpdateProductForm
            initialData={product}
            onSuccess={() => {
              router.push(`/dashboard`);
            }}
          />
        )}
      </div>
    </>
  );
}
