import { GET_PRODUCTS } from "@/apollo/user/user-query";
import { useQuery } from "@apollo/client";
import { Button } from "../ui/button";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Grid } from "swiper/modules";
import ProductCard from "../web/ProductCard";
import { T } from "@/lib/types/common";
import { LoadingBar } from "../web/LoadingBar";

interface StoreProducts {
  storeId: string;
  likeProductHandler?: (user: T, id: string) => Promise<void>;
}

function StoreProduct({ storeId, likeProductHandler }: StoreProducts) {
  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */

  const {
    loading: getProductsLoading,
    error: getProductsError,
    refetch: getProductsRefetch,
    data: getProductsData,
  } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "cache-and-network",
    variables: {
      input: {
        page: 1,
        limit: 40,
        search: {
          storeId: storeId,
        },
      },
    },
    skip: !storeId,
  });
  const storeProducts = getProductsData?.getProducts.list ?? [];

  return (
    <>
      <LoadingBar loading={getProductsLoading} />
      <div className="my-8">
        <div className="flex justify-between items-center my-6">
          <h2 className="text-4xl font-semibold">More from this store</h2>
          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <Button variant={"outline"} className="devices-prev">
              <ArrowBigLeft />
            </Button>
            <Button variant={"outline"} className="devices-next">
              <ArrowBigRight />
            </Button>
          </div>

          {/* Swipper cards */}
        </div>

        <Swiper
          slidesPerView={4}
          slidesPerGroup={4}
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
          {storeProducts.map((product) => (
            <SwiperSlide key={product._id}>
              <ProductCard
                likeProductHandler={likeProductHandler}
                product={product}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}

export default StoreProduct;
