import { Header } from "@/components/header/header";
import ChatWidget from "@/components/web/ChatWidget";
import { Footer } from "@/components/web/Footer";
import { AuthInitializer } from "@/lib/auth/AuthInitializer";
import { ReactNode } from "react";

export default function SharedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <ChatWidget />
      <Footer />
    </>
  );
}
