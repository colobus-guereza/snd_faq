"use client";

import { useEffect } from "react";

export default function ErrorBoundary() {
  useEffect(() => {
    // 브라우저 확장 프로그램이나 외부 스크립트에서 발생하는 오류를 무시하는 전역 핸들러
    const handleError = (event: ErrorEvent | Event) => {
      const errorMessage = event instanceof ErrorEvent ? event.message : String(event);
      
      // className.split 관련 오류는 외부 스크립트에서 발생하는 경우가 많으므로 무시
      if (
        errorMessage &&
        (errorMessage.includes("className.split") ||
          errorMessage.includes("clickListener") ||
          errorMessage.includes("el.className.split"))
      ) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    };

    // unhandledrejection도 처리
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason?.message || String(event.reason || "");
      if (
        reason.includes("className.split") ||
        reason.includes("clickListener")
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener("error", handleError as EventListener, true);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    // console.error도 가로채서 필터링
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      const errorString = args.join(" ");
      if (
        !errorString.includes("className.split") &&
        !errorString.includes("clickListener") &&
        !errorString.includes("el.className.split")
      ) {
        originalConsoleError.apply(console, args);
      }
    };

    return () => {
      window.removeEventListener("error", handleError as EventListener, true);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      console.error = originalConsoleError;
    };
  }, []);

  return null;
}

