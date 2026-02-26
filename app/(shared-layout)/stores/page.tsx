import { Metadata } from "next";
import StorePage from "./StoreClient";

export const metadata: Metadata = {
  title: "Stores",
  description:
    "Discover top-rated tech stores and find the best deals on electronics and gadgets",
  keywords: [
    "stores",
    "tech stores",
    "electronics shops",
    "gadgets",
    "nexttech",
  ],
  openGraph: {
    title: "Stores | NextTech",
    description:
      "Discover top-rated tech stores and find the best deals on electronics and gadgets",
    images: ["/og-image.jpg"],
  },
};

export default function Page() {
  return <StorePage />;
}
