import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "printtie",
  description: "아티스트 작품을 인쇄·판매하는 데모 서비스",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-dvh bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}
