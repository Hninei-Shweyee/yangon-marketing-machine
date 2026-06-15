import type { Metadata } from "next";
import { Noto_Sans_Myanmar, Plus_Jakarta_Sans } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { siteContent } from "@/data/siteContent";
import "./globals.css";

const english = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-english"
});

const myanmar = Noto_Sans_Myanmar({
  subsets: ["myanmar"],
  display: "swap",
  variable: "--font-myanmar",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yangonmarketingmachine.com"),
  title: {
    default: siteContent.seo.title,
    template: `%s | ${siteContent.brand.name}`
  },
  description: siteContent.seo.description,
  keywords: [...siteContent.seo.keywords],
  openGraph: {
    title: siteContent.seo.title,
    description: siteContent.seo.description,
    type: "website",
    locale: "en_US",
    siteName: siteContent.brand.name
  },
  twitter: {
    card: "summary_large_image",
    title: siteContent.seo.title,
    description: siteContent.seo.description
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${english.variable} ${myanmar.variable}`}>
      <body className="font-sans antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
