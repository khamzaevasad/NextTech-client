import { Metadata } from "next";
import ProductsPage from "./ProductClient";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse our wide range of latest tech products, devices and electronics",
  keywords: ["products", "electronics", "devices", "tech", "gadgets"],
  openGraph: {
    title: "Products | NextTech",
    description:
      "Browse our wide range of latest tech products, devices and electronics",
    images: ["/og-image.jpg"],
  },
};

export default function Page() {
  return <ProductsPage />;
}
