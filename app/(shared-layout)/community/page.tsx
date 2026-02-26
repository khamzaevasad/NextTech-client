import { Metadata } from "next";
import CommunityPage from "./CommunityClient";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Join the NextTech community, share your experience and connect with tech enthusiasts",
  keywords: ["community", "tech community", "forum", "discussions", "nexttech"],
  openGraph: {
    title: "Community | NextTech",
    description:
      "Join the NextTech community, share your experience and connect with tech enthusiasts",
    images: ["/og-image.jpg"],
  },
};

export default function Page() {
  return <CommunityPage />;
}
