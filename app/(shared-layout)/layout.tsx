import { Header } from "@/components/header/header";
import ChatWidget from "@/components/web/ChatWidget";
import { Footer } from "@/components/web/Footer";
import { ReactNode } from "react";

export default function SharedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="align-elements">
      <Header />
      {children}
      <ChatWidget />
      <Footer />
    </div>
  );
}
