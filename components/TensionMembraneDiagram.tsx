// components/TensionMembraneDiagram.tsx
"use client";

import * as React from "react";

export const TensionMembraneDiagram: React.FC<
  React.SVGProps<SVGSVGElement>
> = (props) => {
  return (
    <svg
      viewBox="0 0 600 500"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x={0} y={0} width={600} height={500} fill="white" />

      <defs>
        <radialGradient id="membraneFill" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#fff9b1" />
          <stop offset="45%" stopColor="#fff176" />
          <stop offset="100%" stopColor="#7fe38a" />
        </radialGradient>
      </defs>

      {/* ① 바깥 큰 타원 (앵커 쪽 타원) : 경계선 투명 */}
      <ellipse
        cx={300}
        cy={250}
        rx={170}
        ry={210}
        fill="none"
        stroke="none"
      />

      {/* ② 8각형 안쪽에 있는 톤필드 타원: 테두리 투명 */}
      <ellipse
        cx={300}
        cy={250}
        rx={140}
        ry={180}
        fill="none"
        stroke="none"
        strokeWidth={3.2}
        strokeOpacity={0}
        strokeLinejoin="round"
      />

      {/* ③ 8각형 오목 막 */}
      <path
        d="
          M 300,60
          Q 300,200 410,110
          Q 310,250 460,250
          Q 310,300 410,390
          Q 300,300 300,440
          Q 300,300 190,390
          Q 290,250 140,250
          Q 290,200 190,110
          Q 300,200 300,60 Z
        "
        fill="url(#membraneFill)"
        stroke="#3d7058"
        strokeWidth={1.4}
        opacity={0.92}
      />

      {/* ④ 앵커 8개 */}
      <g fill="#fefefe" stroke="#3d7058" strokeWidth={1.4}>
        <circle cx={300} cy={25} r={6} />
        <circle cx={440} cy={80} r={6} />
        <circle cx={490} cy={250} r={6} />
        <circle cx={440} cy={420} r={6} />
        <circle cx={300} cy={475} r={6} />
        <circle cx={160} cy={420} r={6} />
        <circle cx={110} cy={250} r={6} />
        <circle cx={160} cy={80} r={6} />
      </g>

      {/* ⑤ 앵커 → 막 연결선 */}
      <g stroke="#3d7058" strokeWidth={1.2} strokeLinecap="round">
        <line x1={300} y1={25} x2={300} y2={60} />
        <line x1={440} y1={80} x2={410} y2={110} />
        <line x1={490} y1={250} x2={460} y2={250} />
        <line x1={440} y1={420} x2={410} y2={390} />
        <line x1={300} y1={475} x2={300} y2={440} />
        <line x1={160} y1={420} x2={190} y2={390} />
        <line x1={110} y1={250} x2={140} y2={250} />
        <line x1={160} y1={80} x2={190} y2={110} />
      </g>
    </svg>
  );
};

export default TensionMembraneDiagram;
