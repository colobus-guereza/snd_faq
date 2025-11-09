import React from "react";

/**
 * TonefieldTensionDiagram
 * ------------------------------------------------------------
 * A lightweight, dependency-free SVG component that visualizes
 * an elliptical tonefield with a central elliptical dimple and
 * uniformly distributed 360° radial tension vectors.
 *
 * Props:
 * - width, height: overall SVG size (px)
 * - arrows: number of radial arrows (default 24)
 * - color: primary stroke/fill accent
 * - showLegend: render a simple legend
 *
 * Usage (Next.js / React):
 *   import TonefieldTensionDiagram from "@/components/TonefieldTensionDiagram";
 *   <TonefieldTensionDiagram width={720} height={480} />
 */

export type TonefieldTensionDiagramProps = {
  width?: number;
  height?: number;
  arrows?: number;
  color?: string; // Tailwind color tokens are fine at parent level, but here we keep raw hex
  showLegend?: boolean;
};

const TonefieldTensionDiagram: React.FC<TonefieldTensionDiagramProps> = ({
  width = 720,
  height = 480,
  arrows = 24,
  color = "#2563eb", // Tailwind blue-600
  showLegend = true,
}) => {
  const w = width;
  const h = height;
  const cx = w / 2; // 가로 중앙 정렬
  const cy = h / 2;

  // Ellipse radii with enforced 2:3 ratio for both outer ellipse and inner dimple
  // We compute a uniform scale 's' so that rx:ry = 2:3 fits inside the SVG with padding.
  // 상하 여백을 더 크게 설정하여 화살표가 잘리지 않도록 함
  const paddingTop = 60; // 상단 여백 확대
  const paddingBottom = 60; // 하단 여백 확대
  const paddingHorizontal = 8; // 좌우 여백 (줄임)
  const s = Math.min((w - 2 * paddingHorizontal) / 4, (h - paddingTop - paddingBottom) / 6); // fit 2s (rx) and 3s (ry)
  const rx = 2 * s;
  const ry = 3 * s;
  // 타원의 중심을 가로 중앙, 세로는 여백을 고려하여 조정
  const adjustedCy = paddingTop + ry + (h - paddingTop - paddingBottom - 2 * ry) / 2;
  // Keep inner dimple at the same 2:3 ratio by scaling both radii equally
  const dimpleScale = 0.378; // relative size of the dimple vs outer ellipse (0.42 * 0.9 = -10%)
  const dimpleRx = rx * dimpleScale;
  const dimpleRy = ry * dimpleScale;

  // Arrow geometry
  const arrowLen = Math.min(w, h) * 0.10; // base length
  const arrowHead = arrowLen * 0.20; // head size

  // Generate N evenly spaced directions around 360°
  const dirs = Array.from({ length: arrows }, (_, i) => (i / arrows) * 2 * Math.PI);

  // Utility: arrow path from ellipse perimeter going outward
  const arrowPath = (theta: number) => {
    // Point on ellipse perimeter at angle theta
    const ex = cx + rx * Math.cos(theta);
    const ey = adjustedCy + ry * Math.sin(theta);

    // Outward normal direction at that point: for an ellipse,
    // gradient of implicit function (x^2/rx^2 + y^2/ry^2 = 1)
    // Normal vector n ∝ (x/rx^2, y/ry^2)
    const nx = (Math.cos(theta) / (rx));
    const ny = (Math.sin(theta) / (ry));
    const normLen = Math.hypot(nx, ny) || 1;
    const ux = nx / normLen;
    const uy = ny / normLen;

    const x2 = ex + ux * arrowLen;
    const y2 = ey + uy * arrowLen;
    const xHeadL = x2 - ux * arrowHead + (-uy) * arrowHead * 0.6;
    const yHeadL = y2 - uy * arrowHead + (ux) * arrowHead * 0.6;
    const xHeadR = x2 - ux * arrowHead + (uy) * arrowHead * 0.6;
    const yHeadR = y2 - uy * arrowHead + (-ux) * arrowHead * 0.6;

    return {
      shaft: `M ${ex.toFixed(2)},${ey.toFixed(2)} L ${x2.toFixed(2)},${y2.toFixed(2)}`,
      head: `M ${xHeadL.toFixed(2)},${yHeadL.toFixed(2)} L ${x2.toFixed(2)},${y2.toFixed(2)} L ${xHeadR.toFixed(2)},${yHeadR.toFixed(2)}`,
    };
  };

  // Soft gradient id for the dimple shading
  const gid = "tonefield-dimple-grad";
  const gid2 = "tonefield-body-grad";
  const gridId = "coordinate-grid";

  // 그리드 설정
  const gridSize = 40; // 그리드 간격 (픽셀)
  const gridColorLight = "#e5e7eb"; // 라이트 모드 그리드 색상
  const gridColorDark = "#374151"; // 다크 모드 그리드 색상
  const axisColorLight = "#9ca3af"; // 라이트 모드 축 색상
  const axisColorDark = "#6b7280"; // 다크 모드 축 색상
  const labelColorLight = "#1f2937"; // 라이트 모드 라벨 색상 (진한 회색)
  const labelColorDark = "#e5e7eb"; // 다크 모드 라벨 색상 (밝은 회색)

  return (
    <div className="w-full flex items-center justify-center p-2 sm:p-4 max-w-full overflow-hidden">
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Elliptical tonefield with central dimple and 360-degree uniform radial tension"
        className="rounded-2xl shadow-lg bg-white dark:bg-zinc-900 w-full h-auto"
        style={{ maxWidth: '100%', height: 'auto' }}
      >
        <defs>
          {/* 그리드 패턴 정의 - 라이트 모드 */}
          <pattern
            id={`${gridId}-light`}
            x="0"
            y="0"
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
              fill="none"
              stroke={gridColorLight}
              strokeWidth="0.5"
            />
          </pattern>
          {/* 그리드 패턴 정의 - 다크 모드 */}
          <pattern
            id={`${gridId}-dark`}
            x="0"
            y="0"
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
              fill="none"
              stroke={gridColorDark}
              strokeWidth="0.5"
            />
          </pattern>
          
          {/* Outer radial gradient for the tonefield plate - 장력 표현 강화 */}
          <radialGradient id={gid2} cx="50%" cy="50%" r="100%">
            <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.4" />
            <stop offset="30%" stopColor="#94a3b8" stopOpacity="0.3" />
            <stop offset="60%" stopColor="#64748b" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.1" />
          </radialGradient>
          {/* Dimple gradient suggesting a shallow depression - 장력 집중 표현 */}
          <radialGradient id={gid} cx="50%" cy="45%" r="80%">
            <stop offset="0%" stopColor="#475569" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#64748b" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#94a3b8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.2" />
          </radialGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feOffset in="blur" dx="0" dy="1" result="off" />
            <feMerge>
              <feMergeNode in="off" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 좌표평면 배경 그리드 - 라이트 모드 */}
        <rect
          x="0"
          y="0"
          width={w}
          height={h}
          fill={`url(#${gridId}-light)`}
          className="dark:hidden"
        />
        {/* 좌표평면 배경 그리드 - 다크 모드 */}
        <rect
          x="0"
          y="0"
          width={w}
          height={h}
          fill={`url(#${gridId}-dark)`}
          className="hidden dark:block"
        />

        {/* 좌표축 (X축, Y축) */}
        {/* X축 (수평선) - 라이트 모드 */}
        <line
          x1="0"
          y1={adjustedCy}
          x2={w}
          y2={adjustedCy}
          stroke={axisColorLight}
          strokeWidth="1.5"
          className="dark:hidden"
        />
        {/* X축 (수평선) - 다크 모드 */}
        <line
          x1="0"
          y1={adjustedCy}
          x2={w}
          y2={adjustedCy}
          stroke={axisColorDark}
          strokeWidth="1.5"
          className="hidden dark:block"
        />
        {/* Y축 (수직선) - 라이트 모드 */}
        <line
          x1={cx}
          y1="0"
          x2={cx}
          y2={h}
          stroke={axisColorLight}
          strokeWidth="1.5"
          className="dark:hidden"
        />
        {/* Y축 (수직선) - 다크 모드 */}
        <line
          x1={cx}
          y1="0"
          x2={cx}
          y2={h}
          stroke={axisColorDark}
          strokeWidth="1.5"
          className="hidden dark:block"
        />

        {/* 좌표축 라벨 - 작은 타원과 큰 타원 사이 중앙에 배치 */}
        {/* 두 타원 사이의 중앙 위치 계산 */}
        {/* 작은 타원 가장자리: adjustedCy ± dimpleRy, cx ± dimpleRx */}
        {/* 큰 타원 가장자리: adjustedCy ± ry, cx ± rx */}
        {/* 중앙 위치: (작은 타원 가장자리 + 큰 타원 가장자리) / 2 */}
        {/* Y축 상단: Octav */}
        <text
          x={cx}
          y={adjustedCy - (dimpleRy + ry) / 2}
          textAnchor="middle"
          fontSize="14"
          fill={labelColorLight}
          fontWeight="600"
          className="dark:hidden"
        >
          Octav
        </text>
        <text
          x={cx}
          y={adjustedCy - (dimpleRy + ry) / 2}
          textAnchor="middle"
          fontSize="14"
          fill={labelColorDark}
          fontWeight="600"
          className="hidden dark:block"
        >
          Octav
        </text>

        {/* Y축 하단: Tonic */}
        <text
          x={cx}
          y={adjustedCy + (dimpleRy + ry) / 2}
          textAnchor="middle"
          fontSize="14"
          fill={labelColorLight}
          fontWeight="600"
          className="dark:hidden"
        >
          Tonic
        </text>
        <text
          x={cx}
          y={adjustedCy + (dimpleRy + ry) / 2}
          textAnchor="middle"
          fontSize="14"
          fill={labelColorDark}
          fontWeight="600"
          className="hidden dark:block"
        >
          Tonic
        </text>

        {/* X축 좌측: Fifth */}
        <text
          x={cx - (dimpleRx + rx) / 2}
          y={adjustedCy + 5}
          textAnchor="middle"
          fontSize="14"
          fill={labelColorLight}
          fontWeight="600"
          className="dark:hidden"
        >
          Fifth
        </text>
        <text
          x={cx - (dimpleRx + rx) / 2}
          y={adjustedCy + 5}
          textAnchor="middle"
          fontSize="14"
          fill={labelColorDark}
          fontWeight="600"
          className="hidden dark:block"
        >
          Fifth
        </text>

        {/* X축 우측: Fifth */}
        <text
          x={cx + (dimpleRx + rx) / 2}
          y={adjustedCy + 5}
          textAnchor="middle"
          fontSize="14"
          fill={labelColorLight}
          fontWeight="600"
          className="dark:hidden"
        >
          Fifth
        </text>
        <text
          x={cx + (dimpleRx + rx) / 2}
          y={adjustedCy + 5}
          textAnchor="middle"
          fontSize="14"
          fill={labelColorDark}
          fontWeight="600"
          className="hidden dark:block"
        >
          Fifth
        </text>

        {/* 좌표축 눈금 표시 (숫자 라벨 없음) */}
        {/* X축 눈금 (중심 기준 좌우) */}
        {Array.from({ length: Math.floor(w / gridSize) + 1 }, (_, i) => {
          const x = i * gridSize;
          const offset = x - cx;
          if (Math.abs(offset) < 0.1) return null; // 중앙선은 제외
          return (
            <g key={`x-tick-${i}`}>
              {/* 라이트 모드 눈금 */}
              <line
                x1={x}
                y1={adjustedCy - 4}
                x2={x}
                y2={adjustedCy + 4}
                stroke={axisColorLight}
                strokeWidth="1"
                className="dark:hidden"
              />
              {/* 다크 모드 눈금 */}
              <line
                x1={x}
                y1={adjustedCy - 4}
                x2={x}
                y2={adjustedCy + 4}
                stroke={axisColorDark}
                strokeWidth="1"
                className="hidden dark:block"
              />
            </g>
          );
        })}

        {/* Y축 눈금 (중심 기준 상하) */}
        {Array.from({ length: Math.floor(h / gridSize) + 1 }, (_, i) => {
          const y = i * gridSize;
          const offset = adjustedCy - y;
          if (Math.abs(offset) < 0.1) return null; // 중앙선은 제외
          return (
            <g key={`y-tick-${i}`}>
              {/* 라이트 모드 눈금 */}
              <line
                x1={cx - 4}
                y1={y}
                x2={cx + 4}
                y2={y}
                stroke={axisColorLight}
                strokeWidth="1"
                className="dark:hidden"
              />
              {/* 다크 모드 눈금 */}
              <line
                x1={cx - 4}
                y1={y}
                x2={cx + 4}
                y2={y}
                stroke={axisColorDark}
                strokeWidth="1"
                className="hidden dark:block"
              />
            </g>
          );
        })}

        {/* Outer ellipse (tonefield body) */}
        <ellipse
          cx={cx}
          cy={adjustedCy}
          rx={rx}
          ry={ry}
          fill={`url(#${gid2})`}
          stroke="#334155"
          strokeWidth={2}
          filter="url(#soft)"
        />

        {/* Dimple (central elliptical depression) */}
        <ellipse
          cx={cx}
          cy={adjustedCy}
          rx={dimpleRx}
          ry={dimpleRy}
          fill={`url(#${gid})`}
          stroke="#475569"
          strokeWidth={1.5}
        />

        {/* Dimple contour rings to suggest depth */}
        {[0.65, 0.82, 1.0].map((k, idx) => (
          <ellipse
            key={idx}
            cx={cx}
            cy={adjustedCy}
            rx={dimpleRx * k}
            ry={dimpleRy * k}
            fill="none"
            stroke="#64748b"
            strokeOpacity={0.25}
            strokeWidth={idx === 2 ? 1.2 : 0.8}
          />
        ))}

        {/* Degree ticks at 0/90/180/270 for orientation */}
        {([0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2] as number[]).map((t, i) => {
          const tx = cx + (rx + 12) * Math.cos(t);
          const ty = adjustedCy + (ry + 12) * Math.sin(t);
          const ix = cx + (rx + 2) * Math.cos(t);
          const iy = adjustedCy + (ry + 2) * Math.sin(t);
          return (
            <g key={i}>
              <line x1={ix} y1={iy} x2={tx} y2={ty} stroke="#94a3b8" strokeWidth={1} />
            </g>
          );
        })}

        {/* Radial tension arrows: uniform length = uniform tension */}
        {dirs.map((t, i) => {
          const { shaft, head } = arrowPath(t);
          return (
            <g key={i}>
              <path d={shaft} stroke={color} strokeWidth={2} fill="none" />
              <path d={head} stroke={color} strokeWidth={2} fill="none" />
            </g>
          );
        })}


      </svg>
    </div>
  );
};

export default TonefieldTensionDiagram;

