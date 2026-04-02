import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eckintosh Academy — Empowering Minds, Shaping Futures",
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
