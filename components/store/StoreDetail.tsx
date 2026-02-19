"use client";

import {
  MapPin,
  Star,
  Eye,
  Heart,
  Package,
  Store as StoreIcon,
  Phone,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { _Store } from "@/lib/types/store/store";
import { API_URL } from "@/lib/config";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "@/apollo/user/user-query";
import { LoadingBar } from "../web/LoadingBar";
import ProductCard from "../web/ProductCard";
import { Product } from "@/lib/types/product/product";
import { LIKE_TARGET_PRODUCT } from "@/apollo/user/user-mutation";
import { T } from "@/lib/types/common";
import { Message } from "@/lib/enums/common.enum";
import { toast } from "sonner";
import { ProductsInquiry } from "@/lib/types/product/product.input";
import { Direction } from "@/lib/enums/comment.enum";
import { Button } from "../ui/button";
import StoreReviews from "./StoreReviews";

interface StoreDetailProps {
  store: _Store;
  onLike?: (storeId: string) => void;
  onFollow?: (ownerId: string | undefined) => void;
}

export default function StoreDetailPage({ store }: StoreDetailProps) {
  const [activeTab, setActiveTab] = useState("products");
  const [filters, setFilters] = useState<ProductsInquiry>({
    page: 1,
    limit: 8,
    sort: "createdAt",
    direction: Direction.DESC,
    search: {
      storeId: store._id,
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */

  const [LikeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT, {});
  const {
    loading: getProductsLoading,
    refetch: getProductsRefetch,
    data: getProductsData,
  } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "cache-and-network",
    variables: {
      input: filters,
    },
    skip: !store._id,
  });
  const storeProducts = getProductsData?.getProducts.list ?? [];

  /* -------------------------------------------------------------------------- */
  /*                                  HANDLERS                                  */
  /* -------------------------------------------------------------------------- */

  const likeProductHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

      await LikeTargetProduct({
        variables: {
          input: id,
        },
      });

      await getProductsRefetch({ input: filters });
      toast("success");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log("LikeProductHandler error", err.message);
        toast(err.message);
      } else {
        toast("Unexpected error occurred");
      }
    }
  };

  const totalProducts =
    getProductsData?.getProducts?.metaCounter?.[0]?.total || 0;
  const totalPages = Math.ceil(totalProducts / filters.limit);

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const rating =
    store.storeComments > 0
      ? store.storeRating / store.storeComments
      : store.storeRating;

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="my-8">
      {/* Store Info Card */}
      <div className="text-sm text-gray-400 mb-8">
        <Link
          href="/stores"
          className="hover:text-pink-500 text-muted-foreground cursor-pointer"
        >
          Stores
        </Link>
        <span className="mx-2">/</span>
        <span>{store.storeName.toLowerCase()}</span>
      </div>
      <div className="mb-6">
        <CardContent className="p-6">
          {/* Store Name & ownerdata */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {/* storeLogo */}
                <Avatar className="h-16 w-16 border-2">
                  <AvatarImage
                    src={`${API_URL}/${store.storeLogo}`}
                    alt={store.ownerData?.memberNick}
                  />
                  <AvatarFallback className="bg-pink-500 text-white text-xs sm:text-sm">
                    {store.storeName[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    {store.storeName.toUpperCase()}
                  </h1>
                  <Link
                    href={"#"}
                    className="flex items-center gap-1.5 text-foreground"
                  >
                    <User className="text-pink-500" />
                    <Link href={`/member-page/${store.ownerData?._id}`}>
                      {store.ownerData?.memberNick}
                    </Link>
                  </Link>
                </div>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl">
                {store.storeDesc}
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {/* Rating */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3.5 w-3.5",
                      i < Math.floor(rating)
                        ? "fill-pink-500 text-pink-500"
                        : "text-muted-foreground/30",
                    )}
                  />
                ))}
              </div>
              <span className="font-semibold">{rating.toFixed(1)}</span>
              <span className="text-muted-foreground">
                ({store.storeComments})
              </span>
            </div>

            <span className="text-muted-foreground/40">·</span>

            {/* Products */}
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Package className="h-3.5 w-3.5 text-pink-500" />
              <span>
                <span className="font-semibold text-foreground">
                  {store.storeProductsCount}
                </span>{" "}
                products
              </span>
            </div>

            <span className="text-muted-foreground/40">·</span>

            {/* Views */}
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Eye className="h-3.5 w-3.5 text-pink-500" />
              <span>
                <span className="font-semibold text-foreground">
                  {store.storeViews}
                </span>{" "}
                views
              </span>
            </div>

            <span className="text-muted-foreground/40">·</span>

            {/* Likes */}
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Heart className="h-3.5 w-3.5 text-pink-500" />
              <span>
                <span className="font-semibold text-foreground">
                  {store.storeLikes}
                </span>{" "}
                likes
              </span>
            </div>

            <span className="text-muted-foreground/40">·</span>
          </div>

          <Separator className="my-4" />

          {/* Location & Contact */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 text-pink-500" />
              <span>{store.storeAddress}</span>
            </div>
            {store.ownerData && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-pink-500" />
                <span>{store.storePhone}</span>
              </div>
            )}
          </div>
        </CardContent>
      </div>

      {/* Tabs Section */}
      <div className="border-border/60">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-border px-6">
            <TabsList className="bg-transparent">
              <TabsTrigger
                value="products"
                className="data-[state=active]:border-b-2 data-[state=active]:border-pink-500 data-[state=active]:text-pink-600 rounded cursor-pointer"
              >
                Products
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:border-b-2 data-[state=active]:border-pink-500 data-[state=active]:text-pink-600 rounded cursor-pointer"
              >
                Reviews ({store.storeComments})
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="data-[state=active]:border-b-2 data-[state=active]:border-pink-500 data-[state=active]:text-pink-600 rounded cursor-pointer"
              >
                About
              </TabsTrigger>
            </TabsList>
          </div>

          <CardContent className="p-6">
            {/* Products Store */}
            <TabsContent value="products" className="mt-0">
              <LoadingBar loading={getProductsLoading} />

              {storeProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-3">
                    {storeProducts.map((product: Product) => (
                      <ProductCard
                        likeProductHandler={likeProductHandler}
                        key={product._id}
                        product={product}
                      />
                    ))}
                  </div>

                  {/* PAGINATION UI */}
                  <div className="mt-12 flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={filters.page === 1}
                      onClick={() => handlePageChange(filters.page - 1)}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <Button
                          key={p}
                          variant={filters.page === p ? "default" : "outline"}
                          className={cn(
                            "w-10 h-10",
                            filters.page === p &&
                              "bg-pink-500 hover:bg-pink-600",
                          )}
                          onClick={() => handlePageChange(p)}
                        >
                          {p}
                        </Button>
                      ),
                    )}

                    <Button
                      variant="outline"
                      size="icon"
                      disabled={filters.page === totalPages}
                      onClick={() => handlePageChange(filters.page + 1)}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Product Not Found</p>
                  </div>
                </>
              )}
            </TabsContent>

            {/* Reviews Store */}
            <TabsContent value="reviews" className="mt-0">
              <StoreReviews id={store._id} />
            </TabsContent>

            {/* About Store */}
            <TabsContent value="about" className="mt-0">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">About this store</h3>
                  <p className="text-muted-foreground">{store.storeDesc}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Store Information</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Location:</dt>
                      <dd className="font-medium">{store.storeAddress}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Member since:</dt>
                      <dd className="font-medium">
                        {store.ownerData &&
                          formatDate(store.ownerData.createdAt)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Last updated:</dt>
                      <dd className="font-medium">
                        {store.ownerData &&
                          formatDate(store.ownerData.updatedAt)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Owner:</dt>
                      <dd className="font-medium">
                        {store.ownerData?.memberNick}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </div>
    </div>
  );
}
