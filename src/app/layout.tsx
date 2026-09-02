import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-heading" });
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Bangpho Coffee & Beer — First Specialty Coffee Workspace",
  description: "Bangpho's first specialty coffee workspace. 40 THB americano, 100+ Mbps WiFi, craft beer on tap. Work all day, stay for craft beer.",
  keywords: ["coworking", "coffee", "craft beer", "Bangpho", "Bangkok", "remote work", "digital nomad"],
  openGraph: {
    title: "Bangpho Coffee & Beer — First Specialty Coffee Workspace",
    description: "Bangpho's first specialty coffee workspace. 40 THB americano, 100+ Mbps WiFi, craft beer on tap.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable}`}>
      <head>
        <link rel="stylesheet" href="/scrollcraft.css" />
      </head>
      <body>
        {children}
        <script src="/scrollcraft.js" />
      </body>
    </html>
  );
}
