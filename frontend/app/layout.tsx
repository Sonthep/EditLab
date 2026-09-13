import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { LanguageProvider } from "@/lib/LanguageContext";

export const metadata: Metadata = {
  title: "EditLab — Make every cut count",
  description: "Personal AI video editing coach. Learn editing thinking, practice in DaVinci Resolve, and sharpen your craft.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex bg-[#f8faf8] text-[#141f19] font-sans antialiased">
        <LanguageProvider>
          <Sidebar />
          <main className="flex-1 min-h-screen bg-[#f8faf8] overflow-y-auto px-6 sm:px-10 py-8">
            <div className="max-w-6xl mx-auto">{children}</div>
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}
