"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export function ThemeInitializer() {
  const { setTheme } = useTheme();

  useEffect(() => {
    // 항상 라이트 모드로 설정
    setTheme("light");
  }, [setTheme]);

  return null;
}

