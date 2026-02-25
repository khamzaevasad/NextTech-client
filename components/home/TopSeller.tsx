import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { Button } from "../ui/button";
import { SwiperSlide, Swiper } from "swiper/react";
import SellerCard from "../web/SellerCard";
import { Navigation } from "swiper/modules";
import { GET_SELLER } from "@/apollo/user/user-query";
import { useQuery } from "@apollo/client";
import { SellersInquiry } from "@/lib/types/member/member.input";
import { T } from "@/lib/types/common";
import { useState } from "react";
import { Member } from "@/lib/types/member/member";
import { RATING } from "@/lib/config";
import { useTranslations } from "next-intl";

interface SellersProps {
  initialInput?: SellersInquiry;
}

function TopSeller({
  initialInput = {
    page: 1,
    limit: 40,
    search: {},
  },
}: SellersProps) {
  const [sellers, setSellers] = useState<Member[]>([]);
  const t = useTranslations("home.topSellers");
  const {
    loading: getSellerLoading,
    error: getSellerError,
    refetch: getSellerRefetch,
    data: getSellerData,
  } = useQuery(GET_SELLER, {
    fetchPolicy: "cache-and-network",
    variables: { input: initialInput },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setSellers(data?.getSeller?.list ?? []);
    },
  });

  const topSellers = sellers.filter((seller) => seller.memberRank >= RATING);

  return (
    <div className="my-8">
      <div className="flex justify-between items-center my-6">
        <h2 className="text-4xl font-semibold mt-6 tracking-tight md:text-3xl">
          {t("title")}
        </h2>

        {topSellers.length > 0 && (
          <div className="flex gap-3">
            <Button variant={"outline"} className="devices-prev">
              <ArrowBigLeft />
            </Button>
            <Button variant={"outline"} className="devices-next">
              <ArrowBigRight />
            </Button>
          </div>
        )}
      </div>

      {topSellers.length > 0 ? (
        <Swiper
          slidesPerView={4}
          spaceBetween={16}
          navigation={{
            prevEl: ".devices-prev",
            nextEl: ".devices-next",
          }}
          modules={[Navigation]}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 12,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 12,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 16,
            },
          }}
        >
          {topSellers.map((seller) => (
            <SwiperSlide key={seller._id}>
              <SellerCard seller={seller} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No top sellers found</p>
        </div>
      )}
    </div>
  );
}

export default TopSeller;
