"use client";

import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

// --- Types ---
type Point = { 
  t: number; 
  tuningQuality: number;
  acousticMaturity: number;
  tuningQualityWithout: number;
  acousticMaturityWithout: number;
  isRetunePoint?: boolean;
};

// --- Model helpers (physics-inspired sketches) ---
// 조율 상태/소리 품질 함수 (리튠 후 회복 후 서서히 하락)
function tuningQualityWithRetune(
  t: number,
  retunes: number[],
  base = 70,
  peak = 96,
  tauRise = 1.5,
  tauDecay = 8.0
) {
  let M = base;
  let applied = false;
  let lastRetune = -1;
  
  for (const r of retunes) {
    if (t >= r) {
      lastRetune = r;
      const rise = 1 - Math.exp(-(t - r) / tauRise);
      const decay = Math.exp(-(t - r) / tauDecay);
      M = base + (peak - base) * rise * decay;
      applied = true;
    }
  }
  
  if (!applied && t < retunes[0]) {
    // 첫 리튠 전: 90 이상에서 시작하여 서서히 하락
    M = 92 - t * 0.3; // 0개월 시 92에서 시작, 서서히 하락
  } else if (applied && lastRetune >= 0) {
    // 리튠 직전 최저점을 70±3 범위로 제한
    const nextRetune = retunes.find(r => r > t);
    if (nextRetune) {
      const timeToNextRetune = nextRetune - t;
      // 리튠 직전 1개월 이내일 때 최저점 제한
      if (timeToNextRetune < 1 && M < 67) {
        M = 67 + (70 - 67) * (1 - timeToNextRetune); // 67~70 범위로 제한
      }
    }
  }
  
  return Math.max(0, Math.min(100, M));
}

function tuningQualityWithoutRetune(t: number, start = 92, floor = 55, tauDrift = 18) {
  // 0개월 시 90 이상에서 시작하여 서서히 하락
  return floor + (start - floor) * Math.exp(-t / tauDrift);
}

// 음향 성숙도 함수 (완만한 우상향 곡선 + 리튠 직후 펄스)
function acousticMaturityWithRetune(
  t: number,
  retunes: number[],
  start = 0,
  maxMaturity = 95
) {
  // 기본 완만한 우상향 곡선 (시간에 따른 자연스러운 성숙)
  const baseMaturity = start + (maxMaturity - start) * (1 - Math.exp(-t / 40));
  
  // 리튠 직후 펄스 누적
  let pulseSum = 0;
  for (const r of retunes) {
    if (t >= r) {
      const timeSinceRetune = t - r;
      // 가우시안 형태의 펄스 (리튠 직후 작은 상승)
      const pulseAmplitude = 3; // 펄스 크기
      const pulseWidth = 2; // 펄스 폭 (개월)
      const pulse = pulseAmplitude * Math.exp(-Math.pow(timeSinceRetune / pulseWidth, 2));
      pulseSum += pulse;
    }
  }
  
  return Math.min(100, baseMaturity + pulseSum);
}

function acousticMaturityWithoutRetune(t: number, start = 0, maxMaturity = 25) {
  // 사용만으로도 소폭 안정화가 일어나는 완만한 상승
  return Math.min(maxMaturity, start + t * 0.4);
}

// --- Data generator ---
function generateData(T = 36, stepMonths = 0.25) {
  const retunes = [6, 12, 18, 24, 30];
  const data: Point[] = [];
  for (let tt = 0; tt <= T + 1e-9; tt += stepMonths) {
    const isRetunePoint = retunes.some(r => Math.abs(tt - r) < stepMonths / 2);
    data.push({
      t: +tt.toFixed(2),
      tuningQuality: tuningQualityWithRetune(tt, retunes),
      acousticMaturity: acousticMaturityWithRetune(tt, retunes),
      tuningQualityWithout: tuningQualityWithoutRetune(tt),
      acousticMaturityWithout: acousticMaturityWithoutRetune(tt),
      isRetunePoint: isRetunePoint,
    });
  }
  return { data, retunes } as const;
}

// --- UI ---
export default function AcousticMaturityChart() {
  const { data, retunes } = useMemo(() => generateData(), []);

  return (
    <div className="w-full max-w-5xl mx-auto pt-2 pb-6 space-y-8">
      <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
        조율 상태 및 음향 성숙도 — 정기리튠 효과 비교
      </h2>
      
      {/* 요약 */}
      <div className="bg-transparent dark:bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
          <strong className="font-semibold">요약:</strong> 정기리튠을 하면 <strong>단기 소리품질(조율 정확도)</strong>가 주기적으로 회복되고, 그 반복이 장기 음향성숙도를 서서히 끌어올립니다. 리튠을 하지 않으면 조율 정확도는 완만히 저하되고, 성숙도 상승도 제한적입니다.
        </p>
      </div>
      
      {/* 그래프 A. 소리품질 변화 개념도 (조율 상태·청감 품질) */}
      <div>
        <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">
          그래프 A. 소리품질 변화 개념도 (조율 상태·청감 품질)
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
          그래프 A는 리튠 직후의 단기적 회복을, 그래프 B는 그 누적이 장기적으로 축적되는 과정을 의미합니다.
        </p>
        <div className="h-96 w-full rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 relative" style={{ padding: '8px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 35, right: 35, bottom: 45, left: 55 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis 
                dataKey="t" 
                ticks={[0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36]}
                label={{ value: "시간(개월)", position: "insideBottomRight", offset: -10 }}
                stroke="#6b7280"
                className="dark:text-gray-400"
              />
              <YAxis 
                domain={[0, 100]} 
                label={{ value: "조율상태/소리품질", angle: -90, position: "insideLeft", offset: 5 }}
                stroke="#6b7280"
                className="dark:text-gray-400"
                width={60}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {retunes.map((r) => (
                <ReferenceLine 
                  key={r} 
                  x={r} 
                  strokeDasharray="4 4" 
                  stroke="#f97316"
                  strokeWidth={1.5}
                />
              ))}
              <Line
                type="monotone"
                dataKey="tuningQuality"
                name="정기리튠 실시"
                dot={(props: { cx?: number; cy?: number; payload?: { t?: number; isRetunePoint?: boolean } }) => {
                  const { cx, cy, payload } = props;
                  if (payload?.isRetunePoint) {
                    return (
                      <circle
                        key={`dot-${payload.t}`}
                        cx={cx}
                        cy={cy}
                        r={4}
                        fill="#f97316"
                        stroke="#fff"
                        strokeWidth={1.5}
                      />
                    );
                  }
                  // null을 반환할 수 없으므로 투명한 원을 반환
                  return (
                    <circle
                      key={`dot-empty-${payload?.t || cx}`}
                      cx={cx}
                      cy={cy}
                      r={0}
                      fill="transparent"
                    />
                  );
                }}
                strokeWidth={2}
                stroke="#f97316"
              />
              <Line 
                type="monotone" 
                dataKey="tuningQualityWithout" 
                name="리튠 미실시" 
                dot={false} 
                strokeWidth={2}
                stroke="#9ca3af"
                strokeDasharray="6 4"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 그래프 B. 장기 음향성숙도 개념도 (정기 리튠 효과 모델) */}
      <div>
        <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">
          그래프 B. 장기 음향성숙도 개념도 (정기 리튠 효과 모델)
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
          그래프 A의 단기적 회복이 반복되면서 누적되어 장기적으로 음향 성숙도가 향상되는 과정을 보여줍니다.
        </p>
        <div className="h-96 w-full rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 relative" style={{ padding: '8px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 35, right: 35, bottom: 45, left: 55 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis 
                dataKey="t" 
                ticks={[0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36]}
                label={{ value: "시간(개월)", position: "insideBottomRight", offset: -10 }}
                stroke="#6b7280"
                className="dark:text-gray-400"
              />
              <YAxis 
                domain={[0, 100]} 
                label={{ value: "음향성숙도", angle: -90, position: "insideLeft", offset: 5 }}
                stroke="#6b7280"
                className="dark:text-gray-400"
                width={60}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line 
                type="monotone" 
                dataKey="acousticMaturity" 
                name="정기리튠 실시" 
                dot={false} 
                strokeWidth={2}
                stroke="#f97316"
              />
              <Line 
                type="monotone" 
                dataKey="acousticMaturityWithout" 
                name="리튠 미실시" 
                dot={false} 
                strokeWidth={2}
                stroke="#9ca3af"
                strokeDasharray="6 4"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 개념도 설명 문구 */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic">
          본 도표는 실제 측정값이 아닌, 정기리튠에 따른 조율 상태 및 음향성숙도 변화를 설명하기 위한 개념적 모델입니다.
        </p>
      </div>

      {/* 메커니즘 및 권장 주기 */}
      <div className="mt-8 space-y-6">
        {/* 메커니즘 */}
        <div>
          <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">메커니즘</h4>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300 ml-2">
            <li><strong>정기리튠:</strong> 각 톤필드의 모드 주파수를 목표 비율(F₀, 2F₀, 3F₀)로 재정렬 → 위상 정합·Q 회복 → 스펙트럼 대칭성 개선 → 반복 누적으로 바탕 톤이 성숙.</li>
            <li><strong>리튠 미실시:</strong> 사용에 따른 미세 변형과 잔류응력 재배치 → 피치 드리프트·모드 불균형 확대 → 평균 소리품질 저하, 성숙도 상승 제한.</li>
          </ul>
        </div>

        {/* 권장 주기 */}
        <div>
          <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">권장 주기</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300 ml-2">
            <li><strong>일반/교육·연습 위주:</strong> 6–12개월.</li>
            <li><strong>공연·헤비 유즈:</strong> 3–6개월.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
