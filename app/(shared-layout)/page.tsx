"use client";
import HeroSwiper from "@/components/header/heroSwiper";
import ProductCard from "@/components/home/card";
import LatestProducts from "@/components/home/LatestProducts";

export default function Home() {
  return (
    <div>
      <HeroSwiper />
      <LatestProducts />
    </div>
  );
}
