import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext";
import { BannerProvider } from "@/context/BannerContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { UIProvider } from "@/context/UIContext";
import { WishlistProvider } from "@/context/WishlistContext";
import LayoutContent from "@/components/LayoutContent";
import Providers from "@/components/Providers";
import StyledJsxRegistry from "@/lib/registry";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Baksho - Your Online Grocery Store",
  description: "Shop fresh groceries online. Vegetables, fruits, meat, dairy, and household essentials delivered to your doorstep. Best prices guaranteed!",
  keywords: "grocery, online shopping, fresh vegetables, fruits, meat, dairy, household essentials",
  authors: [{ name: "Baksho" }],
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Baksho - Your Online Grocery Store",
    description: "Shop fresh groceries online with fast delivery",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <StyledJsxRegistry>
          <Providers>
            <LanguageProvider>
              <UIProvider>
                <UserProvider>
                  <WishlistProvider>
                    <BannerProvider>
                      <CartProvider>
                        <LayoutContent>{children}</LayoutContent>
                      </CartProvider>
                    </BannerProvider>
                  </WishlistProvider>
                </UserProvider>
              </UIProvider>
            </LanguageProvider>
          </Providers>
        </StyledJsxRegistry>
      </body>
    </html>
  );
}
