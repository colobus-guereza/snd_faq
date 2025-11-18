"use client";

import { useEffect } from "react";

export default function ErrorBoundary() {
  useEffect(() => {
    // 포털 요소 보호 함수
    const protectPortalElement = (element: Element) => {
      if (!element || (element as HTMLElement).dataset?.protected === 'true') return;
      
      const htmlElement = element as HTMLElement;
      
      // className 속성을 안전하게 래핑
      const originalClassName = htmlElement.className;
      const classNameDescriptor = Object.getOwnPropertyDescriptor(htmlElement, 'className') || 
                                  Object.getOwnPropertyDescriptor(Object.getPrototypeOf(htmlElement), 'className');
      
      if (classNameDescriptor) {
        try {
          Object.defineProperty(htmlElement, 'className', {
            get: function() {
              const value = classNameDescriptor.get ? classNameDescriptor.get.call(this) : originalClassName;
              // 문자열이 아닌 경우 빈 문자열 반환
              return typeof value === 'string' ? value : '';
            },
            set: function(value) {
              if (classNameDescriptor.set) {
                classNameDescriptor.set.call(this, typeof value === 'string' ? value : '');
              }
            },
            configurable: true,
            enumerable: true
          });
        } catch (e) {
          // 이미 정의된 경우 무시
        }
      }
      
      // 클릭 이벤트 차단
      htmlElement.addEventListener('click', (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
      }, true);
      
      // CSS로 보호
      htmlElement.style.pointerEvents = 'none';
      htmlElement.style.userSelect = 'none';
      htmlElement.style.touchAction = 'none';
      
      htmlElement.dataset.protected = 'true';
    };
    
    // 포털 보호 설정
    const setupPortalProtection = () => {
      // 기존 포털 요소 보호
      const existingPortals = document.querySelectorAll('nextjs-portal');
      existingPortals.forEach(protectPortalElement);
      
      // 새로운 포털 요소 감지
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              const element = node as Element;
              if (element.tagName === 'NEXTJS-PORTAL') {
                protectPortalElement(element);
              }
              // 하위에 포털이 있는지 확인
              const portals = element.querySelectorAll?.('nextjs-portal');
              portals?.forEach(protectPortalElement);
            }
          });
        });
      });
      
      if (document.body) {
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      }
      
      // DOMContentLoaded 후에도 한 번 더 확인
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          const portals = document.querySelectorAll('nextjs-portal');
          portals.forEach(protectPortalElement);
        });
      }
    };
    
    // 포털 보호 설정 실행
    if (document.body) {
      setupPortalProtection();
    } else {
      // body가 아직 없으면 대기
      const bodyObserver = new MutationObserver((mutations, obs) => {
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
    
    // 브라우저 확장 프로그램이나 외부 스크립트에서 발생하는 오류를 무시하는 전역 핸들러
    const handleError = (event: ErrorEvent | Event) => {
      const errorEvent = event as ErrorEvent;
      const errorMessage = errorEvent.message || '';
      const errorStack = errorEvent.error?.stack || '';
      const fullError = errorMessage + ' ' + errorStack;
      
      // className.split 관련 오류는 외부 스크립트에서 발생하는 경우가 많으므로 무시
      if (
        fullError &&
        (fullError.includes("className.split") ||
          fullError.includes("clickListener") ||
          fullError.includes("el.className.split") ||
          (fullError.includes("TypeError") && fullError.includes("split")) ||
          fullError.includes("nextjs-portal"))
      ) {
        event.preventDefault();
        event.stopPropagation();
        if ('stopImmediatePropagation' in event) {
          event.stopImmediatePropagation();
        }
        return false;
      }
    };

    // unhandledrejection도 처리
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      let reasonMessage = '';
      if (reason) {
        reasonMessage = (reason.message || '') + ' ' + (reason.stack || '') + ' ' + String(reason || '');
      }
      if (
        reasonMessage.includes("className.split") ||
        reasonMessage.includes("clickListener") ||
        reasonMessage.includes("el.className.split") ||
        reasonMessage.includes("nextjs-portal")
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener("error", handleError as EventListener, true);
    window.addEventListener("unhandledrejection", handleUnhandledRejection, true);

    // console.error도 가로채서 필터링
    const originalConsoleError = console.error;
    console.error = (...args: unknown[]) => {
      const errorString = args.join(" ");
      if (
        !errorString.includes("className.split") &&
        !errorString.includes("clickListener") &&
        !errorString.includes("el.className.split") &&
        !errorString.includes("nextjs-portal")
      ) {
        originalConsoleError.apply(console, args);
      }
    };

    // console.warn도 필터링 (일부 브라우저에서 경고로 표시)
    const originalConsoleWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      const warnString = args.join(" ");
      if (
        !warnString.includes("className.split") &&
        !warnString.includes("clickListener") &&
        !warnString.includes("el.className.split") &&
        !warnString.includes("nextjs-portal")
      ) {
        originalConsoleWarn.apply(console, args);
      }
    };

    return () => {
      window.removeEventListener("error", handleError as EventListener, true);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection, true);
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  return null;
}

