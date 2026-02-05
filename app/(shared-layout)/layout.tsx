import { Header } from "@/components/header/header";
import { AuthInitializer } from "@/lib/auth/AuthInitializer";
import { ReactNode } from "react";

export default function SharedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
