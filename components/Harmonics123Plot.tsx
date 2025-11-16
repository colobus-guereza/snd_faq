"use client";

import React, { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

// Next.js/React component rendering an SVG plot of three sine waves at 1:2:3 frequency ratio.
// Shows coordinate axes, labels, and highlights points where all three waves align (t = n·2π).
// Drop this component into any Next.js page or use as-is.

export default function Harmonics123Plot() {
  const { language } = useLanguage();
  const W = 900; // width
  const H = 360; // height
  const PAD = 48; // padding
  const plotW = W - PAD * 2;
  const plotH = H - PAD * 2;

  // Domain: t in [0, 2π]
  const tMin = 0;
  const tMax = Math.PI * 2;

  // Map t to x, y = sin(k t)
  const xOfT = (t: number) => PAD + ((t - tMin) / (tMax - tMin)) * plotW;
  const yOfSine = (y: number) => PAD + plotH / 2 - y * (plotH / 2 * 0.9); // scale 90%

  const samples = 1200;
  const ts = useMemo(() => Array.from({ length: samples }, (_, i) => tMin + (i * (tMax - tMin)) / (samples - 1)), []);

  function pathForK(k: number) {
    const d = ts
      .map((t, i) => `${i === 0 ? "M" : "L"}${xOfT(t).toFixed(2)},${yOfSine(Math.sin(k * t)).toFixed(2)}`)
      .join(" ");
    return d;
  }

  const paths = {
    k1: pathForK(1),
    k2: pathForK(2),
    k3: pathForK(3),
  };

  const ticksX = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, 2 * Math.PI];
  const tickLabels = ["0", "π/2", "π", "3π/2", "2π"];

  // Points where all waves meet: t = 0 and t = 2π (in this domain)
  const coincideTs = [0, 2 * Math.PI];

  return (
    <div className="w-full flex flex-col items-center gap-6 p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
      {/* 제목 */}
      <div className="w-full text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {language === "ko" 
            ? "핸드팬 음색의 원리: 하모닉스 동기화 모델"
            : "The Principle of Handpan Timbre: Harmonic Synchronization Model"}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 italic">
          {language === "ko" 
            ? "(기본음–옥타브–복합5도 3모드의 위상 결속 구조)"
            : "(Phase Coupling Structure of Three Modes: Fundamental–Octave–Compound Fifth)"}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
          {language === "ko" 
            ? "도표 1. 1:2:3 하모닉스 동기화 개념도(모식도)"
            : "Chart 1. 1:2:3 Harmonic Synchronization Conceptual Diagram (Schematic)"}
        </p>
      </div>

      {/* 1. 개요 */}
      <div className="w-full max-w-4xl space-y-4 px-2 sm:px-0">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-700 pb-2">
          {language === "ko" ? "1. 개요" : "1. Overview"}
        </h3>
        <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-3">
          <p>
            {language === "ko" 
              ? "이 도표는 세 개의 정현파 y = sin(kt) (k = 1, 2, 3)을 0에서 2π 구간에 표시하여, 주파수비 1:2:3으로 조율된 세 하모닉 모드가 시간축 상에서 위상 정합(phase alignment)과 진동 동기(synchronization)를 이루는 원리를 시각화한 개념도입니다."
              : "This diagram is a conceptual diagram that visualizes three sine waves y = sin(kt) (k = 1, 2, 3) over the interval from 0 to 2π, demonstrating how three harmonic modes tuned at a 1:2:3 frequency ratio achieve phase alignment and vibration synchronization on the time axis."}
          </p>
          <p>
            {language === "ko" 
              ? "핸드팬의 각 톤필드는 이와 같은 세 모드—기본음(F₀), 옥타브(2F₀), 복합5도(3F₀)—로 구성되어 있으며, 이들의 위상·주파수·응력 분포가 정수배 관계로 조화될 때 악기의 음색은 단일한 울림으로 결속됩니다."
              : "Each tone field of a handpan consists of these three modes—fundamental (F₀), octave (2F₀), and compound fifth (3F₀)—and when their phase, frequency, and stress distribution harmonize in an integer ratio relationship, the instrument's timbre unifies into a single resonance."}
          </p>
          <p>
            {language === "ko" 
              ? "이 도표는 1:2:3 정수비 관계의 세 모드를 단순화하여 표현한 이상적인 개념적 모델로, 실제 핸드팬 톤필드에서 관측되는 기본음-옥타브-복합5도 구조를 이해하기 위한 교육적 모식도입니다. 이 원리는 '하모닉스 동기화(Harmonic Synchronization)'라 불리며, 핸드팬의 음색 품질·조율 안정성·지속성을 이해하는 데 도움을 주는 개념적 기반입니다. 이러한 구조 덕분에 핸드팬은 단순한 금속 타악기와 달리 조화적 진동체처럼 작용합니다."
              : "This diagram is an ideal conceptual model that simplifies and expresses three modes with a 1:2:3 integer ratio relationship, and is an educational schematic for understanding the fundamental-octave-compound 5th structure observed in actual handpan tone fields. This principle is called 'Harmonic Synchronization' and provides a conceptual foundation for understanding the handpan's timbre quality, tuning stability, and sustain. Thanks to this structure, handpans function as harmonic oscillators, unlike simple metal percussion instruments."}
          </p>
        </div>
      </div>

      {/* 그래프 */}
      <div className="w-full flex flex-col items-center gap-4">
        <svg 
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-auto rounded-2xl shadow border bg-white dark:bg-gray-900"
        >
        {/* axes */}
        <line x1={PAD} y1={PAD + plotH / 2} x2={PAD + plotW} y2={PAD + plotH / 2} stroke="#9ca3af" strokeWidth={1} />
        <line x1={PAD} y1={PAD} x2={PAD} y2={PAD + plotH} stroke="#9ca3af" strokeWidth={1} />

        {/* x ticks */}
        {ticksX.map((t, i) => (
          <g key={i}>
            <line x1={xOfT(t)} y1={PAD + plotH / 2 - 4} x2={xOfT(t)} y2={PAD + plotH / 2 + 4} stroke="#9ca3af" />
            <text x={xOfT(t)} y={PAD + plotH / 2 + 18} fontSize={12} textAnchor="middle" fill="#6b7280" className="dark:fill-gray-400">
              {tickLabels[i]}
            </text>
          </g>
        ))}

        {/* y labels */}
        <text x={PAD - 14} y={yOfSine(1)} fontSize={12} textAnchor="end" fill="#6b7280" className="dark:fill-gray-400">+1</text>
        <text x={PAD - 14} y={yOfSine(0)} fontSize={12} textAnchor="end" fill="#6b7280" className="dark:fill-gray-400">0</text>
        <text x={PAD - 14} y={yOfSine(-1)} fontSize={12} textAnchor="end" fill="#6b7280" className="dark:fill-gray-400">-1</text>

        {/* paths */}
        <path d={paths.k1} fill="none" stroke="#2563eb" strokeWidth={2} />
        <path d={paths.k2} fill="none" stroke="#10b981" strokeWidth={2} />
        <path d={paths.k3} fill="none" stroke="#f59e0b" strokeWidth={2} />

        {/* coincide markers */}
        {coincideTs.map((t, idx) => (
          <g key={idx}>
            <circle cx={xOfT(t)} cy={yOfSine(0)} r={5} fill="#ef4444" />
            <text x={xOfT(t)} y={yOfSine(0) - 10} fontSize={12} textAnchor="middle" fill="#ef4444">
              t = {idx === 0 ? "0" : "2π"}
            </text>
          </g>
        ))}

        {/* legend */}
        <g transform={`translate(${W - 190}, ${PAD})`}>
          <rect width="170" height="70" rx="10" fill="#ffffff" stroke="#e5e7eb" className="dark:fill-gray-800 dark:stroke-gray-700" />
          <g transform="translate(12,16)">
            <circle r="5" fill="#2563eb" />
            <text x="14" y="4" fontSize={12} fill="#111827" className="dark:fill-gray-100">f₀ : y = sin(t)</text>
          </g>
          <g transform="translate(12,36)">
            <circle r="5" fill="#10b981" />
            <text x="14" y="4" fontSize={12} fill="#111827" className="dark:fill-gray-100">2f₀ : y = sin(2t)</text>
          </g>
          <g transform="translate(12,56)">
            <circle r="5" fill="#f59e0b" />
            <text x="14" y="4" fontSize={12} fill="#111827" className="dark:fill-gray-100">3f₀ : y = sin(3t)</text>
          </g>
        </g>
      </svg>

        <div className="text-xs text-gray-500 dark:text-gray-400 text-center italic">
          {language === "ko" 
            ? "도메인: t ∈ [0, 2π]. 세 파형은 t = n·2π에서 동일 위상으로 정렬. 본 도표는 실제 측정값이 아닌 개념적 모델입니다."
            : "Domain: t ∈ [0, 2π]. The three waveforms align at the same phase at t = n·2π. This diagram is a conceptual model, not actual measured values."}
        </div>
      </div>

      {/* 2. 그래프의 구성과 해석 */}
      <div className="w-full max-w-4xl space-y-4 px-2 sm:px-0">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-700 pb-2">
          {language === "ko" ? "2. 그래프의 구성과 해석" : "2. Graph Composition and Interpretation"}
        </h3>
        <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-3">
          <p>
            {language === "ko" 
              ? "세 파형은 서로 다른 주기를 가지며, 대부분의 구간에서는 위상이 어긋나 있습니다. 그러나 t = 0, 2π, 4π 등 정수배 시점에서는 세 파형의 위상이 동시에 0으로 일치합니다. 이 지점이 바로 위상 정렬(phase alignment)의 기준점이며, 세 모드의 위상이 완벽하게 정렬된 기준 상태입니다. 이는 에너지가 단일 위상 상태로 재집중되는 기준점으로 이해할 수 있으며, 실제로는 다른 시점(예: t = π/2)에서도 진폭 극대화가 발생할 수 있습니다."
              : "The three waveforms have different periods and are out of phase in most intervals. However, at integer multiples such as t = 0, 2π, 4π, the phases of all three waveforms simultaneously coincide at 0. This point is the reference point for phase alignment, where the three modes are in a perfectly aligned reference state. This can be understood as a reference point where energy is re-concentrated into a single phase state, and in reality, amplitude maximization can occur at other points (e.g., t = π/2) as well."}
          </p>
          <p>
            {language === "ko" 
              ? "핸드팬의 톤필드에서도 이와 같은 현상이 존재합니다. 금속판의 세 모드가 동일한 응력 분포 중심에서 위상이 정렬되면, 진동 에너지가 집중되어 모드 결속(Modal Coherence) 상태를 형성합니다. 이때의 파동 간섭은 음색을 한 점에 수렴시키며, 세 개의 모드가 마치 하나의 음처럼 들리게 합니다."
              : "The same phenomenon exists in handpan tone fields. When the three modes of the metal plate align in phase at the same stress distribution center, vibrational energy concentrates to form a Modal Coherence state. The wave interference at this moment converges the timbre to a single point, making the three modes sound like one tone."}
          </p>
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            {language === "ko" ? "파형 구성" : "Waveform Composition"}
          </p>
          <p className="ml-4">
            {language === "ko" 
              ? "파란색 파형: y = sin(t) → 기본 모드 F₀ · 초록색 파형: y = sin(2t) → 옥타브 모드 2F₀ · 주황색 파형: y = sin(3t) → 복합5도 모드 3F₀"
              : "Blue waveform: y = sin(t) → Fundamental mode F₀ · Green waveform: y = sin(2t) → Octave mode 2F₀ · Orange waveform: y = sin(3t) → Compound fifth mode 3F₀"}
          </p>
        </div>
      </div>

      {/* 3. 하모닉스 주파수의 물리적 특징 */}
      <div className="w-full max-w-4xl space-y-4 px-2 sm:px-0">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-700 pb-2">
          {language === "ko" ? "3. 하모닉스 주파수의 물리적 특징" : "3. Physical Characteristics of Harmonic Frequencies"}
        </h3>
        <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-3">
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            {language === "ko" 
              ? "정수배 주파수 관계 (Harmonic Ratio 1:2:3)"
              : "Integer Multiple Frequency Relationship (Harmonic Ratio 1:2:3)"}
          </p>
          <p className="ml-4">
            {language === "ko" 
              ? "세 모드는 동일한 금속 구조에서 발생하는 기본 모드와 그 정수배 배진동으로, 조화적 음색을 형성합니다. 이 구조는 판진동체의 고유모드에서 나타나는 기본 패턴이며, 금속의 탄성계수와 두께 분포가 정밀히 제어될 때만 성립합니다."
              : "The three modes are the fundamental mode and its integer multiple harmonics occurring in the same metal structure, forming a harmonic timbre. This structure is a fundamental pattern appearing in the natural modes of plate vibrators and only establishes when the metal's elastic modulus and thickness distribution are precisely controlled."}
          </p>
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            {language === "ko" 
              ? "주기적 위상 재동기 (Temporal Phase Coherence)"
              : "Periodic Phase Resynchronization (Temporal Phase Coherence)"}
          </p>
          <p className="ml-4">
            {language === "ko" 
              ? "서로 다른 주기를 가진 파형이라도 일정 간격(2π)마다 다시 같은 위상을 공유합니다. 즉, 세 모드는 대부분의 시간 동안 위상이 어긋나 있지만, 주기적 동기화(resynchronization)를 통해 평균적인 위상 결속을 유지합니다. 이는 핸드팬이 연주 중에도 안정된 음색 중심을 유지하는 이유입니다."
              : "Even waveforms with different periods share the same phase again at regular intervals (2π). That is, although the three modes are out of phase for most of the time, they maintain average phase coherence through periodic resynchronization. This is why handpans maintain a stable timbral center during performance."}
          </p>
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            {language === "ko" 
              ? "모드 간 에너지 교류 (Modal Coupling)"
              : "Inter-Modal Energy Exchange (Modal Coupling)"}
          </p>
          <p className="ml-4">
            {language === "ko" 
              ? "위상 차이는 에너지 분포의 변화를 일으키며, 소리의 두께감과 공명감을 형성합니다. 완전 정렬된 한 점에서 에너지 분포가 집중되고, 그 이후에는 미세한 위상차를 통해 에너지 분포가 변화하며 잔향이 형성됩니다. 이는 엄격한 의미에서 모드 간 에너지 교환이라기보다는, 에너지 분포가 한 모드를 더 두드러지게 들리게 만드는 현상을 직관적으로 설명하는 개념입니다. 이 상호작용이 핸드팬 특유의 풍부한 배음과 긴 서스테인을 만듭니다."
              : "Phase differences cause changes in energy distribution, forming the sound's thickness and resonance. Energy distribution concentrates at a point of complete alignment, and afterward changes through subtle phase differences to form reverberation. This is more of an intuitive concept describing the phenomenon where energy distribution makes one mode sound more prominent to the ear, rather than strict energy exchange between modes. This interaction creates the handpan's characteristic rich overtones and long sustain."}
          </p>
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            {language === "ko" 
              ? "위상 결속률의 실제 의미"
              : "Actual Meaning of Phase Coherence Ratio"}
          </p>
          <p className="ml-4">
            {language === "ko" 
              ? "위상 결속률은 시간적으로 동일 위상을 유지하는 비율이 아니라, 금속판 전체에서 세 모드가 얼마나 동일한 진동장을 공유하는가를 뜻합니다. 실제 핸드팬에서는 공명보다는 이러한 위상 결속의 안정성이 음색의 일체감을 결정합니다. 따라서 그래프상 위상이 어긋나 보이는 것은 필연적이며, 실제 금속판 내에서는 모드 간 위상 결속이 유지되어 음색의 통합을 이끕니다."
              : "Phase coherence ratio does not mean the ratio of time spent maintaining the same phase, but rather how consistently the three modes share an identical vibration field across the entire metal plate. In actual handpans, it is the stability of this phase coupling, rather than resonance, that determines the unity of timbre. Therefore, the apparent phase misalignment in the graph is inevitable, and within the actual metal plate, phase coupling between modes is maintained, leading to timbral integration."}
          </p>
        </div>
      </div>

      {/* 4. 하모닉스 튜닝과 물리적 구현 */}
      <div className="w-full max-w-4xl space-y-4 px-2 sm:px-0">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-700 pb-2">
          {language === "ko" ? "4. 하모닉스 튜닝과 물리적 구현" : "4. Harmonic Tuning and Physical Implementation"}
        </h3>
        <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {language === "ko" ? "정의" : "Definition"}
            </p>
            <p className="ml-4">
              {language === "ko" 
                ? "1차 하모닉스 튜닝(Primary Harmonics Tuning)이란 세 모드(F₀, 2F₀, 3F₀)의 위상·응력 결속을 조정하는 과정입니다."
                : "Primary Harmonics Tuning is the process of adjusting the phase and stress coupling of the three modes (F₀, 2F₀, 3F₀)."}
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {language === "ko" ? "목적" : "Purpose"}
            </p>
            <p className="ml-4">
              {language === "ko" 
                ? "제작자는 망치로 각 톤필드의 국부 장력과 곡률을 조정하여, 세 모드의 공진점이 시간적·공간적으로 정렬되도록 만듭니다. 단순히 주파수를 맞추는 것이 아니라, 세 모드가 하나의 공진축(Resonant Axis)을 공유하도록 하는 것이 목표입니다."
                : "The maker adjusts the local tension and curvature of each tone field with a hammer so that the resonant points of the three modes align temporally and spatially. The goal is not simply to match frequencies but to have the three modes share a single Resonant Axis."}
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {language === "ko" ? "결과" : "Result"}
            </p>
            <p className="ml-4 mb-2">
              {language === "ko" 
                ? "이 정렬이 완성되면 다음의 특성이 확보됩니다:"
                : "When this alignment is completed, the following characteristics are secured:"}
            </p>
            <ul className="space-y-2 ml-8">
              <li>
                <span className="font-semibold">
                  {language === "ko" ? "음색 일체감 (Tonal Unity):" : "Tonal Unity:"}
                </span>{" "}
                {language === "ko" 
                  ? "세 모드가 하나의 음으로 인지됩니다."
                  : "The three modes are perceived as one tone."}
              </li>
              <li>
                <span className="font-semibold">
                  {language === "ko" ? "지속성 안정성 (Sustain Stability):" : "Sustain Stability:"}
                </span>{" "}
                {language === "ko" 
                  ? "위상 동기가 유지되어 지각적으로 더 균일하고 안정적인 서스테인을 제공합니다. 실제 서스테인 길이는 재료, 두께 분포, 응력 분포, 감쇠(마찰/공기 방사) 등의 기계적 요인에 더 크게 영향을 받습니다."
                  : "Phase synchronization is maintained, providing a more uniform and stable sustain perceptually. Actual sustain length is more significantly influenced by mechanical factors such as material, thickness distribution, stress distribution, and damping (friction/air radiation)."}
              </li>
              <li>
                <span className="font-semibold">
                  {language === "ko" ? "조율 내성 (Detune Resistance):" : "Detune Resistance:"}
                </span>{" "}
                {language === "ko" 
                  ? "잘 설계된 구조에서는 환경 변화에도 세 하모닉 모드의 주파수 관계가 상대적으로 안정적으로 유지되어, 위상 정렬이 쉽게 깨지지 않습니다."
                  : "In a well-designed structure, the frequency relationship of the three harmonic modes remains relatively stable even with environmental changes, so phase alignment does not easily break down."}
              </li>
            </ul>
          </div>
          <p className="mt-2">
            {language === "ko" 
              ? "즉, 1차 하모닉스 튜닝은 금속의 응력장을 정렬하여 세 모드의 위상 결속률을 최대화하는 물리적 조정 과정이며, 이로써 핸드팬은 조화적 진동체로 기능하게 됩니다."
              : "In other words, Primary Harmonics Tuning is a physical adjustment process that aligns the metal's stress field to maximize the phase coherence ratio of the three modes, thereby enabling the handpan to function as a harmonic oscillator."}
          </p>
        </div>
      </div>
    </div>
  );
}

