"use client";
import HeroSwiper from "@/components/header/heroSwiper";
import About from "@/components/home/About";
import Devices from "@/components/home/Devices";
import LatestProducts from "@/components/home/LatestProducts";

export default function Home() {
  return (
    <div>
      <HeroSwiper />
      <LatestProducts />
      <Devices />
      <About />
    </div>
  );
}
