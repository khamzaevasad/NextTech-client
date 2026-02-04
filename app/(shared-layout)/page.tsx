"use client";
import HeroSwiper from "@/components/header/heroSwiper";
import ProductCard from "@/components/home/card";
import { useQuery } from "@apollo/client";
import { GET_SELLER } from "@/apollo/user/user-query";

export default function Home() {
  const { loading, error, data } = useQuery(GET_SELLER, {
    variables: {
      input: {
        page: 1,
        limit: 4,
        search: {},
      },
    },
    fetchPolicy: "cache-and-network",
  });

  if (loading) return <div>Yuklanmoqda...</div>;
  if (error) return <div>Xatolik: {error.message}</div>;
  const sellers = data?.getSeller?.list || [];
  console.log("seller", sellers);
  return (
    <div>
      <HeroSwiper />
      <h2 className="text-xl font-bold mb-4"></h2>
    </div>
  );
}
