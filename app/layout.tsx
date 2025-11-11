import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ThemeInitializer } from "@/components/ThemeInitializer";
import CommonLayout from "@/components/CommonLayout";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Suspense } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "자주묻는질문",
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
        <Script
          id="error-handler"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // 페이지 로드 전에 오류 핸들러를 가장 먼저 등록
                window.addEventListener('error', function(event) {
                  var errorMessage = event.message || '';
                  if (errorMessage.includes('className.split') || 
                      errorMessage.includes('clickListener') ||
                      errorMessage.includes('el.className.split')) {
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                  }
                }, true);
                
                // Promise rejection도 처리
                window.addEventListener('unhandledrejection', function(event) {
                  var reason = (event.reason && event.reason.message) || String(event.reason || '');
                  if (reason.includes('className.split') || reason.includes('clickListener')) {
                    event.preventDefault();
                  }
                });
                
                // console.error 필터링
                var originalConsoleError = console.error;
                console.error = function() {
                  var errorString = Array.prototype.join.call(arguments, ' ');
                  if (!errorString.includes('className.split') && 
                      !errorString.includes('clickListener') &&
                      !errorString.includes('el.className.split')) {
                    originalConsoleError.apply(console, arguments);
                  }
                };
              })();
            `,
          }}
        />
        <ErrorBoundary />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} forcedTheme="light">
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
