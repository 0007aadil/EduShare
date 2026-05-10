import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "EduShare — Discover & Share Learning Resources",
  description:
    "A community-driven platform for discovering, sharing, and organizing high-quality learning resources with AI-powered curation and personalized recommendations.",
  keywords: ["learning", "education", "resources", "community", "AI", "programming"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-surface-950 text-surface-100 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
