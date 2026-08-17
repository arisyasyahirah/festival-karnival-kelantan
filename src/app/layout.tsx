import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "FFK - Festival Filem Kelantan",
  description: "Festival Filem Kelantan (FFK26) Peringkat Antarabangsa 2026",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ms" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <LanguageProvider>
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
