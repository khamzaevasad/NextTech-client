import { Metadata } from "next";
import CsPage from "./CsClient";

export const metadata: Metadata = {
  title: "Customer Support",
  description:
    "Get help and support for your orders, products and account at NextTech",
  keywords: ["customer support", "help", "contact", "support", "nexttech"],
  openGraph: {
    title: "Customer Support | NextTech",
    description:
      "Get help and support for your orders, products and account at NextTech",
    images: ["/og-image.jpg"],
  },
};

export default function Page() {
  return <CsPage />;
}
