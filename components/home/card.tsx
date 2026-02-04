"use client";

import { Heart, Scale, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface ProductCardProps {
  title?: string;
  price?: number;
  currency?: string;
  brand?: string;
  image?: string;
  rating?: number;
}

export default function ProductCard({
  title = "Dark Project ALU87 Daylight",
  price = 1089000,
  currency = "UZS",
  brand = "Dark Project",
  image = "/keyboard.png",
  rating = 0,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const totalImages = 4;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(price)
      .replace(/,/g, " ");
  };

  return (
    <Card className="w-full max-w-md border-0 shadow-none">
      <CardContent className="p-6">
        {/* Image Section */}
        <div className="relative mb-6 bg-gray-50 rounded-2xl p-8">
          {/* Action Buttons */}
          <div className="absolute right-4 top-4 flex flex-col gap-3">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isFavorite
                    ? "fill-pink-500 stroke-pink-500"
                    : "stroke-gray-400"
                }`}
              />
            </button>
            <button className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Scale className="w-5 h-5 stroke-gray-400" />
            </button>
          </div>

          {/* Product Image */}
          <div className="relative h-48 flex items-center justify-center">
            <Image
              src={image}
              alt={title}
              width={400}
              height={200}
              className="object-contain"
            />
          </div>

          {/* Image Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalImages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`h-1 rounded-full transition-all ${
                  index === currentImage ? "w-8 bg-pink-500" : "w-2 bg-pink-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-gray-900">{title}</h3>

          {/* Rating and Badge */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <svg
                  key={index}
                  className="w-6 h-6 fill-gray-300"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <Badge
              variant="secondary"
              className="bg-pink-100 text-pink-600 hover:bg-pink-100 font-medium px-4 py-1"
            >
              {brand}
            </Badge>
          </div>

          {/* Price */}
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Цена:</p>
            <p className="text-3xl font-bold text-pink-500">
              {formatPrice(price)} {currency}
            </p>
          </div>

          {/* Add to Cart Button */}
          <Button
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-6 rounded-xl text-base"
            size="lg"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />В корзину
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
