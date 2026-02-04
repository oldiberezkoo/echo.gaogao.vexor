import type { Metadata } from "next";
import { ViewTransitions } from "next-view-transitions";
import { Rubik } from "next/font/google"; // Оптимизированная загрузка шрифтов

import "@/shared/app.stylesheet.css";
import { RootProvider } from "@/shared/providers/root-provider";

// Настройка шрифта с использованием переменных для Tailwind или CSS
const rubik = Rubik({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-rubik",
  display: "swap",
});

export const metadata: Metadata = {
  title: "vexor.gaoinside",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      noimageindex: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" className={rubik.variable} suppressHydrationWarning>
        <head>
          <style suppressHydrationWarning>
            {`html { background-color: #191919; }`}
          </style>
        </head>
        <body className="antialiased">
          <RootProvider>{children}</RootProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
