import { Metadata } from "next";
import OrdersPage from "./OrdersClient";

export const metadata: Metadata = {
  title: "Orders",
  description:
    "Track and manage your orders, view order history and delivery status at NextTech",
  keywords: ["orders", "order history", "delivery", "tracking", "nexttech"],
  openGraph: {
    title: "Orders | NextTech",
    description:
      "Track and manage your orders, view order history and delivery status at NextTech",
    images: ["/og-image.jpg"],
  },
};

export default function Page() {
  return <OrdersPage />;
}
