"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Octave resonance visualization:
 * - Drive note: C4 = 261.63 Hz
 * - Sympathetic ring: C5 = 523.25 Hz (weaker, with light decay)
 * - Coordinate system: x = time (ms), y = normalized amplitude
 * - Plots: C4 (blue), C5 (orange), Sum (black)
 * - Vertical guides at k*T0 show phase alignment every C4 period
 */
export default function OctaveResonancePlot() {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 360 });

  // Constants
  const f0 = 261.63; // C4
  const f1 = 523.25; // C5 = 2*f0
  const T0 = 1 / f0; // seconds
  const duration = 0.04; // 40 ms window for clarity
  const sampleRate = 2400; // drawing resolution (points per second)
  const n = Math.floor(duration * sampleRate);
  const decay = 20; // per-second exponential decay for sympathetic C5
  const c5Gain = 0.33; // C5 amplitude relative to C4

  // SVG viewport (원본 크기 - viewBox로 반응형 처리)
  const W = 900; // 원본 너비
  const H = 360; // 원본 높이
  const padL = 60;
  const padR = 20;
  const padT = 30;
  const padB = 40;

  // 컨테이너 크기 감지 (표시용)
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const maxWidth = Math.min(900, containerWidth - 32); // 패딩 고려
        const calculatedHeight = (maxWidth / 900) * 360;
        setDimensions({ width: maxWidth, height: calculatedHeight });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Helpers (원본 크기 기준)
  const xScale = (t: number) =>
    padL + (t / duration) * (W - padL - padR);
  const yScale = (y: number) =>
    padT + (1 - (y + 1) / 2) * (H - padT - padB); // map [-1,1] -> [padT, H-padB]

  const data = useMemo(() => {
    const ptsC4: string[] = [];
    const ptsC5: string[] = [];
    const ptsSum: string[] = [];
    const times: number[] = [];
    for (let i = 0; i <= n; i++) {
      const t = (i / sampleRate); // seconds
      const y0 = Math.sin(2 * Math.PI * f0 * t);
      const y1 = c5Gain * Math.exp(-decay * t) * Math.sin(2 * Math.PI * f1 * t);
      const ys = y0 + y1;

      ptsC4.push(`${xScale(t)},${yScale(y0)}`);
      ptsC5.push(`${xScale(t)},${yScale(y1)}`);
      ptsSum.push(`${xScale(t)},${yScale(ys)}`);
      times.push(t);
    }
    return { ptsC4: ptsC4.join(" "), ptsC5: ptsC5.join(" "), ptsSum: ptsSum.join(" ") };
  }, [n, sampleRate, f0, f1, decay, c5Gain]);

  const guides = useMemo(() => {
    const lines: { x: number; label: string }[] = [];
    for (let k = 0; k * T0 <= duration + 1e-9; k++) {
      const t = k * T0;
      lines.push({ x: xScale(t), label: k === 0 ? "0" : `k=${k}` });
    }
    return lines;
  }, [T0, duration]);

  // Axis ticks
  const xTicks = useMemo(() => {
    const step = T0; // show ticks each C4 period
    const ticks: { x: number; tms: number }[] = [];
    for (let t = 0; t <= duration + 1e-9; t += step) {
      ticks.push({ x: xScale(t), tms: Math.round(t * 1000) });
    }
    return ticks;
  }, [duration, T0]);

  const yTicks = [-1, -0.5, 0, 0.5, 1];

  const ms = (s: number) => (s * 1000).toFixed(2);

  return (
    <div className="w-full flex flex-col items-center gap-4 p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center">
        {language === "ko" ? "C4-C5 옥타브 공명 개념도" : "C4-C5 Octave Resonance Concept Diagram"}
      </h2>

      <p className="text-sm text-gray-700 dark:text-gray-300 max-w-3xl leading-relaxed text-center">
        {language === "ko" 
          ? "일반 악기에서는 C4를 연주하면 주로 C4만 진동하지만, 핸드팬은 C4 하나의 톤필드 안에 C4(토닉)·C5(옥타브)·G5(복합5도)가 함께 세팅되어 있습니다. 따라서 C4를 칠 때 같은 음계의 옥타브(C5)가 위상적으로 결속되어 함께 공명하는 것은 자연스러운 현상입니다. 아래 그래프는 시간-진폭 좌표계에서 C4(파란색), C5(주황색), 합성파(검정색)를 그립니다. 수직 가이드선은 C4의 한 주기 T₀마다 찍혀 위상정합 지점을 표시합니다. f(C5)=2·f(C4)이므로, 매 T₀마다 두 파는 다시 위상정합됩니다. 이는 조율이 잘된 악기일수록 더 명확하게 들리며, 핸드팬의 음질 품질을 나타내는 긍정적 징후입니다."
          : "In general instruments, when C4 is played, mainly C4 vibrates, but in a handpan, C4 (tonic), C5 (octave), and G5 (compound 5th) are set together within each tone field. Therefore, when C4 is played, it is a natural phenomenon for the octave (C5) of the same scale to be phase-locked and resonate together. The graph below plots C4 (blue), C5 (orange), and the composite wave (black) in a time-amplitude coordinate system. Vertical guide lines are marked at each C4 period T₀ to show phase alignment points. Since f(C5)=2·f(C4), the two waves realign in phase every T₀. This is heard more clearly in well-tuned instruments and is a positive sign indicating the sound quality of the handpan."}
      </p>
      
      {/* 그래프 캡션 */}
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center italic">
        {language === "ko" 
          ? "C4-C5의 합성파형을 단순화한 개념적 모델. 실제 측정값이 아님." 
          : "Conceptual model simplifying the composite waveform of C4-C5. Not actual measured values."}
      </p>

      <div ref={containerRef} className="w-full overflow-x-auto rounded-xl ring-1 ring-gray-200 dark:ring-gray-700">
        <svg 
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-auto"
          role="img" 
          aria-label={language === "ko" ? "옥타브 공명 차트" : "Octave resonance chart"}
        >
          {/* Background */}
          <rect x={0} y={0} width={W} height={H} fill="#ffffff" className="dark:fill-gray-900" />

          {/* Axes */}
          <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="#333" className="dark:stroke-gray-300" strokeWidth={1} />
          <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="#333" className="dark:stroke-gray-300" strokeWidth={1} />

          {/* Y ticks and labels */}
          {yTicks.map((yt) => (
            <g key={yt}>
              <line
                x1={padL - 5}
                x2={W - padR}
                y1={yScale(yt)}
                y2={yScale(yt)}
                stroke="#eee"
                className="dark:stroke-gray-700"
                strokeWidth={1}
              />
              <text x={padL - 10} y={yScale(yt) + 4} fontSize={12} textAnchor="end" fill="#555" className="dark:fill-gray-400">
                {yt.toFixed(1)}
              </text>
            </g>
          ))}

          {/* X ticks and labels */}
          {xTicks.map((tk, i) => (
            <g key={i}>
              <line
                x1={tk.x}
                x2={tk.x}
                y1={H - padB}
                y2={padT}
                stroke="#f8f8f8"
                className="dark:stroke-gray-800"
                strokeWidth={1}
              />
              <line
                x1={tk.x}
                x2={tk.x}
                y1={H - padB}
                y2={H - padB + 6}
                stroke="#333"
                className="dark:stroke-gray-300"
                strokeWidth={1}
              />
              <text x={tk.x} y={H - padB + 20} fontSize={12} textAnchor="middle" fill="#555" className="dark:fill-gray-400">
                {tk.tms} ms
              </text>
            </g>
          ))}

          {/* Guide lines at k*T0 where phases realign */}
          {guides.map((g, i) => (
            <g key={`g-${i}`}>
              <line x1={g.x} x2={g.x} y1={padT} y2={H - padB} stroke="#cbd5e1" className="dark:stroke-gray-700" strokeDasharray="4,4" />
              {i !== 0 && (
                <text x={g.x + 4} y={padT + 14} fontSize={11} fill="#64748b" className="dark:fill-gray-400">
                  k·T₀
                </text>
              )}
            </g>
          ))}

          {/* Labels */}
          <text x={padL - 30} y={padT - 10} fontSize={12} fill="#333" className="dark:fill-gray-300" textAnchor="end">
            {language === "ko" ? "진폭" : "Amplitude"}
          </text>
          <text x={W - padR} y={H - padB + 32} fontSize={12} fill="#333" className="dark:fill-gray-300" textAnchor="end">
            {language === "ko" ? "시간 (밀리초)" : "Time (ms)"}
          </text>

          {/* Waveforms */}
          <polyline points={data.ptsC4} fill="none" stroke="#2563eb" strokeWidth={2} />
          <polyline points={data.ptsC5} fill="none" stroke="#f59e0b" strokeWidth={2} />
          <polyline points={data.ptsSum} fill="none" stroke="#111827" className="dark:stroke-gray-200" strokeWidth={2} />

          {/* Legend */}
          <g transform={`translate(${W - padR - 220}, ${padT + 8})`}>
            <rect width="220" height="54" fill="#ffffff" stroke="#e5e7eb" className="dark:fill-gray-900 dark:stroke-gray-700" />
            <LegendItem y={12} color="#2563eb" label={language === "ko" ? "C4 (261.63 Hz)" : "C4 (261.63 Hz)"} />
            <LegendItem y={30} color="#f59e0b" label={language === "ko" ? "C5 (523.25 Hz, 약한 공명·감쇠)" : "C5 (523.25 Hz, weak resonance·decay)"} />
            <LegendItem y={48} color="#111827" label={language === "ko" ? "합성파 C4 + C5 (위상합성)" : "Composite C4 + C5 (Phase Synthesis)"} />
          </g>
        </svg>
      </div>

      {/* 참고 섹션 */}
      <div className="w-full" style={{ maxWidth: `${W}px` }}>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            {language === "ko" ? "참고" : "Note"}
          </h3>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              {language === "ko"
                ? "본 도표는 실제 녹음 데이터가 아니라, 옥타브 간(1:2 주파수 비율)의 위상정합에 따른 진폭 상호작용을 단순화하여 시각적으로 모델링한 파형입니다. 조율 정합이 양호할수록 두 톤필드가 주기적으로 결속된 에너지를 공유한다는 원리를 표현한 개념도입니다."
                : "This diagram is not actual recorded data, but a waveform visually modeled by simplifying amplitude interactions due to phase alignment between octaves (1:2 frequency ratio). It is a conceptual diagram expressing the principle that the better the tuning alignment, the more periodically the two tone fields share coupled energy."}
            </p>
            <p>
              {language === "ko"
                ? "본 페이지는 핸드팬의 옥타브 공명 현상을 이해하기 위한 이론적 모델 개념도입니다. 실제 측정 데이터가 아닌 주파수 비율(1:2) 기반의 단순화된 파형 합성 예시로, 조율 품질이 우수할수록 두 모드가 위상적으로 안정된 공결 상태를 형성한다는 원리를 시각적으로 설명합니다."
                : "This page is a conceptual diagram of a theoretical model for understanding the octave resonance phenomenon of a handpan. It is a simplified waveform synthesis example based on a frequency ratio (1:2), not actual measured data, visually explaining the principle that the better the tuning quality, the more phase-stable the two modes become, forming a coupled state."}
            </p>
          </div>
        </div>
      </div>

      <DetailsPanel f0={f0} f1={f1} T0={T0} language={language} />

      {/* 해설란 */}
      <div className="w-full" style={{ maxWidth: `${W}px` }}>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            {language === "ko" ? "도표 해설" : "Diagram Explanation"}
          </h3>
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {language === "ko" ? "1. 옥타브 공명이란?" : "1. What is Octave Resonance?"}
              </p>
              <p>
                {language === "ko"
                  ? "도표에서 보는 것처럼, C4를 연주하면 옥타브 관계인 C5가 자동으로 함께 진동합니다. 이는 두 음의 주파수 비가 정확히 1:2일 때 발생하는 자연스러운 현상입니다. 파란색(C4)과 주황색(C5) 파형이 주기적으로 겹치는 지점에서 검정색 합성파의 진폭이 커지는 것을 확인할 수 있습니다."
                  : "As shown in the diagram, when C4 is played, C5, which is in an octave relationship, automatically vibrates together. This is a natural phenomenon that occurs when the frequency ratio of the two notes is exactly 1:2. You can see that at points where the blue (C4) and orange (C5) waveforms periodically overlap, the amplitude of the black composite wave increases."}
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {language === "ko" ? "2. 왜 새 악기에서 더 도드라지게 들릴까요?" : "2. Why is it more prominent in new instruments?"}
              </p>
              <p>
                {language === "ko"
                  ? "새 악기는 C4와 C5의 주파수 비가 매우 정확하게 1:2로 맞춰져 있어, 위상정합이 주기적으로 완벽하게 이루어집니다. 도표의 수직 가이드선(k·T₀)이 보여주는 것처럼, 매 주기마다 두 파형이 같은 위상으로 만나 에너지가 최대한 증폭됩니다. 시간이 지나면서 미세한 조율 변화가 생기면 이 위상정합이 약간 느슨해져 공명 강도가 감소합니다."
                  : "New instruments have a very precise 1:2 frequency ratio between C4 and C5, allowing phases to periodically bind perfectly. As shown by the vertical guide lines (k·T₀) in the diagram, the two waveforms meet at the same phase every cycle, maximizing energy amplification. Over time, subtle tuning changes cause this binding to loosen slightly, reducing resonance intensity."}
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {language === "ko" ? "3. 이것이 정상인가요?" : "3. Is this normal?"}
              </p>
              <p>
                {language === "ko"
                  ? "네, 완전히 정상입니다. 오히려 조율이 정확하게 이루어졌다는 긍정적 신호입니다. 핸드팬은 여러 배음이 함께 울리며 풍성함을 만드는 악기이므로, 옥타브 공명은 핸드팬의 본질적인 특성입니다. C5의 고역 성분(C6, G6)이 함께 들리는 것도 하모닉스 정렬(1:2:3 비)이 잘 구현되었다는 의미입니다."
                  : "Yes, it's completely normal. In fact, it's a positive sign that tuning has been done accurately. Since handpans are instruments that create richness by resonating multiple harmonics together, octave resonance is an essential characteristic of handpans. The high-frequency components of C5 (C6, G6) being heard together also indicates that harmonic alignment (1:2:3 ratio) has been well implemented."}
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {language === "ko" ? "4. 시간이 지나면서 어떻게 변하나요?" : "4. How does it change over time?"}
              </p>
              <p>
                {language === "ko"
                  ? "사용하면서 금속 내부 응력이 완화되고 미세한 변형이 누적되면, C4와 C5의 주파수 비가 약간 어긋날 수 있습니다. 이 경우 도표에서 보이는 주기적 위상정합이 완벽하지 않게 되어 공명 강도가 감소합니다. 하지만 이는 자연스러운 성숙 과정이며, 소리는 부드러워지면서 하모닉스의 에너지 분포가 더 균형 있게 됩니다. 정기 리튠을 통해 이 상태를 복원할 수 있습니다."
                  : "As you use the instrument, internal stress in the metal relaxes and subtle deformations accumulate, which can slightly misalign the frequency ratio between C4 and C5. In this case, the periodic phase binding shown in the diagram becomes less perfect, reducing resonance intensity. However, this is a natural maturation process, and the sound becomes softer while the energy distribution of harmonics becomes more balanced. Regular retuning can restore this state."}
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {language === "ko" ? "5. 연주에 어떻게 활용할 수 있나요?" : "5. How can I use this in playing?"}
              </p>
              <p>
                {language === "ko"
                  ? "옥타브 공명을 이해하면 더 풍부한 연주가 가능합니다. C4를 연주할 때 C5가 자연스럽게 함께 울리므로, 의도적으로 C5를 따로 연주하지 않아도 화음 같은 풍성함을 얻을 수 있습니다. 또한 연주 강도에 따라 공명 강도가 달라지므로, 다양한 다이내믹으로 표현력을 확장할 수 있습니다. 이는 핸드팬만의 독특한 음색 특성입니다."
                  : "Understanding octave resonance enables richer playing. When you play C4, C5 naturally resonates together, so you can achieve chord-like richness without intentionally playing C5 separately. Additionally, since resonance intensity varies with playing strength, you can expand your expressive range with various dynamics. This is a unique timbral characteristic of handpans."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendItem({ y, color, label }: { y: number; color: string; label: string }) {
  return (
    <g transform={`translate(10, ${y})`}>
      <line x1={0} y1={0} x2={18} y2={0} stroke={color} strokeWidth={3} />
      <text x={26} y={4} fontSize={12} fill="#334155" className="dark:fill-gray-200">
        {label}
      </text>
    </g>
  );
}

function DetailsPanel({ f0, f1, T0, language }: { f0: number; f1: number; T0: number; language: string }) {
  const ms = (s: number) => (s * 1000).toFixed(2);
  const W = 900; // 도표 너비와 동일하게 설정
  return (
    <section className="w-full text-sm text-gray-700 dark:text-gray-300 leading-relaxed" style={{ maxWidth: `${W}px` }}>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h2 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
          {language === "ko" ? "모형 가정" : "Model Assumptions"}
        </h2>
        <ul className="list-disc ml-5 space-y-1">
          <li>{language === "ko" ? "C4가 구동원이고 C5는 옥타브 관계로 약하게 공명합니다." : "C4 is the driving source and C5 resonates weakly in an octave relationship."}</li>
          <li>{language === "ko" ? "C5는 작은 초기 결합계수로 시작해 지수 감쇠를 가정합니다." : "C5 starts with a small initial coupling coefficient and assumes exponential decay."}</li>
          <li>{language === "ko" ? "위상은 0으로 두어 옥타브 정렬을 명확히 보여줍니다." : "Phase is set to 0 to clearly show octave alignment."}</li>
        </ul>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <Info k="f(C4)" v={`${f0.toFixed(2)} Hz`} />
          <Info k="f(C5)" v={`${f1.toFixed(2)} Hz`} />
          <Info k="T₀ = 1/f(C4)" v={`${ms(T0)} ms`} />
          <Info k={language === "ko" ? "정렬 주기" : "Alignment Period"} v={language === "ko" ? "매 T₀마다 위상정합" : "Phase alignment every T₀"} />
        </div>
      </div>
    </section>
  );
}

function Info({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border border-gray-200 dark:border-gray-700 rounded px-2 py-1">
      <span className="text-gray-500 dark:text-gray-400">{k}</span>
      <span className="font-mono text-gray-900 dark:text-gray-100">{v}</span>
    </div>
  );
}

