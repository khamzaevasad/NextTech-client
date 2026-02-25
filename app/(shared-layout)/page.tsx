"use client";
import HeroSwiper from "@/components/header/heroSwiper";
import About from "@/components/home/About";
import Devices from "@/components/home/Devices";
import LatestProducts from "@/components/home/LatestProducts";
import TopProducts from "@/components/home/TopProducts";
import TopStores from "@/components/home/TopStores";

export default function Home() {
  return (
    <div>
      <HeroSwiper />
      <LatestProducts />
      <Devices />
      <About />
      <TopStores />
      <TopProducts />
    </div>
  );
}
