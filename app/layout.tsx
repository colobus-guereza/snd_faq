import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ThemeInitializer } from "@/components/ThemeInitializer";
import CommonLayout from "@/components/CommonLayout";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "자주 묻는 질문 | 고객센터",
  description: "자주 묻는 질문 FAQ 페이지",
  // Next.js App Router는 app/icon.png를 자동으로 파비콘으로 사용
  // 명시적으로 icon.png를 지정하여 확실하게 설정
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icon.png',
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FAQ',
  },
};

// Next.js 15에서는 viewport와 themeColor를 별도 export로 분리
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#171717' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
          <ThemeInitializer />
          <LanguageProvider>
            <Suspense fallback={<div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">Loading...</div>}>
              <CommonLayout>
                {children}
              </CommonLayout>
            </Suspense>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
