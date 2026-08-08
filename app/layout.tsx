import type { Metadata } from "next";
import "./globals.css";
import Providers from "../components/Providers";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CartDrawer } from "../components/CartDrawer";
import { QuickViewModal } from "../components/QuickViewModal";

export const metadata: Metadata = {
  title: "Tazaari | Premium Indian Streetwear",
  description: "Everyday clothes that feel premium without being loud. Born in India and built for the modern urban wardrobe.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {children}
          </main>
          <CartDrawer />
          <QuickViewModal />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
