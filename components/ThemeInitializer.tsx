"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeInitializer() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    // 한 번만 실행되도록 체크
    if (hasInitialized) return;

    // 1. 시스템 설정이 있으면 next-themes가 자동으로 처리하므로 그대로 사용
    // 2. 시스템 설정이 없거나 감지되지 않을 경우 시간 기반으로 설정
    if (theme === "system") {
      // systemTheme이 있으면 시스템 설정이 감지된 것 (next-themes가 자동 처리)
      // systemTheme이 없으면 시스템 설정이 없으므로 시간 기반으로 설정
      if (!systemTheme) {
        const currentHour = new Date().getHours();
        // 오전 6시 ~ 오후 6시: 라이트 모드
        // 오후 6시 ~ 오전 6시: 다크 모드
        const timeBasedTheme = currentHour >= 6 && currentHour < 18 ? "light" : "dark";
        setTheme(timeBasedTheme);
      }
    }
    
    setHasInitialized(true);
  }, [theme, systemTheme, setTheme, hasInitialized]);

  return null;
}

