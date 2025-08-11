import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Monad Meme Board",
  description: "Top holders & thresholds for YAKI / CHOG / DAK",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0b0b0f] text-zinc-200 antialiased">{children}</body>
    </html>
  );
}