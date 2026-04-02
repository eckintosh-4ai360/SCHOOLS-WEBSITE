import { Poppins, Sora } from "next/font/google";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Eckintosh Academy",
    default: "Eckintosh Academy - Empowering Minds, Shaping Futures",
  },
  description:
    "Eckintosh Academy is a leading K-12 institution committed to academic excellence, character, and community. Explore our programs, news, and admissions information.",
  keywords: ["school", "academy", "education", "K-12", "Eckintosh Academy"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${sora.variable} antialiased`} suppressHydrationWarning>
        {children}
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </body>
    </html>
  );
}
