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
  
  // ===== 전체 타원 색상 수동 조절 파라미터 =====
  // 전체 타원의 색상을 독립적으로 조절할 수 있습니다.
  const OUTER_ELLIPSE_COLOR_CONFIG = {
    // 버건디 계열 색상 설정
    color: "#991b1b",           // 버건디 색상 (hex 코드)
    opacity: 0.65,              // 투명도
  };
  // ============================================

  // ===== 4개 영역 색상 설정 =====
  // 기본 색상: 전체 톤필드와 동일한 기본 색상
  const BASE_REGION_COLOR = {
    color: OUTER_ELLIPSE_COLOR_CONFIG.color,  // 전체 톤필드 색상과 동일
    opacity: OUTER_ELLIPSE_COLOR_CONFIG.opacity * 0.8,  // 약간 더 투명하게
  };

  // 개별 오버레이 색상 (null이면 기본 색상만 사용)
  const REGION_OVERLAY_COLORS = {
    octave: null,        // null = 기본 색상만 사용, 또는 { color: "#ef4444", opacity: 0.3 }
    tonic: null,         // null = 기본 색상만 사용, 또는 { color: "#3b82f6", opacity: 0.3 }
    leftFifth: null,     // null = 기본 색상만 사용, 또는 { color: "#22c55e", opacity: 0.3 }
    rightFifth: null,    // null = 기본 색상만 사용, 또는 { color: "#eab308", opacity: 0.3 }
  };
  // ============================================

  // ===== 방사형 그라데이션 세부 설정 (도너츠 전체 영역) =====
  // 톤필드 중심에서 바깥쪽으로 방사형 그라데이션 적용
  // 360도 전방향 균일한 하모닉스 튜닝 강도 시각화
  const RADIAL_GRADIENT_CONFIG = {
    // ===== 기본 설정 =====
    enabled: true,                    // 그라데이션 활성화 (false면 투명)

    // ===== 색상 설정 =====
    // 단일 색상 모드: useMultiColor=false일 때 color만 사용
    // 다중 색상 모드: useMultiColor=true일 때 startColor → endColor
    useMultiColor: false,             // 다중 색상 모드 활성화
    color: "#86efac",                 // 단일 색상 (밝은 연녹색, 하모닉스 튜닝)
    startColor: "#86efac",            // 시작 색상 (다중 색상 모드)
    endColor: "#22c55e",              // 끝 색상 (다중 색상 모드)

    // ===== 투명도 설정 =====
    innerOpacity: 0.0,                // 딤플 경계 (중심) 투명도 (0.0~1.0)
    midOpacity: 0.3,                  // 중간 지점 투명도 (옵션)
    outerOpacity: 0.5,                // 바깥 타원 경계 투명도 (0.0~1.0)

    // ===== 그라데이션 전환 지점 설정 =====
    // offset 값: 0.0(중심) ~ 1.0(바깥) 사이
    dimpleRatio: (dimpleRx / rx + dimpleRy / ry) / 2,  // 딤플 비율 (자동 계산)
    useMidPoint: false,               // 중간 지점 활성화
    midPoint: 0.7,                    // 중간 색상/투명도 적용 지점 (0.0~1.0)

    // ===== 고급 설정 =====
    gradientType: "smooth",           // 그라데이션 타입: "smooth" | "sharp"
    // smooth: 부드러운 전환, sharp: 급격한 전환
  };
  // ============================================

  // ===== 장력 등고선 설정 (Tension Contour Lines) =====
  // 동심원 타원으로 장력 분포 레벨 시각화
  const CONTOUR_CONFIG = {
    // ===== 기본 설정 =====
    enabled: true,                    // 등고선 활성화

    // ===== 등고선 레벨 설정 =====
    // 바깥 타원 대비 비율 배열 (1.0 = 바깥 타원, 0.0 = 중심)
    // 예: [0.85, 0.70, 0.55, 0.40] = 4개 등고선
    ratios: [0.85, 0.70, 0.55, 0.40],

    // ===== 색상 및 스타일 =====
    color: "#3bb18f",                 // 등고선 색상 (청록색 계열)
    baseOpacity: 0.35,                // 첫 번째 등고선 투명도
    opacityStep: 0.06,                // 안쪽으로 갈수록 투명도 감소량

    // ===== 선 두께 =====
    outerStrokeWidth: 1.2,            // 가장 바깥 등고선 두께
    innerStrokeWidth: 0.6,            // 안쪽 등고선 두께
  };
  // ============================================

  // ===== 방사형 장력 곡선 설정 (Radial Tension Lines) =====
  // 딤플에서 바깥으로 뻗어나가며 바깥쪽으로 휘어지는 곡선
  const RADIAL_TENSION_LINES_CONFIG = {
    // ===== 기본 설정 =====
    enabled: true,                    // 장력선 활성화

    // ===== 선 개수 =====
    count: 16,                        // 방사형 장력선 개수 (권장: 12, 16, 24)

    // ===== 선 위치 설정 =====
    startRatio: 0.58,                 // 시작 위치 (딤플 경계 근처)
    endRatio: 0.97,                   // 끝 위치 (바깥 타원 가까이)

    // ===== 색상 및 스타일 =====
    colorStart: "#2bb5a0",            // 시작 색상 (진한 청록색)
    colorEnd: "#2bb5a0",              // 끝 색상
    opacityStart: 0.7,                // 시작 투명도
    opacityEnd: 0.2,                  // 끝 투명도

    // ===== 선 두께 =====
    strokeWidth: 1.1,                 // 선 두께
  };
  // ============================================

  // 타원의 호(arc)를 그리는 헬퍼 함수
  const createArcPath = (startAngle: number, endAngle: number, isOuter: boolean = true) => {
    const radiusX = isOuter ? rx : dimpleRx;
    const radiusY = isOuter ? ry : dimpleRy;
    const centerX = cx;
    const centerY = adjustedCy;
    
    const startX = centerX + radiusX * Math.cos(startAngle);
    const startY = centerY + radiusY * Math.sin(startAngle);
    const endX = centerX + radiusX * Math.cos(endAngle);
    const endY = centerY + radiusY * Math.sin(endAngle);
    
    // 각도 차이 계산 (시계방향으로)
    let angleDiff = endAngle - startAngle;
    if (angleDiff < 0) angleDiff += 2 * Math.PI;
    if (angleDiff > 2 * Math.PI) angleDiff -= 2 * Math.PI;
    
    // 큰 호인지 작은 호인지 결정
    const largeArcFlag = angleDiff > Math.PI ? 1 : 0;
    const sweepFlag = 1; // 시계방향
    
    return `A ${radiusX} ${radiusY} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}`;
  };
  
  // ===== 도너츠 영역 경로 생성 함수 =====
  // 바깥 타원과 안쪽 딤플 타원 사이의 도너츠 영역 생성
  // fill-rule="evenodd"로 구멍 뚫린 효과
  const createDonutPath = () => {
    // 바깥 타원 전체 경로 (시계방향)
    const outerStart = `M ${cx + rx} ${adjustedCy}`;
    const outerArc1 = `A ${rx} ${ry} 0 0 1 ${cx - rx} ${adjustedCy}`;
    const outerArc2 = `A ${rx} ${ry} 0 0 1 ${cx + rx} ${adjustedCy}`;

    // 안쪽 딤플 타원 전체 경로 (반시계방향으로 구멍 생성)
    const innerStart = `M ${cx + dimpleRx} ${adjustedCy}`;
    const innerArc1 = `A ${dimpleRx} ${dimpleRy} 0 0 0 ${cx - dimpleRx} ${adjustedCy}`;
    const innerArc2 = `A ${dimpleRx} ${dimpleRy} 0 0 0 ${cx + dimpleRx} ${adjustedCy}`;

    return `${outerStart} ${outerArc1} ${outerArc2} Z ${innerStart} ${innerArc1} ${innerArc2} Z`;
  };

  // ===== 각 영역의 대각선만 추출 (점선 적용용) =====
  const getOctaveDiagonalLines = () => {
    const topleftAngle = (5 * Math.PI) / 4;
    const toprightAngle = (7 * Math.PI) / 4;

    const innerTopleftX = cx + dimpleRx * Math.cos(topleftAngle);
    const innerTopleftY = adjustedCy + dimpleRy * Math.sin(topleftAngle);
    const innerToprightX = cx + dimpleRx * Math.cos(toprightAngle);
    const innerToprightY = adjustedCy + dimpleRy * Math.sin(toprightAngle);
    const outerToprightX = cx + rx * Math.cos(toprightAngle);
    const outerToprightY = adjustedCy + ry * Math.sin(toprightAngle);
    const outerTopleftX = cx + rx * Math.cos(topleftAngle);
    const outerTopleftY = adjustedCy + ry * Math.sin(topleftAngle);

    return [
      { x1: innerToprightX, y1: innerToprightY, x2: outerToprightX, y2: outerToprightY },
      { x1: innerTopleftX, y1: innerTopleftY, x2: outerTopleftX, y2: outerTopleftY }
    ];
  };

  const getTonicDiagonalLines = () => {
    const bottomleftAngle = (3 * Math.PI) / 4;
    const bottomrightAngle = Math.PI / 4;

    const innerBottomleftX = cx + dimpleRx * Math.cos(bottomleftAngle);
    const innerBottomleftY = adjustedCy + dimpleRy * Math.sin(bottomleftAngle);
    const innerBottomrightX = cx + dimpleRx * Math.cos(bottomrightAngle);
    const innerBottomrightY = adjustedCy + dimpleRy * Math.sin(bottomrightAngle);
    const outerBottomrightX = cx + rx * Math.cos(bottomrightAngle);
    const outerBottomrightY = adjustedCy + ry * Math.sin(bottomrightAngle);
    const outerBottomleftX = cx + rx * Math.cos(bottomleftAngle);
    const outerBottomleftY = adjustedCy + ry * Math.sin(bottomleftAngle);

    return [
      { x1: innerBottomrightX, y1: innerBottomrightY, x2: outerBottomrightX, y2: outerBottomrightY },
      { x1: innerBottomleftX, y1: innerBottomleftY, x2: outerBottomleftX, y2: outerBottomleftY }
    ];
  };

  const getLeftFifthDiagonalLines = () => {
    const topleftAngle = (5 * Math.PI) / 4 + 0.01;
    const bottomleftAngle = (3 * Math.PI) / 4 - 0.01;

    const innerTopleftX = cx + dimpleRx * Math.cos(topleftAngle);
    const innerTopleftY = adjustedCy + dimpleRy * Math.sin(topleftAngle);
    const innerBottomleftX = cx + dimpleRx * Math.cos(bottomleftAngle);
    const innerBottomleftY = adjustedCy + dimpleRy * Math.sin(bottomleftAngle);
    const outerBottomleftX = cx + rx * Math.cos(bottomleftAngle);
    const outerBottomleftY = adjustedCy + ry * Math.sin(bottomleftAngle);
    const outerTopleftX = cx + rx * Math.cos(topleftAngle);
    const outerTopleftY = adjustedCy + ry * Math.sin(topleftAngle);

    return [
      { x1: innerBottomleftX, y1: innerBottomleftY, x2: outerBottomleftX, y2: outerBottomleftY },
      { x1: innerTopleftX, y1: innerTopleftY, x2: outerTopleftX, y2: outerTopleftY }
    ];
  };

  const getRightFifthDiagonalLines = () => {
    const toprightAngle = (7 * Math.PI) / 4 - 0.01;
    const bottomrightAngle = Math.PI / 4 + 0.01;

    const innerToprightX = cx + dimpleRx * Math.cos(toprightAngle);
    const innerToprightY = adjustedCy + dimpleRy * Math.sin(toprightAngle);
    const innerBottomrightX = cx + dimpleRx * Math.cos(bottomrightAngle);
    const innerBottomrightY = adjustedCy + dimpleRy * Math.sin(bottomrightAngle);
    const outerBottomrightX = cx + rx * Math.cos(bottomrightAngle);
    const outerBottomrightY = adjustedCy + ry * Math.sin(bottomrightAngle);
    const outerToprightX = cx + rx * Math.cos(toprightAngle);
    const outerToprightY = adjustedCy + ry * Math.sin(toprightAngle);

    return [
      { x1: innerToprightX, y1: innerToprightY, x2: outerToprightX, y2: outerToprightY },
      { x1: innerBottomrightX, y1: innerBottomrightY, x2: outerBottomrightX, y2: outerBottomrightY }
    ];
  };

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
          
          {/* Outer radial gradient for the tonefield plate - 버건디 계열 색상 */}
          <radialGradient id={gid2} cx="50%" cy="50%" r="100%">
            <stop offset="0%" stopColor={OUTER_ELLIPSE_COLOR_CONFIG.color} stopOpacity={OUTER_ELLIPSE_COLOR_CONFIG.opacity * 0.6} />
            <stop offset="30%" stopColor={OUTER_ELLIPSE_COLOR_CONFIG.color} stopOpacity={OUTER_ELLIPSE_COLOR_CONFIG.opacity * 0.5} />
            <stop offset="60%" stopColor={OUTER_ELLIPSE_COLOR_CONFIG.color} stopOpacity={OUTER_ELLIPSE_COLOR_CONFIG.opacity * 0.4} />
            <stop offset="100%" stopColor={OUTER_ELLIPSE_COLOR_CONFIG.color} stopOpacity={OUTER_ELLIPSE_COLOR_CONFIG.opacity * 0.3} />
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

          {/* 방사형 그라데이션 정의 (도너츠 전체 영역, 360도 균일) */}
          <radialGradient
            id="radial-tonefield-gradient"
            cx="50%"
            cy="50%"
            r="50%"
            gradientUnits="objectBoundingBox"
          >
            {RADIAL_GRADIENT_CONFIG.enabled ? (
              <>
                {/* 중심 (0%) */}
                <stop
                  offset="0%"
                  stopColor={RADIAL_GRADIENT_CONFIG.useMultiColor ? RADIAL_GRADIENT_CONFIG.startColor : RADIAL_GRADIENT_CONFIG.color}
                  stopOpacity={RADIAL_GRADIENT_CONFIG.innerOpacity}
                />

                {/* 딤플 경계 (자동 계산) - 투명 유지 */}
                <stop
                  offset={`${RADIAL_GRADIENT_CONFIG.dimpleRatio * 100}%`}
                  stopColor={RADIAL_GRADIENT_CONFIG.useMultiColor ? RADIAL_GRADIENT_CONFIG.startColor : RADIAL_GRADIENT_CONFIG.color}
                  stopOpacity={RADIAL_GRADIENT_CONFIG.innerOpacity}
                />

                {/* 중간 지점 (옵션) */}
                {RADIAL_GRADIENT_CONFIG.useMidPoint && (
                  <stop
                    offset={`${RADIAL_GRADIENT_CONFIG.midPoint * 100}%`}
                    stopColor={RADIAL_GRADIENT_CONFIG.useMultiColor
                      ? `color-mix(in srgb, ${RADIAL_GRADIENT_CONFIG.startColor} 50%, ${RADIAL_GRADIENT_CONFIG.endColor} 50%)`
                      : RADIAL_GRADIENT_CONFIG.color}
                    stopOpacity={RADIAL_GRADIENT_CONFIG.midOpacity}
                  />
                )}

                {/* 바깥 타원 경계 (100%) */}
                <stop
                  offset="100%"
                  stopColor={RADIAL_GRADIENT_CONFIG.useMultiColor ? RADIAL_GRADIENT_CONFIG.endColor : RADIAL_GRADIENT_CONFIG.color}
                  stopOpacity={RADIAL_GRADIENT_CONFIG.outerOpacity}
                />
              </>
            ) : (
              // 그라데이션 비활성화 시 완전 투명
              <stop offset="0%" stopColor="transparent" stopOpacity={0} />
            )}
          </radialGradient>

          {/* 방사형 장력선용 그라데이션 (중심에서 바깥으로 투명도 감소) */}
          <radialGradient
            id="tension-line-stroke-gradient"
            cx="50%"
            cy="50%"
            r="70%"
          >
            <stop
              offset="0%"
              stopColor={RADIAL_TENSION_LINES_CONFIG.colorStart}
              stopOpacity={RADIAL_TENSION_LINES_CONFIG.opacityStart}
            />
            <stop
              offset="100%"
              stopColor={RADIAL_TENSION_LINES_CONFIG.colorEnd}
              stopOpacity={RADIAL_TENSION_LINES_CONFIG.opacityEnd}
            />
          </radialGradient>

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

        {/* Outer ellipse (tonefield body) - fill 투명 처리로 영역 색상 표시 */}
        <ellipse
          cx={cx}
          cy={adjustedCy}
          rx={rx}
          ry={ry}
          fill="none"
          stroke="#334155"
          strokeWidth={1}
          filter="url(#soft)"
        />

        {/* ===== 도너츠 영역 렌더링 (방사형 그라데이션, 360도 균일) ===== */}
        {/* 톤필드 전체 영역 - 중심에서 바깥으로 방사형 하모닉스 튜닝 강도 시각화 */}
        <path
          d={createDonutPath()}
          fill="url(#radial-tonefield-gradient)"
          fillRule="evenodd"
          stroke="none"
        />

        {/* ===== 장력 등고선 (Tension Contour Lines) ===== */}
        {/* 동심원 타원으로 장력 분포 레벨 시각화 */}
        {CONTOUR_CONFIG.enabled && CONTOUR_CONFIG.ratios.map((ratio, i) => (
          <ellipse
            key={`contour-${i}`}
            cx={cx}
            cy={adjustedCy}
            rx={rx * ratio}
            ry={ry * ratio}
            fill="none"
            stroke={CONTOUR_CONFIG.color}
            strokeWidth={i === 0 ? CONTOUR_CONFIG.outerStrokeWidth : CONTOUR_CONFIG.innerStrokeWidth}
            strokeOpacity={CONTOUR_CONFIG.baseOpacity - i * CONTOUR_CONFIG.opacityStep}
          />
        ))}

        {/* ===== 방사형 장력선 (Radial Tension Lines) ===== */}
        {/* 딤플에서 바깥으로 팽팽하게 당겨진 직선 - 금속판 장력 표현 */}
        {RADIAL_TENSION_LINES_CONFIG.enabled &&
          Array.from({ length: RADIAL_TENSION_LINES_CONFIG.count }, (_, i) => {
            const angle = (i / RADIAL_TENSION_LINES_CONFIG.count) * 2 * Math.PI;

            // 시작점 (딤플 경계 근처)
            const x1 = cx + Math.cos(angle) * rx * RADIAL_TENSION_LINES_CONFIG.startRatio;
            const y1 = adjustedCy + Math.sin(angle) * ry * RADIAL_TENSION_LINES_CONFIG.startRatio;

            // 끝점 (바깥 타원 가까이)
            const x2 = cx + Math.cos(angle) * rx * RADIAL_TENSION_LINES_CONFIG.endRatio;
            const y2 = adjustedCy + Math.sin(angle) * ry * RADIAL_TENSION_LINES_CONFIG.endRatio;

            return (
              <line
                key={`tension-line-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="url(#tension-line-stroke-gradient)"
                strokeWidth={RADIAL_TENSION_LINES_CONFIG.strokeWidth}
                strokeLinecap="round"
              />
            );
          })}

        {/* ===== 대각선 (점선) ===== */}
        {/* 옥타브 대각선 */}
        {getOctaveDiagonalLines().map((line, idx) => (
          <line
            key={`octave-diagonal-${idx}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#334155"
            strokeOpacity="0.5"
            strokeWidth="0.5"
            strokeDasharray="4 2"
          />
        ))}

        {/* 토닉 대각선 */}
        {getTonicDiagonalLines().map((line, idx) => (
          <line
            key={`tonic-diagonal-${idx}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#334155"
            strokeOpacity="0.5"
            strokeWidth="0.5"
            strokeDasharray="4 2"
          />
        ))}

        {/* 좌측5도 대각선 */}
        {getLeftFifthDiagonalLines().map((line, idx) => (
          <line
            key={`leftfifth-diagonal-${idx}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#334155"
            strokeOpacity="0.5"
            strokeWidth="0.5"
            strokeDasharray="4 2"
          />
        ))}

        {/* 우측5도 대각선 */}
        {getRightFifthDiagonalLines().map((line, idx) => (
          <line
            key={`rightfifth-diagonal-${idx}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#334155"
            strokeOpacity="0.5"
            strokeWidth="0.5"
            strokeDasharray="4 2"
          />
        ))}

        {/* Dimple (central elliptical depression) */}
        <ellipse
          cx={cx}
          cy={adjustedCy}
          rx={dimpleRx}
          ry={dimpleRy}
          fill={`url(#${gid})`}
          stroke="#475569"
          strokeWidth={0.75}
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
            strokeWidth={idx === 2 ? 0.6 : 0.4}
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

        {/* 바깥 타원 8개 꼭지점 좌표 표시 (상하좌우 + 대각선 4곳) */}
        {(() => {
          // 상하좌우 4곳 (0°, 90°, 180°, 270°)
          const cardinalAngles = [
            { angle: 0, label: "우" },      // Right
            { angle: Math.PI / 2, label: "하" },   // Bottom
            { angle: Math.PI, label: "좌" },       // Left
            { angle: (3 * Math.PI) / 2, label: "상" }, // Top
          ];
          
          // 대각선 4곳 (45°, 135°, 225°, 315°)
          // SVG 좌표계: y축이 아래로 갈수록 증가하므로 각도와 라벨이 반대
          const diagonalAngles = [
            { angle: Math.PI / 4, label: "우하" },      // 45° = 우하 (x+, y+)
            { angle: (3 * Math.PI) / 4, label: "좌하" }, // 135° = 좌하 (x-, y+)
            { angle: (5 * Math.PI) / 4, label: "좌상" }, // 225° = 좌상 (x-, y-)
            { angle: (7 * Math.PI) / 4, label: "우상" }, // 315° = 우상 (x+, y-)
          ];
          
          const allPoints = [...cardinalAngles, ...diagonalAngles];
          
          return allPoints.map((point, i) => {
            // 바깥 타원 위의 점 계산
            const pointX = cx + rx * Math.cos(point.angle);
            const pointY = adjustedCy + ry * Math.sin(point.angle);
            const radius = 6; // 원의 반지름
            const labelOffset = 12; // 라벨 오프셋
            
            // 라벨 위치 계산 (원 밖으로)
            const labelX = pointX + labelOffset * Math.cos(point.angle);
            const labelY = pointY + labelOffset * Math.sin(point.angle);
            
            return (
              <g key={`outer-point-${i}`} visibility="hidden">
                <circle
                  cx={pointX}
                  cy={pointY}
                  r={radius}
                  fill="#ef4444"
                  stroke="#ffffff"
                  strokeWidth={1.5}
                  className="dark:stroke-gray-900"
                />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="11"
                  fill="#ef4444"
                  fontWeight="600"
                  className="dark:fill-red-500"
                >
                  {point.label}
                </text>
                {/* 좌표 값 표시 (작은 글씨) */}
                <text
                  x={labelX}
                  y={labelY + 14}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="9"
                  fill="#6b7280"
                  className="dark:fill-gray-400"
                >
                  ({Math.round(pointX)}, {Math.round(pointY)})
                </text>
              </g>
            );
          });
        })()}

        {/* 안쪽 타원(딤플) 8개 꼭지점 좌표 표시 (상하좌우 + 대각선 4곳) */}
        {(() => {
          // 상하좌우 4곳 (0°, 90°, 180°, 270°)
          const cardinalAngles = [
            { angle: 0, label: "우" },      // Right
            { angle: Math.PI / 2, label: "하" },   // Bottom
            { angle: Math.PI, label: "좌" },       // Left
            { angle: (3 * Math.PI) / 2, label: "상" }, // Top
          ];
          
          // 대각선 4곳 (45°, 135°, 225°, 315°)
          // SVG 좌표계: y축이 아래로 갈수록 증가하므로 각도와 라벨이 반대
          const diagonalAngles = [
            { angle: Math.PI / 4, label: "우하" },      // 45° = 우하 (x+, y+)
            { angle: (3 * Math.PI) / 4, label: "좌하" }, // 135° = 좌하 (x-, y+)
            { angle: (5 * Math.PI) / 4, label: "좌상" }, // 225° = 좌상 (x-, y-)
            { angle: (7 * Math.PI) / 4, label: "우상" }, // 315° = 우상 (x+, y-)
          ];
          
          const allPoints = [...cardinalAngles, ...diagonalAngles];
          
          return allPoints.map((point, i) => {
            // 안쪽 타원(딤플) 위의 점 계산
            const pointX = cx + dimpleRx * Math.cos(point.angle);
            const pointY = adjustedCy + dimpleRy * Math.sin(point.angle);
            const radius = 5; // 원의 반지름 (안쪽은 조금 작게)
            const labelOffset = -10; // 라벨 오프셋 (안쪽으로)
            
            // 라벨 위치 계산 (원 안쪽으로)
            const labelX = pointX + labelOffset * Math.cos(point.angle);
            const labelY = pointY + labelOffset * Math.sin(point.angle);
            
            return (
              <g key={`inner-point-${i}`} visibility="hidden">
                <circle
                  cx={pointX}
                  cy={pointY}
                  r={radius}
                  fill="#3b82f6"
                  stroke="#ffffff"
                  strokeWidth={1.5}
                  className="dark:stroke-gray-900"
                />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="10"
                  fill="#3b82f6"
                  fontWeight="600"
                  className="dark:fill-blue-400"
                >
                  {point.label}
                </text>
                {/* 좌표 값 표시 (작은 글씨) */}
                <text
                  x={labelX}
                  y={labelY + 12}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="8"
                  fill="#6b7280"
                  className="dark:fill-gray-400"
                >
                  ({Math.round(pointX)}, {Math.round(pointY)})
                </text>
              </g>
            );
          });
        })()}

        {/* 라벨 텍스트 - 최상위 레이어 (모든 도형 위에 표시) */}
        {/* Y축 상단: Octave (옥타브 도형 중앙) */}
        <text
          x={cx}
          y={adjustedCy - (dimpleRy + ry) / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="16"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="0.5"
          fontWeight="700"
          style={{ paintOrder: "stroke fill" }}
        >
          Octave
        </text>

        {/* Y축 하단: Tonic */}
        <text
          x={cx}
          y={adjustedCy + (dimpleRy + ry) / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="16"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="0.5"
          fontWeight="700"
          style={{ paintOrder: "stroke fill" }}
        >
          Tonic
        </text>

        {/* X축 좌측: Fifth */}
        <text
          x={cx - (dimpleRx + rx) / 2}
          y={adjustedCy}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="16"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="0.5"
          fontWeight="700"
          style={{ paintOrder: "stroke fill" }}
        >
          Fifth
        </text>

        {/* X축 우측: Fifth */}
        <text
          x={cx + (dimpleRx + rx) / 2}
          y={adjustedCy}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="16"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="0.5"
          fontWeight="700"
          style={{ paintOrder: "stroke fill" }}
        >
          Fifth
        </text>

      </svg>
    </div>
  );
};

export default TonefieldTensionDiagram;

