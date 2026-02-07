import { categories } from "@/lib/data/category";
import DeviceCard from "../web/DeviceCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Grid } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/grid";
import { Button } from "../ui/button";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

function Devices() {
  return (
    <div className="my-8">
      <div className="flex justify-between items-center my-6">
        <h2 className="text-4xl font-semibold">Devices</h2>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          <Button variant={"outline"} className="devices-prev">
            <ArrowBigLeft />
          </Button>
          <Button variant={"outline"} className="devices-next">
            <ArrowBigRight />
          </Button>
        </div>
      </div>

      <Swiper
        slidesPerView={4}
        grid={{
          rows: 2,
          fill: "row",
        }}
        spaceBetween={16}
        navigation={{
          prevEl: ".devices-prev",
          nextEl: ".devices-next",
        }}
        modules={[Navigation, Grid]}
        breakpoints={{
          320: {
            slidesPerView: 1,
            grid: { rows: 2 },
            spaceBetween: 12,
          },
          640: {
            slidesPerView: 2,
            grid: { rows: 2 },
            spaceBetween: 12,
          },
          1024: {
            slidesPerView: 3,
            grid: { rows: 2 },
            spaceBetween: 16,
          },
          1280: {
            slidesPerView: 4,
            grid: { rows: 2 },
            spaceBetween: 16,
          },
        }}
      >
        {categories.map((category) => (
          <SwiperSlide key={category._id}>
            <DeviceCard category={category} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Devices;
