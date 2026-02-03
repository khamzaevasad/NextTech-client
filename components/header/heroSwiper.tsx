"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function HeroSwiper() {
  return (
    <div className="relative w-full mt-4">
      <Swiper
        modules={[Navigation, Pagination]}
        loop
        navigation={{
          nextEl: ".hero-next",
          prevEl: ".hero-prev",
        }}
        pagination={{
          el: ".hero-pagination",
          clickable: true,
        }}
        className="w-full h-[220px] sm:h-[360px] lg:h-[520px]"
      >
        {/* Slide 1 */}
        <SwiperSlide>
          <div className="relative w-full h-full">
            <Image
              src=""
              alt="keyboard"
              fill
              priority
              className="object-cover"
            />
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <div className="relative w-full h-full">
            <Image src="" alt="keyboard" fill className="object-cover" />
          </div>
        </SwiperSlide>

        {/* Slide 3 */}
        <SwiperSlide>
          <div className="relative w-full h-full">
            <Image src="" alt="keyboard" fill className="object-cover" />
          </div>
        </SwiperSlide>
      </Swiper>

      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-3">
        <button className="hero-prev flex h-10 w-10 items-center justify-center rounded-lg bg-pink-600 text-white">
          ←
        </button>
        <button className="hero-next flex h-10 w-10 items-center justify-center rounded-lg bg-pink-600 text-white">
          →
        </button>
      </div>

      {/* Pagination (pastda) */}
      {/* <div className="hero-pagination absolute bottom-4 left-4 z-20 flex gap-2 text-black" /> */}
    </div>
  );
}
