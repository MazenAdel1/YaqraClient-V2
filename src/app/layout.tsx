import type { Metadata } from "next";
import { Geist, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { DirectionProvider } from "@base-ui/react";
import localFont from "next/font/local";
import { UserStoreProvider } from "@/providers/user-store-provider";

const fontSans = Noto_Sans_Arabic({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const YOC = localFont({
  src: [
    {
      path: "../../public/fonts/TheYearOfTheCamel-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/TheYearOfTheCamel-ExtraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/TheYearOfTheCamel-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/TheYearOfTheCamel-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/TheYearOfTheCamel-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/TheYearOfTheCamel-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/TheYearOfTheCamel-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-yoc",
});

export const metadata: Metadata = {
  title: "مجتمع يقرأ",
  description: "منصة عربية لقراءة الكتب ومشاركة الأفكار والتوصيات مع الآخرين.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={cn("dark font-sans", fontSans.className, YOC.variable)}
    >
      <body
        className={`${geistSans.variable} bg-dark-gray min-h-dvh text-white antialiased`}
      >
        <DirectionProvider direction="rtl">
          <UserStoreProvider>{children}</UserStoreProvider>
        </DirectionProvider>
      </body>
    </html>
  );
}
