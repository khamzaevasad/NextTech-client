"use client";

import Image from "next/image";
import {
  MapPin,
  Star,
  Eye,
  Heart,
  Package,
  Store as StoreIcon,
  Phone,
  Calendar,
  TrendingUp,
  Users,
  Award,
  ArrowLeft,
  Share2,
  Flag,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { _Store } from "@/lib/types/store/store";
import { API_URL } from "@/lib/config";

interface StoreDetailProps {
  store: _Store;
  onLike?: (storeId: string) => void;
  onFollow?: (ownerId: string | undefined) => void;
}

export default function StoreDetailPage({
  store,
  onLike,
  onFollow,
}: StoreDetailProps) {
  const [activeTab, setActiveTab] = useState("products");
  const isLiked =
    store.meLiked && store.meLiked.length > 0 && store.meLiked[0].myFavorite;

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
    <div className="min-h-screen bg-background">
      {/* HEADER SECTION */}
      <div className="relative h-64 sm:h-80 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 dark:from-pink-950/30 dark:via-purple-950/30 dark:to-blue-950/30">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,182,193,0.2),transparent)] dark:bg-[radial-gradient(circle_at_30%_50%,rgba(255,182,193,0.1),transparent)]" />

        {/* Store Logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          {store.storeLogo ? (
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl bg-white dark:bg-gray-900">
              <Image
                src={`${API_URL}/${store.storeLogo}`}
                alt={store.storeName}
                fill
                className="object-contain p-4"
                priority
              />
            </div>
          ) : (
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-2xl">
              <StoreIcon className="h-16 w-16 sm:h-20 sm:w-20 text-white" />
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <Link href="/stores">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/90 backdrop-blur-sm hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        {/* Actions */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm hover:bg-white"
            onClick={() => onLike?.(store._id)}
          >
            <Heart
              className={cn(
                "h-4 w-4",
                isLiked && "fill-pink-500 text-pink-500",
              )}
            />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm hover:bg-white"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm hover:bg-white"
          >
            <Flag className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-12">
        {/* Store Info Card */}
        <Card className="mb-6 border-border/60 shadow-lg">
          <CardContent className="p-6">
            {/* Store Name & Status */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    {store.storeName}
                  </h1>
                  <Badge
                    variant={
                      store.storeStatus === "ACTIVE" ? "default" : "secondary"
                    }
                    className={cn(
                      "text-xs",
                      store.storeStatus === "ACTIVE" &&
                        "bg-pink-600 hover:bg-pink-500",
                    )}
                  >
                    {store.storeStatus}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  {store.storeDesc}
                </p>
              </div>

              <Button
                size="lg"
                className="bg-pink-600 hover:bg-pink-500 text-white font-semibold"
                onClick={() =>
                  store.ownerData?._id && onFollow?.(store.ownerData._id)
                }
              >
                <Users className="h-5 w-5 mr-2" />
                Follow Store
              </Button>
            </div>

            <Separator className="my-4" />

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Rating */}
              <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < Math.floor(rating)
                          ? "fill-pink-500 text-pink-500"
                          : "text-muted-foreground/40",
                      )}
                    />
                  ))}
                </div>
                <p className="text-xl font-bold">{rating.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">
                  {store.storeComments} reviews
                </p>
              </div>

              {/* Products */}
              <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50">
                <Package className="h-6 w-6 text-pink-500 mb-1" />
                <p className="text-xl font-bold">{store.storeProductsCount}</p>
                <p className="text-xs text-muted-foreground">Products</p>
              </div>

              {/* Views */}
              <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50">
                <Eye className="h-6 w-6 text-pink-500 mb-1" />
                <p className="text-xl font-bold">{store.storeViews}</p>
                <p className="text-xs text-muted-foreground">Views</p>
              </div>

              {/* Likes */}
              <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50">
                <Heart className="h-6 w-6 text-pink-500 mb-1" />
                <p className="text-xl font-bold">{store.storeLikes}</p>
                <p className="text-xs text-muted-foreground">Likes</p>
              </div>
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
                  <Calendar className="h-4 w-4 text-pink-500" />
                  <span>Joined {formatDate(store.ownerData.createdAt)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Owner Info Card */}
        {store.ownerData && (
          <Card className="mb-6 border-border/60">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Store Owner</h2>
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 border-2 border-pink-500">
                  <AvatarImage
                    src={store.ownerData.memberImage}
                    alt={store.ownerData.memberNick}
                  />
                  <AvatarFallback className="bg-pink-500 text-white text-lg">
                    {store.ownerData.memberNick[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">
                      {store.ownerData.memberNick}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {store.ownerData.memberType}
                    </Badge>
                    {store.ownerData.memberRank > 0 && (
                      <Badge
                        variant="outline"
                        className="text-xs border-pink-500 text-pink-500"
                      >
                        <Award className="h-3 w-3 mr-1" />
                        Rank {store.ownerData.memberRank}
                      </Badge>
                    )}
                  </div>

                  {store.ownerData.memberDesc && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {store.ownerData.memberDesc}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{store.ownerData.memberFollowers} followers</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>{store.ownerData.memberPoints} points</span>
                    </div>
                    {store.ownerData.memberPhone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <span>{store.ownerData.memberPhone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="hover:bg-pink-50 hover:border-pink-500"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Follow
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs Section */}
        <Card className="border-border/60">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b border-border px-6">
              <TabsList className="bg-transparent">
                <TabsTrigger
                  value="products"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-pink-500 data-[state=active]:text-pink-600 rounded-none"
                >
                  Products ({store.storeProductsCount})
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-pink-500 data-[state=active]:text-pink-600 rounded-none"
                >
                  Reviews ({store.storeComments})
                </TabsTrigger>
                <TabsTrigger
                  value="about"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-pink-500 data-[state=active]:text-pink-600 rounded-none"
                >
                  About
                </TabsTrigger>
              </TabsList>
            </div>

            <CardContent className="p-6">
              <TabsContent value="products" className="mt-0">
                <div className="text-center py-12">
                  <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Store products will be displayed here
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Total: {store.storeProductsCount} products
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-0">
                <div className="text-center py-12">
                  <Star className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Customer reviews will be displayed here
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Total: {store.storeComments} reviews
                  </p>
                </div>
              </TabsContent>

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
                        <dt className="text-muted-foreground">Store ID:</dt>
                        <dd className="font-mono text-xs">{store._id}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
