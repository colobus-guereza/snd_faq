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

/**
 * buildTensionRimPath
 * ------------------------------------------------------------
 * 특정 앵커 각도에서 바깥으로 bulge가 생기는 장력 림 경로 생성
 *
 * @param cx - 타원 중심 x
 * @param cy - 타원 중심 y
 * @param rx - 타원 x 반지름
 * @param ry - 타원 y 반지름
 * @param anchorAngles - bulge가 생길 각도 배열 (라디안)
 * @param bulgeAmplitude - bulge 크기 (0.06 = 6% 바깥으로)
 * @param segments - 경로 세그먼트 개수 (부드러운 곡선)
 * @returns SVG path d 문자열
 */
function buildTensionRimPath(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  anchorAngles: number[],
  bulgeAmplitude = -0.04,
  segments = 220
): string {
  const sigma = Math.PI / 24; // bulge 폭 (각도 기준) - 넓게 하여 완만한 눌림 구간
  let d = "";

  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * 2 * Math.PI;

    // 각 앵커 방향마다 가우시안 형태의 bulge 합산
    let bulge = 0;
    for (const a of anchorAngles) {
      // -π~π 범위로 각도 차 정규화
      let diff = t - a;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      bulge += Math.exp(-(diff * diff) / (2 * sigma * sigma));
    }

    const scale = 1 + bulgeAmplitude * bulge;

    const x = cx + rx * scale * Math.cos(t);
    const y = cy + ry * scale * Math.sin(t);

    if (i === 0) {
      d += `M ${x} ${y}`;
    } else {
      d += ` L ${x} ${y}`;
    }
  }

  d += " Z";
  return d;
}

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
  // 상하 여백을 더욱 확대하여 멀리 배치된 앵커 포함
  const paddingTop = 150; // 상단 여백 확대 (멀리 배치된 앵커 포함)
  const paddingBottom = 150; // 하단 여백 확대
  const paddingHorizontal = 50; // 좌우 여백 확대
  const s = Math.min((w - 2 * paddingHorizontal) / 4, (h - paddingTop - paddingBottom) / 6); // fit 2s (rx) and 3s (ry)
  // 톤필드 크기 고정 (96 x 144)
  const rx = 96;
  const ry = 144;
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

    // ===== 등고선 레벨 설정 (고장력 영역에 압축) =====
    // 바깥 타원 대비 비율 배열 (1.0 = 바깥 타원, 0.0 = 중심)
    // 중심~80% 영역은 매끈하게, 88~98% 영역에만 등고선 집중
    ratios: [0.88, 0.94, 0.98],

    // ===== 색상 및 스타일 =====
    color: "#2f9c7c",                 // 등고선 색상 (진한 청록색)
    baseOpacity: 0.20,                // 첫 번째 등고선 투명도
    opacityStep: 0.06,                // 안쪽으로 갈수록 투명도 감소량

    // ===== 선 두께 =====
    outerStrokeWidth: 0.9,            // 가장 바깥 등고선 두께
    innerStrokeWidth: 0.7,            // 안쪽 등고선 두께 (더 굵게)
  };
  // ============================================

  // ===== 주축 장력선 설정 (Primary Tension Axes) =====
  // Octave/Tonic/Fifth 방향에만 장력선 표시 - 주요 장력 축 강조
  const TENSION_AXIS_CONFIG = {
    // ===== 기본 설정 =====
    enabled: true,                    // 주축 장력선 활성화

    // ===== 주축 각도 (4방향: Octave/Tonic/Fifth) =====
    angles: [
      0,                              // 오른쪽 (Fifth)
      Math.PI / 2,                    // 아래 (Tonic)
      Math.PI,                        // 왼쪽 (Fifth)
      (3 * Math.PI) / 2,              // 위 (Octave)
    ],

    // ===== 선 위치 설정 =====
    innerRatio: 0.35,                 // 선 시작 위치 (딤플 근처)
    outerRatio: 0.98,                 // 선 끝 위치 (림 바로 안쪽)

    // ===== 선 스타일 =====
    strokeWidth: 1.1,                 // 선 두께
    color: "#1b6a57",                 // 선 색상 (진한 청록색)
    opacity: 0.7,                     // 투명도
  };
  // ============================================

  // ===== 내부 장력선 설정 (Inner Stretch Lines) =====
  // 림에서 중앙으로 반쯤만 들어오는 짧은 선 - "막의 결" 표현 (v2.5)
  const INNER_STRETCH_LINES_CONFIG = {
    // ===== 기본 설정 =====
    enabled: true,                    // 내부 장력선 활성화

    // ===== 선 개수 및 위치 =====
    count: 12,                        // 360/12 = 30도 간격
    innerRatio: 0.40,                 // 중앙 40% 지점에서 끝
    outerRatio: 0.95,                 // 림 바로 안쪽에서 시작

    // ===== 선 스타일 =====
    strokeWidth: 0.6,                 // 매우 얇게
    opacity: 0.18,                    // 매우 옅게
    color: "#145c4a",                 // 진한 청록색
  };
  // ============================================

  // ===== 중앙 돔 쉐이딩 설정 (Central Dome Shading) - v2.5 =====
  // 방사형 그라데이션으로 중앙 돔의 볼록함과 림의 눌림 표현
  // 효과: 중앙(0-25%) 밝은 돔 → 중간(55%) 평탄 → 림(100%) 눌림
  const MEMBRANE_SHADING_CONFIG = {
    // ===== 기본 설정 =====
    enabled: false,                   // 중앙 돔 쉐이딩 비활성화 (밝은 톤 유지)

    // ⚠️ 주의: v2.5부터 아래 파라미터들은 사용되지 않음
    // 실제 그라디언트는 <radialGradient id="membrane-dome">에서 직접 정의됨
    // 그라디언트 구조 (5-stop radial):
    //   0%: white opacity 0.45 (돔 정점)
    //   25%: white opacity 0.30 (돔 경사)
    //   55%: #0f172a opacity 0.12 (평탄 전환)
    //   80%: #0f172a opacity 0.22 (눌림 시작)
    //   100%: #0f172a opacity 0.30 (최대 눌림)

    // ===== 레거시 파라미터 (v2.4 이하, 현재 미사용) =====
    topColor: "white",
    topOpacity: 0.22,
    topOffset: 0,
    centerColor: "white",
    centerOpacity: 0.32,
    centerOffset: 0.50,
    bottomColor: "black",
    bottomStartOffset: 0.70,
    bottomStartOpacity: 0.10,
    bottomEndOffset: 1.0,
    bottomEndOpacity: 0.28,
  };
  // ============================================

  // ===== 벡터 필드 그라데이션 설정 (Vector Field Gradient) =====
  // Conic gradient로 방향성 있는 장력 흐름 표현
  const VECTOR_FIELD_CONFIG = {
    // ===== 기본 설정 =====
    enabled: false,                   // 벡터 필드 비활성화 (시각 정보 줄이기)

    // ===== 방향성 줄무늬 설정 =====
    stripeCount: 24,                  // 방사형 줄무늬 개수 (권장: 16, 24, 32)
    stripeIntensity: 0.04,            // 줄무늬 강도 (3-5% 권장, 0.03~0.05)

    // ===== 색상 설정 =====
    baseColor: "#86efac",             // 기본 색상 (밝은 연녹색)
    brightColor: "#a7f3c0",           // 밝은 색상 (하이라이트)
    darkColor: "#6ee7a5",             // 어두운 색상 (그림자)

    // ===== 투명도 설정 =====
    baseOpacity: 0.4,                 // 기본 투명도
  };
  // ============================================

  // ===== 외곽 인워드 섀도우 설정 (Inward Shadow) =====
  // 톤필드 외곽을 따라 안쪽으로 말려 들어가는 음영 - 당겨진 금속 표면 입체감
  const INWARD_SHADOW_CONFIG = {
    // ===== 기본 설정 =====
    enabled: false,                   // 인워드 섀도우 비활성화 (밝은 톤 유지)

    // ===== 섀도우 범위 설정 (바깥 10-15%에만 집중) =====
    startOffset: 0.85,                // 섀도우 시작 지점 (85% - 림 근처만)
    endOffset: 1.0,                   // 섀도우 끝 지점 (100% - 외곽 림)

    // ===== 색상 및 투명도 =====
    color: "#1f5b52",                 // 회청색 계열 진한 녹색
    startOpacity: 0.0,                // 시작 투명도 (85% 지점)
    endOpacity: 0.35,                 // 끝 투명도 (외곽 림, 더 진하게)
  };
  // ============================================

  // ===== 외곽 리플 엣지 설정 (Ripple Edge) =====
  // 바깥 경계를 따라 360° 가느다란 주름 - 장력이 바깥으로 빠져나가는 느낌
  const RIPPLE_EDGE_CONFIG = {
    // ===== 기본 설정 =====
    enabled: true,                    // 리플 엣지 활성화

    // ===== 리플 레이어 설정 =====
    // 각 레이어는 바깥 타원 대비 확대 비율
    layers: [
      { factor: 1.03, strokeWidth: 0.6, opacity: 0.40, dashArray: "3 4" },
      { factor: 1.06, strokeWidth: 0.4, opacity: 0.28, dashArray: "1.5 4.5" },
    ],

    // ===== 색상 설정 =====
    color: "#7fd5b6",                 // 밝은 청록색 (장력선 색상과 유사)

    // ===== 블러 효과 =====
    useBlur: true,                    // 부드러운 블러 효과
    blurAmount: 0.8,                  // 블러 강도 (stdDeviation)
  };
  // ============================================

  // ===== 장력 벨트 설정 (Tension Belt) - v2.5 =====
  // 림 안쪽 경계 강조 (94-98%) - 막이 림에 고정되는 바로 안쪽 밝은 띠
  const TENSION_BELT_CONFIG = {
    // ===== 기본 설정 =====
    enabled: true,                    // 장력 벨트 활성화

    // ⚠️ 주의: v2.5부터 아래 파라미터들은 사용되지 않음
    // 실제 그라디언트는 <radialGradient id="tension-belt">에서 직접 정의됨
    // 그라디언트 구조 (5-stop radial):
    //   0%: transparent (내부)
    //   90%: transparent
    //   94%: white opacity 0.65 (밝은 띠 시작)
    //   98%: white opacity 0.10 (페이드아웃)
    //   100%: transparent

    // ===== 레거시 파라미터 (v2.4 이하, 현재 미사용) =====
    insetOffset: 6,
    innerStartOffset: 0.0,
    beltTransitionOffset: 0.94,
    beltPeakOffset: 0.97,
    beltEndOffset: 1.0,
    innerColor: "#ffffff",
    beltColor: "#ffffff",
    innerOpacity: 0.0,
    beltPeakOpacity: 0.75,
    beltEndOpacity: 0.0,
  };
  // ============================================

  // ===== 림 앵커 틱 설정 (Rim Anchor Ticks) =====
  // 주요 방향에만 최소한의 앵커 틱 표시 - rimPath가 이미 장력 형태를 표현
  const RIM_ANCHOR_CONFIG = {
    // ===== 기본 설정 =====
    enabled: true,                    // 림 앵커 틱 활성화

    // ===== 틱 설정 =====
    count: 4,                         // 틱 개수 (Octave/Tonic/Fifth 4방향만)
    innerRatio: 0.98,                 // 안쪽 끝 (림 안쪽)
    outerRatio: 1.02,                 // 바깥쪽 끝 (림 바깥쪽)

    // ===== 색상 및 스타일 =====
    stroke: "#145c4a",                // 진한 청록색
    strokeWidth: 0.9,                 // 선 두께
    opacity: 0.7,                     // 투명도
  };
  // ============================================

  // ===== 장력 림 설정 (Tension Rim) =====
  // ❌ 비활성화: 타원 경계선은 완벽한 타원형으로 유지
  // 경계선 자체의 변형(bulge)은 물리적 의미가 불명확
  const TENSION_RIM_CONFIG = {
    // ===== 기본 설정 =====
    enabled: false,                   // ❌ 장력 림 비활성화 (v2.4)

    // ===== Bulge 설정 (사용 안 함) =====
    bulgeAmplitude: -0.04,            // (미사용)
    segments: 220,                    // (미사용)

    // ===== 앵커 각도 (사용 안 함) =====
    anchorAngles: [
      0,                              // (미사용)
      Math.PI / 2,                    // (미사용)
      Math.PI,                        // (미사용)
      (3 * Math.PI) / 2,              // (미사용)
    ],
  };
  // ============================================

  // 장력 림 경로 생성
  const tensionRimPath = TENSION_RIM_CONFIG.enabled
    ? buildTensionRimPath(
        cx,
        adjustedCy,
        rx,
        ry,
        TENSION_RIM_CONFIG.anchorAngles,
        TENSION_RIM_CONFIG.bulgeAmplitude,
        TENSION_RIM_CONFIG.segments
      )
    : "";
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

          {/* 리플 엣지용 블러 필터 (부드러운 주름 표현) */}
          <filter id="rippleBlur" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation={RIPPLE_EDGE_CONFIG.blurAmount} />
          </filter>

          {/* 방사형 그라데이션 정의 (도너츠 전체 영역, 360도 균일) */}
          {/* 하단 도표와 동일한 노란색 → 연녹색 그라데이션 */}
          <radialGradient
            id="radial-tonefield-gradient"
            cx="50%"
            cy="50%"
            r="50%"
            gradientUnits="objectBoundingBox"
          >
            {RADIAL_GRADIENT_CONFIG.enabled ? (
              <>
                {/* 중심: 밝은 노랑 */}
                <stop offset="0%" stopColor="#ffff80" stopOpacity="1" />
                {/* 중간 1: 노랑 */}
                <stop offset="45%" stopColor="#ffe066" stopOpacity="1" />
                {/* 중간 2: 연두 */}
                <stop offset="70%" stopColor="#a4f36a" stopOpacity="0.9" />
                {/* 가장자리: 연두/초록 */}
                <stop offset="100%" stopColor="#44c767" stopOpacity="0.8" />
              </>
            ) : (
              // 그라데이션 비활성화 시 완전 투명
              <stop offset="0%" stopColor="transparent" stopOpacity={0} />
            )}
          </radialGradient>

          {/* 방사형 장력선용 그라데이션 (림에서 가장 강하게) */}
          <radialGradient
            id="tension-line-stroke-gradient"
            cx="50%"
            cy="50%"
            r="70%"
          >
            {/* 중심은 약하게 */}
            <stop
              offset="0%"
              stopColor="#2bb5a0"
              stopOpacity={0.10}
            />
            <stop
              offset="55%"
              stopColor="#2bb5a0"
              stopOpacity={0.35}
            />
            {/* 림 근처에서 가장 진하게 */}
            <stop
              offset="100%"
              stopColor="#2bb5a0"
              stopOpacity={0.80}
            />
          </radialGradient>

          {/* 중앙 돔 쉐이딩용 방사형 그라데이션 (v2.5) */}
          {/* 중앙: 밝은 돔 → 중간: 평탄 → 림: 눌린 어두운 링 */}
          <radialGradient id="membrane-dome" cx="50%" cy="50%" r="60%">
            {/* 중앙 하이라이트: 살짝 작고 강하게 (돔 정점) */}
            <stop offset="0%" stopColor="white" stopOpacity="0.45" />
            <stop offset="25%" stopColor="white" stopOpacity="0.30" />
            {/* 돔의 받침 링: 약간 어둡게 (평탄 전환) */}
            <stop offset="55%" stopColor="#0f172a" stopOpacity="0.12" />
            {/* 림 방향으로 갈수록 더 어둡게 (눌림 효과) */}
            <stop offset="80%" stopColor="#0f172a" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.30" />
          </radialGradient>

          {/* 외곽 인워드 섀도우용 그라데이션 (바깥 10-15%에만 집중) */}
          <radialGradient
            id="inward-shadow-gradient"
            cx="50%"
            cy="50%"
            r="70%"
          >
            {/* 중심부터 85%까지는 투명 */}
            <stop
              offset="0%"
              stopColor={INWARD_SHADOW_CONFIG.color}
              stopOpacity="0"
            />
            <stop
              offset={`${INWARD_SHADOW_CONFIG.startOffset * 100}%`}
              stopColor={INWARD_SHADOW_CONFIG.color}
              stopOpacity={INWARD_SHADOW_CONFIG.startOpacity}
            />
            {/* 외곽 림 근처에서만 급격히 어두워짐 */}
            <stop
              offset={`${INWARD_SHADOW_CONFIG.endOffset * 100}%`}
              stopColor={INWARD_SHADOW_CONFIG.color}
              stopOpacity={INWARD_SHADOW_CONFIG.endOpacity}
            />
          </radialGradient>

          {/* 장력 벨트용 그라데이션 (94-98% 안쪽 경계 강조) - v2.5 */}
          <radialGradient id="tension-belt" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="90%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="94%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="98%" stopColor="#ffffff" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          {/* 림 눌림 링 그라데이션 (Rim Press Ring) - 눌린 림 강조 (v2.5) */}
          <radialGradient id="rim-press-ring" cx="50%" cy="50%" r="60%">
            <stop offset="96%" stopColor="#020617" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.0" />
          </radialGradient>

          {/* 외부 막 그라데이션 (텐세일 구조 장력 모델: 중심=저응력(파랑) → 외곽=고응력(빨강)) */}
          <radialGradient id="starMembraneFill" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#3A77C7" />   {/* 최저 장력 (중심, 푸른색) */}
            <stop offset="25%" stopColor="#89D4F0" />  {/* 약한 장력 (하늘색) */}
            <stop offset="50%" stopColor="#FFE283" />  {/* 중간 장력 (노랑) */}
            <stop offset="75%" stopColor="#FF9F45" />  {/* 중고 장력 (주황) */}
            <stop offset="100%" stopColor="#FF4D4D" /> {/* 고장력 (앵커 근처, 붉은색) */}
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

        {/* Outer rim (tonefield body) - 장력 림 또는 기본 타원 */}
        {TENSION_RIM_CONFIG.enabled ? (
          <path
            d={tensionRimPath}
            fill="none"
            stroke="#334155"
            strokeWidth={1}
            filter="url(#soft)"
          />
        ) : (
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
        )}

        {/* ===== 8-pointed Star Membrane ===== */}
        {/* 별 모양 막 - 톤필드를 둘러싼 8개 뾰족한 돌출부 */}
        {(() => {
          // 별 모양 크기 설정 (고정된 톤필드 크기 기준)
          // 톤필드가 20% 증가되어 있으므로 (rx=96, ry=144), 원래 크기로 환산
          const baseRx = rx / 1.2; // 96 / 1.2 = 80
          const baseRy = ry / 1.2; // 144 / 1.2 = 120
          const starOuterRx = baseRx * 1.8; // 별 꼭지점 반경
          const starOuterRy = baseRy * 1.8;
          const starInnerRx = baseRx * 0.88; // 오목한 부분 반경 (30% 더 오목하게)
          const starInnerRy = baseRy * 0.88;

          // 앵커 위치 (기본)
          const anchorRxBase = baseRx * 2.8;
          const anchorRyBase = baseRy * 2.8;
          // 좌우측 앵커는 더 멀리 (꼭지점 증가 비율 반영: 2.12/1.8 = 1.178)
          const anchorRxHorizontal = baseRx * 3.9;
          const anchorRyHorizontal = baseRy * 3.9;

          // 8개 방향 각도 (별 꼭지점)
          const starAngles = [0, 45, 90, 135, 180, 225, 270, 315];

          // 별 꼭지점 좌표 (좌우측은 더 바깥으로)
          const starPoints = starAngles.map(deg => {
            const rad = deg * Math.PI / 180;
            // 좌측(180°) 또는 우측(0°)인지 확인
            const isHorizontal = (deg === 0 || deg === 180);
            // 좌우측 꼭지점은 앵커 증가 비율(3.3/2.8 = 1.179)만큼 더 바깥으로
            const tipMultiplier = isHorizontal ? 2.12 : 1.8;
            const tipRx = baseRx * tipMultiplier;
            const tipRy = baseRy * tipMultiplier;

            return {
              angle: deg,
              x: cx + tipRx * Math.cos(rad),
              y: adjustedCy + tipRy * Math.sin(rad)
            };
          });

          // 오목한 부분 좌표 (별 꼭지점 사이)
          const valleyAngles = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];
          const valleyPoints = valleyAngles.map(deg => {
            const rad = deg * Math.PI / 180;
            return {
              angle: deg,
              x: cx + starInnerRx * Math.cos(rad),
              y: adjustedCy + starInnerRy * Math.sin(rad)
            };
          });

          // 앵커 좌표 (좌우측은 더 멀리 배치)
          const anchorPoints = starAngles.map(deg => {
            const rad = deg * Math.PI / 180;
            // 좌측(180°) 또는 우측(0°)인지 확인
            const isHorizontal = (deg === 0 || deg === 180);
            const anchorRx = isHorizontal ? anchorRxHorizontal : anchorRxBase;
            const anchorRy = isHorizontal ? anchorRyHorizontal : anchorRyBase;

            return {
              angle: deg,
              x: cx + anchorRx * Math.cos(rad),
              y: adjustedCy + anchorRy * Math.sin(rad)
            };
          });

          // 별 모양 경로 생성 (꼭지점 → 오목 → 꼭지점 → 오목 ...)
          let starPath = `M ${starPoints[0].x},${starPoints[0].y}`;
          for (let i = 0; i < 8; i++) {
            const valley = valleyPoints[i];
            const nextStar = starPoints[(i + 1) % 8];
            // 부드러운 곡선으로 연결
            starPath += ` Q ${valley.x},${valley.y} ${nextStar.x},${nextStar.y}`;
          }
          starPath += ' Z';

          return (
            <>
              {/* 별 모양 막 */}
              <path
                d={starPath}
                fill="url(#starMembraneFill)"
                stroke="#3d7058"
                strokeWidth={1.4}
                opacity={0.92}
              />

              {/* 앵커 8개 (핀/못 형태) */}
              <g>
                {anchorPoints.map((point, i) => {
                  // 앵커에서 중심으로 향하는 방향 벡터 계산
                  const dx = cx - point.x;
                  const dy = adjustedCy - point.y;
                  const dist = Math.sqrt(dx * dx + dy * dy);
                  const ux = dx / dist;
                  const uy = dy / dist;

                  // 핀의 샤프트(못대) 길이와 너비
                  const shaftLength = 12;
                  const shaftWidth = 3;

                  // 샤프트 끝점 (중심 방향으로)
                  const shaftEndX = point.x + ux * shaftLength;
                  const shaftEndY = point.y + uy * shaftLength;

                  // 샤프트에 수직인 벡터 (샤프트 너비용)
                  const perpX = -uy;
                  const perpY = ux;

                  return (
                    <g key={`star-anchor-${i}`}>
                      {/* 핀 샤프트 (못대) */}
                      <line
                        x1={point.x}
                        y1={point.y}
                        x2={shaftEndX}
                        y2={shaftEndY}
                        stroke="#3d7058"
                        strokeWidth={shaftWidth}
                        strokeLinecap="round"
                      />
                      {/* 핀 헤드 (못머리) - 더 크고 뚜렷하게 */}
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={7}
                        fill="#505050"
                        stroke="#2a2a2a"
                        strokeWidth={1.5}
                      />
                      {/* 핀 헤드 하이라이트 (금속 광택 효과) */}
                      <circle
                        cx={point.x - 2}
                        cy={point.y - 2}
                        r={2.5}
                        fill="#ffffff"
                        opacity={0.6}
                      />
                    </g>
                  );
                })}
              </g>

              {/* 앵커 → 별 꼭지점 연결선 */}
              <g stroke="#3d7058" strokeWidth={1.2} strokeLinecap="round">
                {anchorPoints.map((anchor, i) => {
                  const star = starPoints[i];
                  return (
                    <line
                      key={`star-anchor-line-${i}`}
                      x1={anchor.x}
                      y1={anchor.y}
                      x2={star.x}
                      y2={star.y}
                    />
                  );
                })}
              </g>
            </>
          );
        })()}

        {/* ===== 외곽 리플 엣지 (Ripple Edge) ===== */}
        {/* 바깥 경계를 따라 360° 가느다란 주름 - 장력이 바깥으로 빠져나가는 느낌 */}
        {RIPPLE_EDGE_CONFIG.enabled &&
          RIPPLE_EDGE_CONFIG.layers.map((layer, i) => (
            <ellipse
              key={`ripple-${i}`}
              cx={cx}
              cy={adjustedCy}
              rx={rx * layer.factor}
              ry={ry * layer.factor}
              fill="none"
              stroke={RIPPLE_EDGE_CONFIG.color}
              strokeWidth={layer.strokeWidth}
              strokeOpacity={layer.opacity}
              strokeDasharray={layer.dashArray}
              filter={RIPPLE_EDGE_CONFIG.useBlur ? "url(#rippleBlur)" : undefined}
            />
          ))}

        {/* ===== 도너츠 영역 렌더링 (방사형 그라데이션, 360도 균일) ===== */}
        {/* 톤필드 전체 영역 - 중심에서 바깥으로 방사형 하모닉스 튜닝 강도 시각화 */}
        <path
          d={createDonutPath()}
          fill="url(#radial-tonefield-gradient)"
          fillRule="evenodd"
          stroke="none"
        />

        {/* ===== 벡터 필드 그라데이션 (Vector Field Gradient) ===== */}
        {/* 방향성 있는 장력 흐름 표현 - 각도별 미세한 밝기 변화 */}
        {VECTOR_FIELD_CONFIG.enabled &&
          Array.from({ length: VECTOR_FIELD_CONFIG.stripeCount }, (_, i) => {
            const startAngle = (i / VECTOR_FIELD_CONFIG.stripeCount) * 2 * Math.PI;
            const endAngle = ((i + 1) / VECTOR_FIELD_CONFIG.stripeCount) * 2 * Math.PI;

            // 각도별 밝기 변화 (사인파 패턴)
            const brightness = Math.sin(i * Math.PI / (VECTOR_FIELD_CONFIG.stripeCount / 4)) * VECTOR_FIELD_CONFIG.stripeIntensity;
            const isBright = brightness > 0;
            const intensity = Math.abs(brightness);

            // 부채꼴 영역 path 생성 (안쪽 타원 → 바깥 타원)
            const innerX1 = cx + dimpleRx * Math.cos(startAngle);
            const innerY1 = adjustedCy + dimpleRy * Math.sin(startAngle);
            const innerX2 = cx + dimpleRx * Math.cos(endAngle);
            const innerY2 = adjustedCy + dimpleRy * Math.sin(endAngle);
            const outerX1 = cx + rx * Math.cos(startAngle);
            const outerY1 = adjustedCy + ry * Math.sin(startAngle);
            const outerX2 = cx + rx * Math.cos(endAngle);
            const outerY2 = adjustedCy + ry * Math.sin(endAngle);

            // 각도 차이 계산
            let angleDiff = endAngle - startAngle;
            const largeArcFlag = angleDiff > Math.PI ? 1 : 0;

            // 부채꼴 path: 안쪽 시작 → 안쪽 호 → 바깥쪽 끝으로 직선 → 바깥 호 역방향 → 안쪽 시작으로 직선
            const sectorPath = `
              M ${innerX1} ${innerY1}
              A ${dimpleRx} ${dimpleRy} 0 ${largeArcFlag} 1 ${innerX2} ${innerY2}
              L ${outerX2} ${outerY2}
              A ${rx} ${ry} 0 ${largeArcFlag} 0 ${outerX1} ${outerY1}
              Z
            `;

            return (
              <path
                key={`vector-field-${i}`}
                d={sectorPath}
                fill={isBright ? VECTOR_FIELD_CONFIG.brightColor : VECTOR_FIELD_CONFIG.darkColor}
                fillOpacity={intensity}
                stroke="none"
              />
            );
          })}

        {/* ===== 중앙 돔 쉐이딩 오버레이 (v2.5) ===== */}
        {/* 방사형 그라데이션으로 중앙 돔의 볼록함과 림의 눌림 표현 */}
        {MEMBRANE_SHADING_CONFIG.enabled && (
          <path
            d={createDonutPath()}
            fill="url(#membrane-dome)"
            fillRule="evenodd"
            stroke="none"
          />
        )}

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

        {/* ===== 주축 장력선 (Primary Tension Axes) ===== */}
        {/* Octave/Tonic/Fifth 방향에만 장력선 표시 - 주요 장력 축 강조 */}
        {TENSION_AXIS_CONFIG.enabled &&
          TENSION_AXIS_CONFIG.angles.map((angle, i) => {
            const { innerRatio, outerRatio } = TENSION_AXIS_CONFIG;

            const x1 = cx + Math.cos(angle) * rx * innerRatio;
            const y1 = adjustedCy + Math.sin(angle) * ry * innerRatio;
            const x2 = cx + Math.cos(angle) * rx * outerRatio;
            const y2 = adjustedCy + Math.sin(angle) * ry * outerRatio;

            return (
              <line
                key={`tension-axis-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={TENSION_AXIS_CONFIG.color}
                strokeWidth={TENSION_AXIS_CONFIG.strokeWidth}
                strokeOpacity={TENSION_AXIS_CONFIG.opacity}
                strokeLinecap="round"
              />
            );
          })}

        {/* ===== 내부 장력선 (Inner Stretch Lines) ===== */}
        {/* 림에서 중앙으로 반쯤만 들어오는 짧은 선 - "막의 결" 표현 (v2.5) */}
        {INNER_STRETCH_LINES_CONFIG.enabled &&
          Array.from({ length: INNER_STRETCH_LINES_CONFIG.count }).map((_, i) => {
            const angle = (i / INNER_STRETCH_LINES_CONFIG.count) * 2 * Math.PI;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);

            const xOuter = cx + cos * rx * INNER_STRETCH_LINES_CONFIG.outerRatio;
            const yOuter = adjustedCy + sin * ry * INNER_STRETCH_LINES_CONFIG.outerRatio;

            const xInner = cx + cos * rx * INNER_STRETCH_LINES_CONFIG.innerRatio;
            const yInner = adjustedCy + sin * ry * INNER_STRETCH_LINES_CONFIG.innerRatio;

            return (
              <line
                key={`inner-stretch-${i}`}
                x1={xOuter}
                y1={yOuter}
                x2={xInner}
                y2={yInner}
                stroke={INNER_STRETCH_LINES_CONFIG.color}
                strokeWidth={INNER_STRETCH_LINES_CONFIG.strokeWidth}
                strokeOpacity={INNER_STRETCH_LINES_CONFIG.opacity}
                strokeLinecap="round"
              />
            );
          })}

        {/* ===== 외곽 인워드 섀도우 (Inward Shadow) ===== */}
        {/* 외곽 림을 따라 안쪽으로 말려 들어가는 음영 - 당겨진 금속 표면 입체감 */}
        {INWARD_SHADOW_CONFIG.enabled && (
          <path
            d={createDonutPath()}
            fill="url(#inward-shadow-gradient)"
            fillRule="evenodd"
            stroke="none"
          />
        )}

        {/* ===== 장력 벨트 (Tension Belt) ===== */}
        {/* 림 안쪽 경계 강조 (94-98%) - 막이 고정되는 바로 안쪽 밝은 띠 (v2.5) */}
        {TENSION_BELT_CONFIG.enabled && (
          <path
            d={createDonutPath()}
            fill="url(#tension-belt)"
            fillRule="evenodd"
            stroke="none"
          />
        )}

        {/* ===== 림 눌림 링 (Rim Press Ring) ===== */}
        {/* 림 안쪽 어두운 쉐도우 (96-100%) - 눌린 림 효과 강조 (v2.5) */}
        {TENSION_RIM_CONFIG.enabled && (
          <path
            d={tensionRimPath}
            fill="url(#rim-press-ring)"
            stroke="none"
          />
        )}

        {/* ===== 림 앵커 틱 (Rim Anchor Ticks) ===== */}
        {/* 주요 방향에만 최소한의 앵커 틱 표시 - rimPath가 이미 장력 형태를 표현 */}
        {RIM_ANCHOR_CONFIG.enabled &&
          Array.from({ length: RIM_ANCHOR_CONFIG.count }, (_, i) => {
            const angle = (i / RIM_ANCHOR_CONFIG.count) * 2 * Math.PI;

            const sx = cx + Math.cos(angle) * rx * RIM_ANCHOR_CONFIG.outerRatio;
            const sy = adjustedCy + Math.sin(angle) * ry * RIM_ANCHOR_CONFIG.outerRatio;
            const ex = cx + Math.cos(angle) * rx * RIM_ANCHOR_CONFIG.innerRatio;
            const ey = adjustedCy + Math.sin(angle) * ry * RIM_ANCHOR_CONFIG.innerRatio;

            return (
              <line
                key={`rim-tick-${i}`}
                x1={sx}
                y1={sy}
                x2={ex}
                y2={ey}
                stroke={RIM_ANCHOR_CONFIG.stroke}
                strokeWidth={RIM_ANCHOR_CONFIG.strokeWidth}
                strokeOpacity={RIM_ANCHOR_CONFIG.opacity}
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

        {/* Radial tension arrows: 외부 방사형 화살표 (방향별 장력 강도 표현) */}
        {dirs.map((t, i) => {
          const { shaft, head } = arrowPath(t);

          // 수평 방향 성분 계산 (좌우 = 1, 상하 = 0)
          const horizontalIntensity = Math.abs(Math.cos(t));

          // 색상 보간: 수평(빨강) ↔ 수직(주황)
          // 빨강 #FF4D4D (255, 77, 77)
          // 주황 #FF9F45 (255, 159, 69)
          const r = 255;
          const g = Math.round(77 + (159 - 77) * (1 - horizontalIntensity));
          const b = Math.round(77 + (69 - 77) * (1 - horizontalIntensity));
          const arrowColor = `rgb(${r}, ${g}, ${b})`;

          return (
            <g key={i}>
              {/* 외곽선 (흰색 테두리로 가독성 향상) */}
              <path d={shaft} stroke="#ffffff" strokeWidth={4} fill="none" opacity={0.8} />
              <path d={head} stroke="#ffffff" strokeWidth={4} fill="none" opacity={0.8} />
              {/* 화살표 본체 (장력 색상) */}
              <path d={shaft} stroke={arrowColor} strokeWidth={2.5} fill="none" />
              <path d={head} stroke={arrowColor} strokeWidth={2.5} fill="none" />
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

