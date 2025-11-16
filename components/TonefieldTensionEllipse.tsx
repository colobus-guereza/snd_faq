"use client";

import React from "react";

export const TonefieldTensionEllipse: React.FC = () => {
  const width = 480;
  const height = 480;

  const cx = width / 2;
  const cy = height / 2;

  // 타원 톤필드 비율 (가로:세로)
  const rxOuter = 170; // 바깥 타원 X반지름
  const ryOuter = 210; // 바깥 타원 Y반지름 (조금 더 길게 → 톤필드 느낌)
  const rxInner = 60;  // 안쪽 타원 X반지름
  const ryInner = 80;  // 안쪽 타원 Y반지름

  // 앵커 6개 데이터 계산
  const anchorData = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * 2 * Math.PI; // 0, 60, 120, ... 300도

    // 바깥 타원 위의 중심 방향 점
    const edgeX = cx + rxOuter * Math.cos(angle);
    const edgeY = cy + ryOuter * Math.sin(angle);

    // 바깥쪽으로 조금 더 나간 실제 앵커 위치
    const anchorScale = 1.25; // 앵커가 타원 밖으로 나가는 비율
    const anchorX = cx + rxOuter * anchorScale * Math.cos(angle);
    const anchorY = cy + ryOuter * anchorScale * Math.sin(angle);

    // 각 앵커마다 양옆의 타원 점 (조금씩 회전시켜 "뿔" 폭 만들기)
    const spreadDeg = 12; // 뿔의 펼쳐진 각도
    const spreadRad = (spreadDeg * Math.PI) / 180;

    const leftAngle = angle - spreadRad;
    const rightAngle = angle + spreadRad;

    const leftX = cx + rxOuter * Math.cos(leftAngle);
    const leftY = cy + ryOuter * Math.sin(leftAngle);

    const rightX = cx + rxOuter * Math.cos(rightAngle);
    const rightY = cy + ryOuter * Math.sin(rightAngle);

    return {
      angle,
      edgeX,
      edgeY,
      anchorX,
      anchorY,
      leftX,
      leftY,
      rightX,
      rightY,
    };
  });

  return (
    <div className="w-full flex items-center justify-center">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="max-w-full"
        role="img"
        aria-label="Elliptical tonefield membrane with six anchors"
      >
        <defs>
          {/* 톤필드 내부 장력 컬러맵 (원본 이미지 느낌: 노랑 → 연두 → 초록) */}
          <radialGradient id="tonefieldGradient" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#ffff80" />  {/* 밝은 노랑 중심 */}
            <stop offset="45%" stopColor="#ffe066" />
            <stop offset="70%" stopColor="#a4f36a" />
            <stop offset="100%" stopColor="#44c767" /> {/* 가장자리 연두/초록 */}
          </radialGradient>

          {/* 외곽선 조금 더 진하게 */}
          <linearGradient id="rimStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1f2937" />
          </linearGradient>

          {/* 앵커 화살표 헤드 (옵션) */}
          <marker
            id="anchorArrow"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L6,3 L0,6 z" fill="#111827" />
          </marker>
        </defs>

        {/* 전체 배경 살짝 그리드 느낌 (아주 연하게) */}
        <rect width={width} height={height} fill="#f9fafb" />
        <g stroke="#e5e7eb" strokeWidth={1}>
          {Array.from({ length: 9 }, (_, i) => (
            <line
              key={`v-${i}`}
              x1={(i * width) / 8}
              y1={0}
              x2={(i * width) / 8}
              y2={height}
            />
          ))}
          {Array.from({ length: 9 }, (_, i) => (
            <line
              key={`h-${i}`}
              x1={0}
              y1={(i * height) / 8}
              x2={width}
              y2={(i * height) / 8}
            />
          ))}
        </g>

        {/* 중앙축 가이드 (옵션) */}
        <g stroke="#9ca3af" strokeWidth={1.2} opacity={0.5}>
          <line x1={cx} y1={40} x2={cx} y2={height - 40} />
          <line x1={40} y1={cy} x2={width - 40} y2={cy} />
        </g>

        {/* ---- 톤필드 바깥 타원 (장력 컬러맵) ---- */}
        <ellipse
          cx={cx}
          cy={cy}
          rx={rxOuter}
          ry={ryOuter}
          fill="url(#tonefieldGradient)"
          stroke="url(#rimStroke)"
          strokeWidth={2}
        />

        {/* 안쪽 타원 (딤플 주변, 약간 어둡게) */}
        <ellipse
          cx={cx}
          cy={cy}
          rx={rxInner}
          ry={ryInner}
          fill="#e5e7eb"
          stroke="#6b7280"
          strokeWidth={1.5}
        />

        {/* 안쪽 타원 안의 그라데이션으로 입체감 */}
        <ellipse
          cx={cx}
          cy={cy}
          rx={rxInner * 0.7}
          ry={ryInner * 0.7}
          fill="url(#tonefieldGradient)"
          opacity={0.65}
        />

        {/* ---- 6개 앵커 방향 "뿔" / 텐션 스켈롭 ---- */}
        <g>
          {anchorData.map((a, idx) => (
            <path
              key={`petal-${idx}`}
              d={`
                M ${a.leftX} ${a.leftY}
                L ${a.anchorX} ${a.anchorY}
                L ${a.rightX} ${a.rightY}
                Z
              `}
              fill="url(#tonefieldGradient)"
              opacity={0.85}
              stroke="#15803d"
              strokeWidth={1.2}
            />
          ))}
        </g>

        {/* 톤필드 림과 앵커를 잇는 장력선 */}
        <g stroke="#111827" strokeWidth={1.5}>
          {anchorData.map((a, idx) => (
            <line
              key={`radial-${idx}`}
              x1={a.edgeX}
              y1={a.edgeY}
              x2={a.anchorX}
              y2={a.anchorY}
              markerEnd="url(#anchorArrow)"
            />
          ))}
        </g>

        {/* 앵커 포인트 표시 (작은 원) */}
        <g>
          {anchorData.map((a, idx) => (
            <circle
              key={`anchor-${idx}`}
              cx={a.anchorX}
              cy={a.anchorY}
              r={5}
              fill="#111827"
            />
          ))}
        </g>

        {/* 중앙 설명 텍스트 (옵션) */}
        <text
          x={cx}
          y={cy + ryInner + 24}
          textAnchor="middle"
          fontSize={14}
          fill="#374151"
        >
          Elliptical tonefield tension (top view, 6 anchors)
        </text>
      </svg>
    </div>
  );
};

export default TonefieldTensionEllipse;
