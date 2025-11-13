'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from "@/contexts/LanguageContext";

type Series = 'C4' | 'C5' | 'G5' | 'C6' | 'G6' | 'SUM';

const A4 = 440; // concert pitch
const FREQ = {
  C4: 261.63,
  C5: 523.25,
  G5: 392.00, // C4의 완전5도
  C6: 1046.50, // C5의 옥타브 (C4의 두 옥타브)
  // G6 = A4 * 2^((n)/12) where n = semitone distance from A4 to G6 (A4->G#4 1 ... up to G6 = +31)
  // 정확 값 테이블 사용
  G6: 1567.98,
};

export default function C4C5G6ResonancePlot() {
  const { language } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [durationMs, setDurationMs] = useState(40);          // 40 ms 구간 표시
  const [g6OffsetHz, setG6OffsetHz] = useState(0);           // 복합5도 미세 조정(Hz)
  const [visible, setVisible] = useState<Record<Series, boolean>>({
    C4: true,
    C5: true,
    G5: false,
    C6: false,
    G6: true,
    SUM: true,
  });
  const [amplitudes, setAmplitudes] = useState({ C4: 1.0, C5: 0.55, G5: 0.35, C6: 0.28, G6: 0.22 }); // 상대 진폭
  const [canvasSize, setCanvasSize] = useState({ width: 1100, height: 360 });

  // 원본 크기 (비율 계산용)
  const baseWidth = 1100;
  const baseHeight = 360;
  const aspectRatio = baseWidth / baseHeight;
  // padding 조정: 상단 여백을 늘려 제목, 주파수 정보, 범례가 겹치지 않도록
  const padding = { l: 56, r: 16, t: 80, b: 36 };

  // 컨테이너 크기 감지 및 Canvas 크기 조정
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth - 32; // 패딩 고려
        const maxWidth = Math.min(baseWidth, containerWidth);
        const calculatedHeight = maxWidth / aspectRatio;
        setCanvasSize({ width: maxWidth, height: calculatedHeight });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [aspectRatio]);

  const width = canvasSize.width;
  const height = canvasSize.height;

  const data = useMemo(() => {
    const fs = 48000; // 내부 샘플링
    const N = Math.max(300, Math.floor(fs * (durationMs / 1000)));
    const t: number[] = new Array(N);
    const c4: number[] = new Array(N);
    const c5: number[] = new Array(N);
    const g5: number[] = new Array(N);
    const c6: number[] = new Array(N);
    const g6: number[] = new Array(N);
    const sum: number[] = new Array(N);
    const fC4 = FREQ.C4;
    const fC5 = FREQ.C5;
    const fG5 = FREQ.G5;
    const fC6 = FREQ.C6;
    const fG6 = FREQ.G6 + g6OffsetHz;

    for (let n = 0; n < N; n++) {
      const tt = n / fs; // seconds
      t[n] = tt;
      const s4 = amplitudes.C4 * Math.sin(2 * Math.PI * fC4 * tt);
      const s5 = amplitudes.C5 * Math.sin(2 * Math.PI * fC5 * tt);
      const sG5 = amplitudes.G5 * Math.sin(2 * Math.PI * fG5 * tt);
      const sC6 = amplitudes.C6 * Math.sin(2 * Math.PI * fC6 * tt);
      const sG6 = amplitudes.G6 * Math.sin(2 * Math.PI * fG6 * tt);
      c4[n] = s4;
      c5[n] = s5;
      g5[n] = sG5;
      c6[n] = sC6;
      g6[n] = sG6;
      // 체크된 항목들만 합산
      let sumValue = 0;
      if (visible.C4) sumValue += s4;
      if (visible.C5) sumValue += s5;
      if (visible.G5) sumValue += sG5;
      if (visible.C6) sumValue += sC6;
      if (visible.G6) sumValue += sG6;
      sum[n] = sumValue;
    }
    // 정규화(시각화용) - 표시되는 항목들만 고려
    const visibleArrays: number[][] = [];
    if (visible.C4) visibleArrays.push(c4);
    if (visible.C5) visibleArrays.push(c5);
    if (visible.G5) visibleArrays.push(g5);
    if (visible.C6) visibleArrays.push(c6);
    if (visible.G6) visibleArrays.push(g6);
    if (visible.SUM) visibleArrays.push(sum);
    
    const maxAbs = Math.max(
      ...visibleArrays.flatMap(arr => arr.map(v => Math.abs(v)))
    );
    const norm = maxAbs > 0 ? 1 / maxAbs : 1;
    return {
      t,
      c4: c4.map((v) => v * norm),
      c5: c5.map((v) => v * norm),
      g5: g5.map((v) => v * norm),
      c6: c6.map((v) => v * norm),
      g6: g6.map((v) => v * norm),
      sum: sum.map((v) => v * norm),
    };
  }, [durationMs, g6OffsetHz, amplitudes, visible]);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs || width === 0 || height === 0) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;
    
    // Canvas 크기 설정
    cvs.width = width;
    cvs.height = height;

    // 배경
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // 좌표 변환
    const plotW = width - padding.l - padding.r;
    const plotH = height - padding.t - padding.b;
    const xOf = (idx: number) => {
      const N = data.t.length;
      return padding.l + (idx / (N - 1)) * plotW;
    };
    const yOf = (y: number) => padding.t + plotH * (0.5 - 0.45 * y); // y ∈ [-1,1] → 화면

    // 그리드
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    // time grid every 4ms
    const totalMs = durationMs;
    for (let ms = 0; ms <= totalMs; ms += 4) {
      const x = padding.l + (ms / totalMs) * plotW;
      ctx.beginPath();
      ctx.moveTo(x, padding.t);
      ctx.lineTo(x, padding.t + plotH);
      ctx.stroke();
      // label
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px ui-sans-serif, system-ui, -apple-system';
      ctx.textAlign = 'center';
      ctx.fillText(`${ms} ms`, x, padding.t + plotH + 16);
    }
    // zero line
    ctx.strokeStyle = '#d1d5db';
    ctx.beginPath();
    ctx.moveTo(padding.l, yOf(0));
    ctx.lineTo(padding.l + plotW, yOf(0));
    ctx.stroke();

    // helper to draw a series
    const drawSeries = (arr: number[], stroke: string) => {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(xOf(0), yOf(arr[0]));
      for (let i = 1; i < arr.length; i++) ctx.lineTo(xOf(i), yOf(arr[i]));
      ctx.stroke();
    };

    // 시리즈
    if (visible.C4) drawSeries(data.c4, '#0ea5e9'); // sky-500
    if (visible.C5) drawSeries(data.c5, '#22c55e'); // emerald-500
    if (visible.G5) drawSeries(data.g5, '#8b5cf6'); // violet-500
    if (visible.C6) drawSeries(data.c6, '#06b6d4'); // cyan-500
    if (visible.G6) drawSeries(data.g6, '#f59e0b'); // amber-500
    if (visible.SUM) drawSeries(data.sum, '#111827'); // gray-900

    // 프레임/제목
    ctx.strokeStyle = '#e5e7eb';
    ctx.strokeRect(padding.l, padding.t, plotW, plotH);
    
    // 제목 (여러 줄로 분리)
    ctx.fillStyle = '#111827';
    ctx.font = '600 14px ui-sans-serif, system-ui, -apple-system';
    ctx.textAlign = 'left';
    const titleText = language === "ko" 
      ? 'C4–C5–G6 공명(합성파 포함)'
      : 'C4–C5–G6 Resonance (Including Composite Wave)';
    const subtitleText = language === "ko"
      ? 'C4 연주 시 동반 하모닉 응답'
      : 'Harmonic Response When Playing C4';
    
    ctx.fillText(titleText, padding.l, 18);
    ctx.font = '600 12px ui-sans-serif, system-ui, -apple-system';
    ctx.fillText(subtitleText, padding.l, 34);
    
    // 주파수 정보 (여러 줄로 표시)
    ctx.font = '10px ui-sans-serif, system-ui';
    ctx.fillStyle = '#374151';
    const freqLine1 = `f(C4)=${FREQ.C4.toFixed(2)} Hz, f(C5)=${FREQ.C5.toFixed(2)} Hz, f(G5)=${FREQ.G5.toFixed(2)} Hz`;
    const freqLine2 = `f(C6)=${FREQ.C6.toFixed(2)} Hz, f(G6)=${(FREQ.G6 + g6OffsetHz).toFixed(2)} Hz (Δ=${g6OffsetHz.toFixed(2)} Hz)`;
    ctx.fillText(freqLine1, padding.l, 52);
    ctx.fillText(freqLine2, padding.l, 64);

    // 범례 (위치 조정 - 그래프 영역 오른쪽 상단, 2줄로 배치)
    const legendItems: Array<{ label: string; color: string; on: boolean }> = [
      { label: language === "ko" ? 'C4(토닉)' : 'C4(Tonic)', color: '#0ea5e9', on: visible.C4 },
      { label: language === "ko" ? 'C5(옥타브)' : 'C5(Octave)', color: '#22c55e', on: visible.C5 },
      { label: language === "ko" ? 'G5(완전5도)' : 'G5(Perfect 5th)', color: '#8b5cf6', on: visible.G5 },
      { label: language === "ko" ? 'C6(2옥타브)' : 'C6(2 Octaves)', color: '#06b6d4', on: visible.C6 },
      { label: language === "ko" ? 'G6(복합5도)' : 'G6(Compound 5th)', color: '#f59e0b', on: visible.G6 },
      { label: language === "ko" ? '합성파' : 'Composite', color: '#111827', on: visible.SUM },
    ];
    // 범례를 그래프 영역 오른쪽 상단에 2줄로 배치
    let lx = padding.l + plotW - 220; // 오른쪽에서 220px 떨어진 위치
    let ly = padding.t - 70; // 제목 위쪽에 배치
    const itemsPerRow = 3;
    legendItems.forEach((it, idx) => {
      if (idx > 0 && idx % itemsPerRow === 0) {
        // 다음 줄로 이동
        lx = padding.l + plotW - 220;
        ly += 18;
      }
      ctx.fillStyle = it.color;
      ctx.fillRect(lx, ly - 10, 14, 3);
      ctx.fillStyle = it.on ? '#111827' : '#9ca3af';
      ctx.font = '10px ui-sans-serif, system-ui';
      ctx.fillText(it.label, lx + 18, ly);
      lx += 85; // 간격 조정
    });
  }, [data, g6OffsetHz, visible, language, width, height]);

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {language === "ko" ? "C4 연주 시 하모닉 동반 공명" : "Harmonic Resonance When Playing C4"}
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {language === "ko"
            ? "핸드팬 톤필드에는 C4(토닉)·C5(옥타브)·G5(완전5도)·C6(2옥타브)·G6(복합5도) 모드가 함께 세팅됩니다. C4를 타격하면 위상 결속으로 C5·G5·C6·G6가 작은 진폭으로 함께 응답할 수 있으며, 이는 정상적인 현상입니다. 고역대인 C6와 G6는 일부 사용자에게 '하이/노이즈'로 지각될 수 있습니다."
            : "Handpan tone fields have C4 (tonic), C5 (octave), G5 (perfect 5th), C6 (2 octaves), and G6 (compound 5th) modes set together. When C4 is struck, C5, G5, C6, and G6 can respond together with small amplitudes through phase coupling, which is a normal phenomenon. High-frequency components C6 and G6 may be perceived as 'high/noise' by some users."}
        </p>
      </section>

      {/* 컨트롤 패널 */}
      <div className="mb-6 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <h3 className="mb-2 font-medium text-gray-900 dark:text-gray-100">
              {language === "ko" ? "표시 구간(밀리초)" : "Display Range (ms)"}
            </h3>
            <input
              type="range"
              min={20}
              max={80}
              step={1}
              value={durationMs}
              onChange={(e) => setDurationMs(Number(e.target.value))}
              className="w-full"
            />
            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">{durationMs} ms</div>
          </div>

          <div>
            <h3 className="mb-2 font-medium text-gray-900 dark:text-gray-100">
              {language === "ko" ? "G6 미세 조정(Hz)" : "G6 Fine Adjustment (Hz)"}
            </h3>
            <input
              type="range"
              min={-10}
              max={10}
              step={0.1}
              value={g6OffsetHz}
              onChange={(e) => setG6OffsetHz(Number(e.target.value))}
              className="w-full"
            />
            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              f(G6) = {(FREQ.G6 + g6OffsetHz).toFixed(2)} Hz (Δ {g6OffsetHz.toFixed(1)} Hz)
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-medium text-gray-900 dark:text-gray-100">
              {language === "ko" ? "표시 토글" : "Display Toggle"}
            </h3>
            <div className="flex flex-wrap gap-3 text-sm">
              {(['C4', 'C5', 'G5', 'C6', 'G6', 'SUM'] as Series[]).map((k) => (
                <label key={k} className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={visible[k]}
                    onChange={(e) => setVisible({ ...visible, [k]: e.target.checked })}
                  />
                  <span>{k}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="mb-2 font-medium text-gray-900 dark:text-gray-100">
            {language === "ko" ? "상대 진폭" : "Relative Amplitude"}
          </h3>
          <div className="grid gap-3 sm:grid-cols-5">
            {(['C4', 'C5', 'G5', 'C6', 'G6'] as const).map((k) => (
              <div key={k}>
                <label className="mr-2 text-sm text-gray-700 dark:text-gray-300">{k}</label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={amplitudes[k]}
                  onChange={(e) => setAmplitudes({ ...amplitudes, [k]: Number(e.target.value) })}
                  className="w-full"
                />
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">{amplitudes[k].toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 그래프 영역 */}
      <div ref={containerRef} className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 p-4 overflow-x-auto bg-white dark:bg-gray-900">
        <canvas ref={canvasRef} className="w-full h-auto" />
      </div>

      <section className="mt-6 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        <h3 className="mb-2 font-medium text-gray-900 dark:text-gray-100">
          {language === "ko" ? "해설" : "Explanation"}
        </h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            {language === "ko"
              ? "C4 타격 시 C5(옥타브)·G5(완전5도)·C6(2옥타브)·G6(복합5도) 응답은 톤필드 내부의 공진 모드 구조에서 기인하는 정상적 공명이다."
              : "The C5 (octave), G5 (perfect 5th), C6 (2 octaves), and G6 (compound 5th) responses when C4 is struck are normal resonance originating from the resonant mode structure within the tone field."}
          </li>
          <li>
            {language === "ko"
              ? "각 하모닉 모드는 위상 결속을 통해 서로 다른 주파수 비율(1:2:1.5:4:6)로 조화롭게 공명하며, 이는 핸드팬의 풍부한 음색을 만드는 핵심 원리이다."
              : "Each harmonic mode resonates harmoniously through phase coupling at different frequency ratios (1:2:1.5:4:6), which is the core principle that creates the rich timbre of the handpan."}
          </li>
          <li>
            {language === "ko"
              ? "고역대인 C6와 G6는 작은 진폭이라도 귀에 돋보일 수 있어 일부 사용자가 '하이/노이즈'처럼 인지할 수 있다."
              : "High-frequency components C6 and G6 can stand out to the ear even with small amplitudes, and some users may perceive them as 'high/noise'."}
          </li>
          <li>
            {language === "ko"
              ? "필요 시 G6를 수 Hz 하향 조정(미세 디튠)하면 고역 에너지 체감이 완화되어 더 부드럽게 들린다."
              : "If necessary, lowering G6 by a few Hz (fine detuning) can reduce the perceived high-frequency energy, making it sound softer."}
          </li>
        </ul>
      </section>
    </div>
  );
}

