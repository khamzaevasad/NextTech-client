import Home from "@/components/home/MainHome";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "NextTech — Best tech products, latest devices and top stores",
};

export default function Page() {
  return <Home />;
}
