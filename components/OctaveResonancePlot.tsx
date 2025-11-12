"use client";

import React, { useMemo } from "react";
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

  // Constants
  const f0 = 261.63; // C4
  const f1 = 523.25; // C5 = 2*f0
  const T0 = 1 / f0; // seconds
  const duration = 0.04; // 40 ms window for clarity
  const sampleRate = 2400; // drawing resolution (points per second)
  const n = Math.floor(duration * sampleRate);
  const decay = 20; // per-second exponential decay for sympathetic C5
  const c5Gain = 0.33; // C5 amplitude relative to C4

  // SVG viewport
  const W = 900;
  const H = 360;
  const padL = 60;
  const padR = 20;
  const padT = 30;
  const padB = 40;

  // Helpers
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
          ? "C4(261.63 Hz)를 구동하면, 옥타브 관계인 C5(523.25 Hz)가 약하게 공명하여 함께 진동할 수 있습니다. 아래 그래프는 시간-진폭 좌표계에서 C4(파란색), C5(주황색), 합성파(검정색)를 그립니다. 수직 가이드선은 C4의 한 주기 T₀마다 찍혀 위상 정렬 지점을 표시합니다. f(C5)=2·f(C4)이므로, 매 T₀마다 두 파는 다시 위상이 맞습니다."
          : "When C4 (261.63 Hz) is driven, C5 (523.25 Hz), which is in an octave relationship, can resonate weakly and vibrate together. The graph below plots C4 (blue), C5 (orange), and the composite wave (black) in a time-amplitude coordinate system. Vertical guide lines are marked at each C4 period T₀ to show phase alignment points. Since f(C5)=2·f(C4), the two waves realign in phase every T₀."}
      </p>

      <div className="overflow-x-auto rounded-xl ring-1 ring-gray-200 dark:ring-gray-700">
        <svg width={W} height={H} role="img" aria-label={language === "ko" ? "옥타브 공명 차트" : "Octave resonance chart"}>
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
            {language === "ko" ? "시간" : "Time"}
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
            <LegendItem y={48} color="#111827" label={language === "ko" ? "합성파 C4 + C5" : "Composite C4 + C5"} />
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
                ? "본 도표는 실제 녹음 데이터가 아니라, 옥타브 관계(1:2 주파수 비)의 진동이 위상적으로 결속되어 공명하는 현상을 수학적으로 단순화한 개념적 시각화입니다."
                : "This diagram is not actual recorded data, but a conceptual visualization that mathematically simplifies the phenomenon of vibrations in an octave relationship (1:2 frequency ratio) being phase-coupled to resonate."}
            </p>
            <p>
              {language === "ko"
                ? "C4와 C5의 파형은 이론적 주파수 비를 기준으로 생성되었으며, 조율 정합이 높을수록 두 파형이 주기적으로 겹쳐져 에너지가 증폭되는 원리를 표현합니다."
                : "The waveforms of C4 and C5 are generated based on theoretical frequency ratios, expressing the principle that higher tuning coherence causes the two waveforms to periodically overlap and amplify energy."}
            </p>
            <p>
              {language === "ko"
                ? "따라서 본 그래프는 실험 데이터가 아니라, 공명 개념의 시각적 이해를 돕기 위한 추상화 모델입니다."
                : "Therefore, this graph is not experimental data but an abstracted model to aid visual understanding of the resonance concept."}
            </p>
          </div>
        </div>
      </div>

      <DetailsPanel f0={f0} f1={f1} T0={T0} language={language} />
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
          <Info k={language === "ko" ? "정렬 주기" : "Alignment Period"} v={language === "ko" ? "매 T₀마다 위상 재정렬" : "Phase realignment every T₀"} />
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

