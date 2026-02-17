"use client";
import { GET_PRODUCT } from "@/apollo/user/user-query";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { use, useState, useMemo } from "react";
import { ArrowBigLeft, ArrowBigRight, Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import Link from "next/link";
import Image from "next/image";
import { API_URL } from "@/lib/config";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LIKE_TARGET_PRODUCT } from "@/apollo/user/user-mutation";
import { T } from "@/lib/types/common";
import { Message } from "@/lib/enums/common.enum";
import { toast } from "sonner";
import { userVar } from "@/apollo/store";
import StoreProduct from "@/components/products/StoreProduct";
import Reviews from "@/components/web/Reviews";
import { useCartStore } from "@/stores/cartStore";
import { buttonVariants } from "@/components/ui/button";
import { gql } from "@apollo/client";
import { LoadingBar } from "@/components/web/LoadingBar";

// GET_FILTER_OPTIONS query
const GET_FILTER_OPTIONS = gql`
  query GetFilterOptions($categoryId: String!) {
    getFilterOptions(categoryId: $categoryId) {
      brands
      specOptions
      filterKeys
    }
  }
`;

interface DetailProps {
  params: Promise<{
    productSlug: string;
  }>;
}

// Label mapping function for better display names
const formatSpecLabel = (key: string): string => {
  const specialCases: Record<string, string> = {
    cpu: "CPU",
    gpu: "GPU",
    ram: "RAM",
    os: "Operating System",
  };

  return (
    specialCases[key] ||
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  );
};

export default function ProductDetailPage({ params }: DetailProps) {
  const { productSlug } = use(params);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeTab, setActiveTab] = useState<"specs" | "description">("specs");

  const user = useReactiveVar(userVar);
  const { onAdd } = useCartStore();

  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */
  const [LikeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT, {});

  const {
    loading: getProductLoading,
    error: getProductError,
    refetch: getProductRefetch,
    data: getProductData,
  } = useQuery(GET_PRODUCT, {
    fetchPolicy: "cache-and-network",
    variables: { input: productSlug },
    notifyOnNetworkStatusChange: true,
    skip: !productSlug,
  });

  /* -------------- Get dynamic filter options based on category -------------- */
  const { data: filterOptionsData, loading: filterOptionsLoading } = useQuery(
    GET_FILTER_OPTIONS,
    {
      variables: {
        categoryId: getProductData?.getProduct?.productCategory || "",
      },
      skip: !getProductData?.getProduct?.productCategory,
      fetchPolicy: "cache-first",
    },
  );

  /* --------------------------- likeProductHandler --------------------------- */
  const likeProductHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

      await LikeTargetProduct({
        variables: {
          input: id,
        },
      });

      await getProductRefetch({ input: productSlug });
      toast("success");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log("likeProductHandler error", err.message);
        toast(err.message);
      } else {
        toast("Unexpected error occurred");
      }
    }
  };

  /* ----------- Dynamic specifications based on filterKeys from API ---------- */
  const specifications = useMemo(() => {
    const product = getProductData?.getProduct;
    if (!product) return [];

    const baseSpecs = [
      {
        label: "Brand",
        value: product.productBrand || "N/A",
        key: "brand",
      },
      {
        label: "Type",
        value: product.productCategory || "N/A",
        key: "category",
      },
    ];

    if (filterOptionsData?.getFilterOptions?.filterKeys) {
      const filterKeys = filterOptionsData.getFilterOptions.filterKeys;

      const dynamicSpecs = filterKeys.map((key: string) => ({
        label: formatSpecLabel(key),
        value: product.productSpecs?.[key] || "N/A",
        key,
      }));

      // Combine and filter out "N/A" values
      return [...baseSpecs, ...dynamicSpecs].filter(
        (spec) => spec.value !== "N/A",
      );
    }

    // Fallback to static specs if no filter options available
    const fallbackSpecs = [
      { label: "CPU", value: product.productSpecs?.cpu || "N/A", key: "cpu" },
      { label: "GPU", value: product.productSpecs?.gpu || "N/A", key: "gpu" },
      { label: "RAM", value: product.productSpecs?.ram || "N/A", key: "ram" },
      {
        label: "Storage",
        value: product.productSpecs?.storage || "N/A",
        key: "storage",
      },
      {
        label: "Display",
        value: product.productSpecs?.display || "N/A",
        key: "display",
      },
      {
        label: "Refresh Rate",
        value: product.productSpecs?.refreshRate || "N/A",
        key: "refreshRate",
      },
      {
        label: "Cooling System",
        value: product.productSpecs?.cooling || "N/A",
        key: "cooling",
      },
      {
        label: "Keyboard",
        value: product.productSpecs?.keyboard || "N/A",
        key: "keyboard",
      },
      { label: "OS", value: product.productSpecs?.os || "N/A", key: "os" },
      {
        label: "Weight",
        value: product.productSpecs?.weight || "N/A",
        key: "weight",
      },
    ];

    return [...baseSpecs, ...fallbackSpecs].filter(
      (spec) => spec.value !== "N/A",
    );
  }, [getProductData, filterOptionsData]);

  if (!getProductData?.getProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Product not found</div>
      </div>
    );
  }

  const product = getProductData?.getProduct;

  const rating =
    product?.productRatingCount > 0
      ? product?.productRating / product?.productRatingCount
      : 0;

  return (
    <>
      <LoadingBar loading={getProductLoading} />
      <div className="min-h-screen ">
        {/* Navigation Breadcrumb */}
        <div className="mx-auto px-4 py-6">
          <div className="text-sm text-gray-400 mb-8">
            <Link
              href="/products"
              className="hover:text-pink-500 text-muted-foreground cursor-pointer"
            >
              Products
            </Link>
            <span className="mx-2">/</span>
            <span>{product.productName}</span>
          </div>

          {/* Product Title */}
          <h1 className="text-4xl font-bold mb-8">{product.productName}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Image Gallery */}
            <div className="relative">
              {/* Main Swiper */}
              <div className="glow-wrapper rounded-lg p-8 mb-4">
                <Swiper
                  modules={[Navigation, Thumbs]}
                  thumbs={{
                    swiper:
                      thumbsSwiper && !thumbsSwiper.destroyed
                        ? thumbsSwiper
                        : null,
                  }}
                  navigation={{
                    nextEl: ".swiper-button-next-custom",
                    prevEl: ".swiper-button-prev-custom",
                  }}
                  spaceBetween={10}
                  slidesPerView={1}
                  className="main-swiper"
                >
                  {product.productImages?.map(
                    (image: string, index: number) => (
                      <SwiperSlide key={index}>
                        <div className="relative h-125 flex items-center justify-center">
                          <Image
                            src={`${API_URL}/${image}`}
                            alt={`${product.productName} - ${index + 1}`}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                      </SwiperSlide>
                    ),
                  )}
                </Swiper>
              </div>

              {/* Thumbnail Swiper */}
              <div className="relative px-12">
                <Swiper
                  modules={[FreeMode, Thumbs]}
                  onSwiper={setThumbsSwiper}
                  spaceBetween={10}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  className="thumbs-swiper"
                >
                  {product.productImages?.map(
                    (image: string, index: number) => (
                      <SwiperSlide key={index}>
                        <div className="relative w-full h-20 cursor-pointer border-2 border-transparent hover:border-pink-600 rounded-lg overflow-hidden transition-all">
                          <Image
                            src={`${API_URL}/${image}`}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      </SwiperSlide>
                    ),
                  )}
                </Swiper>

                {/* Custom Navigation Buttons */}
                <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-pink-600 hover:bg-pink-500 w-12 h-12 flex items-center justify-center transition-colors cursor-pointer">
                  <ArrowBigLeft className="text-white" />
                </button>
                <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-pink-500 hover:bg-pink-600 w-12 h-12 flex items-center justify-center transition-colors cursor-pointer">
                  <ArrowBigRight className="text-white" />
                </button>
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="flex flex-col">
              {/* Status Badge */}
              <div className="flex items-center gap-2 mb-6">
                <Badge className="bg-green-600 text-white">
                  {product.productStock > 0 ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0.5 my-4">
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
                <button
                  type="button"
                  className="rounded-full shadow-sm cursor-pointer"
                  aria-label="Add to wishlist"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    likeProductHandler(user, product._id);
                  }}
                >
                  {product?.meLiked && product?.meLiked[0]?.myFavorite ? (
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
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="text-sm text-gray-400 mb-2">Price:</div>
                <div className="text-5xl font-bold">
                  ${product.productPrice.toFixed(2)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 mb-8">
                <button
                  onClick={(e) => {
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
                  className="w-full bg-pink-600 hover:bg-pink-500 text-white py-4 rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  Add to Cart
                </button>
              </div>

              {/* Store Info */}
              <Card className="mb-8">
                <CardHeader>
                  <div className="text-sm text-muted-foreground mb-2">
                    Manufacturer
                  </div>
                </CardHeader>
                <CardContent>
                  <Link
                    href={`/stores/${product.storeData._id}`}
                    className={cn(
                      buttonVariants({ variant: "link" }),
                      "text-xl font-semibold m-0 p-0",
                    )}
                  >
                    {product.storeData.storeName}
                  </Link>
                  {product.storeData.storeDesc && (
                    <div className="text-sm text-muted-foreground mt-2">
                      {product.storeData.storeDesc}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Specifications Table */}
          <div className="mt-16">
            <div className="border-b border-border mb-8">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab("specs")}
                  className={`pb-4 font-semibold transition-colors relative ${
                    activeTab === "specs"
                      ? "text-pink-500"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Specifications
                  {activeTab === "specs" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500"></span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("description")}
                  className={`pb-4 font-semibold transition-colors relative ${
                    activeTab === "description"
                      ? "text-pink-500"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Description
                  {activeTab === "description" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500"></span>
                  )}
                </button>
              </div>
            </div>

            {/* Specifications Table */}
            {activeTab === "specs" && (
              <div className="rounded-lg overflow-hidden border border-border">
                {filterOptionsLoading ? (
                  <div className="p-6 text-center text-muted-foreground">
                    Loading specifications...
                  </div>
                ) : specifications.length > 0 ? (
                  <table className="w-full">
                    <tbody>
                      {specifications.map((spec, index: number) => (
                        <tr
                          key={spec.key}
                          className={`border-b border-border last:border-b-0 transition-colors ${
                            index % 2 === 0
                              ? "bg-muted/50 hover:bg-muted/70"
                              : "bg-background hover:bg-muted/30"
                          }`}
                        >
                          <td className="py-4 px-6 text-muted-foreground w-1/3 font-medium">
                            {spec.label}
                          </td>
                          <td className="py-4 px-6 text-foreground font-medium">
                            {spec.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-6 text-center text-muted-foreground">
                    No specifications available
                  </div>
                )}
              </div>
            )}

            {/* Description Content */}
            {activeTab === "description" && product.productDesc && (
              <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                <p className="text-muted-foreground leading-relaxed">
                  {product.productDesc}
                </p>
              </div>
            )}

            {activeTab === "description" && !product.productDesc && (
              <div className="bg-card border border-border rounded-lg p-6 shadow-sm text-center">
                <p className="text-muted-foreground">
                  No description available
                </p>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-all hover:border-pink-500/50 group">
              <div className="text-3xl font-bold text-pink-500 group-hover:scale-110 transition-transform">
                {product.productViews}
              </div>
              <div className="text-sm text-muted-foreground mt-2 font-medium">
                Views
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-all hover:border-pink-500/50 group">
              <div className="text-3xl font-bold text-pink-500 group-hover:scale-110 transition-transform">
                {product.productLikes}
              </div>
              <div className="text-sm text-muted-foreground mt-2 font-medium">
                Likes
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-all hover:border-pink-500/50 group">
              <div className="text-3xl font-bold text-pink-500 group-hover:scale-110 transition-transform">
                {product.productComments}
              </div>
              <div className="text-sm text-muted-foreground mt-2 font-medium">
                Comments
              </div>
            </div>
          </div>

          {/* Comment & review */}
          <div>
            <Reviews productId={product._id} />
          </div>

          {/* Store Products */}
          <div>
            <StoreProduct
              likeProductHandler={likeProductHandler}
              storeId={product.storeId}
            />
          </div>
        </div>

        <style jsx global>{`
          .swiper-button-disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    </>
  );
}
