import type { Metadata } from "next";
import "./globals.css";
import CopyrightNoticeFooter from "./ui/copyright_notice";

export const metadata: Metadata = {};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      
      </head>
      <body className="antialiased bg-slate-50 min-h-screen relative">
        {children}
        <CopyrightNoticeFooter/>
      </body>
    </html>
  );
}
