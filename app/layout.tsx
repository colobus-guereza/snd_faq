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
                // 포털 요소 보호 함수
                function protectPortalElement(element) {
                  if (!element || element.dataset.protected === 'true') return;
                  
                  // className 속성을 안전하게 래핑
                  var originalClassName = element.className;
                  var classNameDescriptor = Object.getOwnPropertyDescriptor(element, 'className') || 
                                            Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'className');
                  
                  if (classNameDescriptor) {
                    Object.defineProperty(element, 'className', {
                      get: function() {
                        var value = classNameDescriptor.get ? classNameDescriptor.get.call(this) : originalClassName;
                        // 문자열이 아닌 경우 빈 문자열 반환
                        return typeof value === 'string' ? value : '';
                      },
                      set: function(value) {
                        if (classNameDescriptor.set) {
                          classNameDescriptor.set.call(this, typeof value === 'string' ? value : '');
                        } else {
                          originalClassName = typeof value === 'string' ? value : '';
                        }
                      },
                      configurable: true,
                      enumerable: true
                    });
                  }
                  
                  // 클릭 이벤트 차단
                  element.addEventListener('click', function(e) {
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                  }, true);
                  
                  // CSS로 보호
                  element.style.pointerEvents = 'none';
                  element.style.userSelect = 'none';
                  element.style.touchAction = 'none';
                  
                  element.dataset.protected = 'true';
                }
                
                // MutationObserver로 포털 요소 감지 및 보호
                function setupPortalProtection() {
                  // 기존 포털 요소 보호
                  var existingPortals = document.querySelectorAll('nextjs-portal');
                  existingPortals.forEach(protectPortalElement);
                  
                  // 새로운 포털 요소 감지
                  var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                      mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                          if (node.tagName === 'NEXTJS-PORTAL') {
                            protectPortalElement(node);
                          }
                          // 하위에 포털이 있는지 확인
                          var portals = node.querySelectorAll ? node.querySelectorAll('nextjs-portal') : [];
                          portals.forEach(protectPortalElement);
                        }
                      });
                    });
                  });
                  
                  observer.observe(document.body, {
                    childList: true,
                    subtree: true
                  });
                  
                  // DOMContentLoaded 후에도 한 번 더 확인
                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', function() {
                      var portals = document.querySelectorAll('nextjs-portal');
                      portals.forEach(protectPortalElement);
                    });
                  }
                }
                
                // 페이지 로드 전에 오류 핸들러를 가장 먼저 등록
                window.addEventListener('error', function(event) {
                  var errorMessage = event.message || '';
                  var errorStack = event.error && event.error.stack ? event.error.stack : '';
                  var fullError = errorMessage + ' ' + errorStack;
                  
                  if (fullError.includes('className.split') || 
                      fullError.includes('clickListener') ||
                      fullError.includes('el.className.split') ||
                      (fullError.includes('TypeError') && fullError.includes('split')) ||
                      fullError.includes('nextjs-portal')) {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    return false;
                  }
                }, true);
                
                // Promise rejection도 처리
                window.addEventListener('unhandledrejection', function(event) {
                  var reason = event.reason;
                  var reasonMessage = '';
                  if (reason) {
                    reasonMessage = (reason.message || '') + ' ' + (reason.stack || '') + ' ' + String(reason || '');
                  }
                  if (reasonMessage.includes('className.split') || 
                      reasonMessage.includes('clickListener') ||
                      reasonMessage.includes('el.className.split') ||
                      reasonMessage.includes('nextjs-portal')) {
                    event.preventDefault();
                    event.stopPropagation();
                  }
                }, true);
                
                // console.error 필터링
                var originalConsoleError = console.error;
                console.error = function() {
                  var errorString = Array.prototype.join.call(arguments, ' ');
                  if (!errorString.includes('className.split') && 
                      !errorString.includes('clickListener') &&
                      !errorString.includes('el.className.split') &&
                      !errorString.includes('nextjs-portal')) {
                    originalConsoleError.apply(console, arguments);
                  }
                };
                
                // console.warn도 필터링 (일부 브라우저에서 경고로 표시)
                var originalConsoleWarn = console.warn;
                console.warn = function() {
                  var warnString = Array.prototype.join.call(arguments, ' ');
                  if (!warnString.includes('className.split') && 
                      !warnString.includes('clickListener') &&
                      !warnString.includes('el.className.split') &&
                      !warnString.includes('nextjs-portal')) {
                    originalConsoleWarn.apply(console, arguments);
                  }
                };
                
                // 포털 보호 설정 (DOM이 준비되면 실행)
                if (document.body) {
                  setupPortalProtection();
                } else {
                  // body가 아직 없으면 대기
                  var bodyObserver = new MutationObserver(function(mutations, obs) {
                    if (document.body) {
                      setupPortalProtection();
                      obs.disconnect();
                    }
                  });
                  bodyObserver.observe(document.documentElement, {
                    childList: true,
                    subtree: true
                  });
                }
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
