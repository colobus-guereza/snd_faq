# 톤필드 장력 다이어그램 애니메이션 리팩토링 사양서

## 1. 프로젝트 개요

### 목적
핸드팬 톤필드의 장력 분포를 시각화하는 다이어그램을 12프레임 애니메이션으로 확장하여, 막이 점진적으로 당겨지는 과정을 GIF로 제작

### 현재 상태
- 완전히 당겨진 상태(프레임 12)의 정적 이미지 구현 완료
- 물리적으로 정확한 이방성 장력 분포 표현
- React/TypeScript 기반 SVG 컴포넌트

---

## 2. 현재 코드 구조

### 2.1 파일 위치
- **컴포넌트**: `components/TonefieldTensionDiagram.tsx` (1779줄)
- **사용처**: `components/FAQDetail.tsx` (FAQ ID "19"에서 12개 인스턴스 렌더링)

### 2.2 컴포넌트 Props (현재)
```typescript
type TonefieldTensionDiagramProps = {
  width?: number;        // default: 720
  height?: number;       // default: 480
  arrows?: number;       // default: 24 (미사용)
  color?: string;        // default: "#2563eb"
  showLegend?: boolean;  // default: true
};
```

---

## 3. 핵심 시각 요소 및 현재 파라미터 값

### 3.1 톤필드 내부 (중심 타원)
**기본 크기:**
- `rx = 120` (수평 반경)
- `ry = 80` (수직 반경, 타원 비율 2:3)

**그라디언트:**
- ID: `radial-tonefield-gradient`
- 중심: 밝은 노랑 (#ffff80)
- 외곽: 연두/초록 (#44c767)

**방향성 힌트 (미세):**
- 수평 힌트: 좌우 가장자리에 노랑 틴트 (불투명도 8%)
- 수직 힌트: 상하 가장자리에 초록 틴트 (불투명도 6%)

### 3.2 외부 막 (별 모양 멤브레인)

**구조:**
- 8개 꼭지점 (0°, 45°, 90°, ..., 315°)
- 8개 골짜기 (22.5°, 67.5°, ..., 337.5°)

**꼭지점 위치 (현재 코드):**
```typescript
const baseRx = rx / 1.2;  // = 100
const baseRy = ry / 1.2;  // = 66.67

// 수평 방향 (0°, 180°)
const tipMultiplier = 2.12;
const tipRx = baseRx * 2.12 = 212
const tipRy = baseRy * 2.12 = 141.33

// 기타 방향
const tipMultiplier = 1.8;
const tipRx = baseRx * 1.8 = 180
const tipRy = baseRy * 1.8 = 120
```

**골짜기 깊이 (현재 코드):**
```typescript
// 방향별 차등 오목도
const valleyMultiplier = 0.781 - 0.109 * horizontalComponent;

// 결과값:
// - 수평 골짜기 (22.5°, 337.5°): 0.672 (더 깊음)
// - 수직 골짜기 (67.5°, 112.5°, 202.5°, 247.5°): 0.781 (덜 깊음)
// - 대각선 골짜기: ~0.727 (중간)

const valleyRx = baseRx * valleyMultiplier;
const valleyRy = baseRy * valleyMultiplier;
```

**막 색상 (2레이어 합성):**

레이어 1 - 수평 그라디언트 (`starMembraneHorizontal`):
```typescript
좌측(0%):   #FF4B3A, opacity 0.9  // 뜨거운 빨강
좌중(25%):  #FF7043, opacity 0.85
중앙(50%):  #F6C453, opacity 0.75 // 노랑
우중(75%):  #FF7043, opacity 0.85
우측(100%): #FF4B3A, opacity 0.9
```

레이어 2 - 수직 그라디언트 (`starMembraneVertical`):
```typescript
상단(0%):   #46B5E5, opacity 0.6  // 차가운 파랑
상중(25%):  #2F82D0, opacity 0.5
중앙(50%):  #F6C453, opacity 0.3
하중(75%):  #2F82D0, opacity 0.5
하단(100%): #46B5E5, opacity 0.6
```

합성:
```typescript
레이어 1: opacity={1.0}
레이어 2: opacity={0.7}, style={{ mixBlendMode: 'multiply' }}
```

### 3.3 앵커 (8개 고정점)

**위치 (현재 코드):**
```typescript
// 수평 앵커 (0°, 180°)
const anchorRxHorizontal = baseRx * 3.9 = 390
const anchorRyHorizontal = baseRy * 3.9 = 260

// 기타 앵커
const anchorRxBase = baseRx * 2.8 = 280
const anchorRyBase = baseRy * 2.8 = 186.67
```

**시각적 특성:**
- 핀 샤프트: strokeOpacity 0.5
- 핀 헤드: fillOpacity 0.6, strokeOpacity 0.7
- 핀 하이라이트: opacity 0.3
- 연결선: strokeOpacity 0.4

### 3.4 장력 벡터 (8개 화살표)

**통일된 스타일 (현재 코드):**
```typescript
const arrowColor = "#ff5a3c";      // 살짝 어두운 레드-오렌지
const arrowThickness = 1.4;        // 선 두께
const arrowOpacity = 0.8;          // 전체 불투명도
const arrowHeadLength = 12;        // 화살촉 길이
const arrowHeadWidth = 8;          // 화살촉 너비
```

**화살표 위치:**
- 시작점: 톤필드 경계 + 3px
- 끝점: 막 꼭지점 - 5px

---

## 4. 물리적 의미 및 시각화 원칙

### 4.1 이방성 장력 분포
- **수평(좌우)**: 단축 방향 → 강한 장력 → 빨강-주황 계열, 깊은 골짜기
- **수직(상하)**: 장축 방향 → 약한 장력 → 파랑-청록 계열, 얕은 골짜기
- **차이 정도**: 5-15% 미세한 변화 (과장 없음)

### 4.2 시각 채널 역할 분담
- **화살표**: 방향만 표시 (모든 방향 동일 스타일)
- **막 색상**: 장력 분포 차이 표현
- **막 형상**: 장력 크기 차이 표현 (골짜기 깊이)
- **톤필드 내부**: 외부 장력 영향 미세 반영

---

## 5. 애니메이션 목표 및 요구사항

### 5.1 프레임 구조
- **총 12프레임**: 막이 점진적으로 당겨지는 과정
- **프레임 1**: 초기 상태 (장력 최소)
- **프레임 2-11**: 중간 단계
- **프레임 12**: 완전 장력 상태 (현재 구현)

### 5.2 제안된 애니메이션 파라미터 체계

프레임 12 기준 파라미터:
```
anchorOffset:       100     // 앵커가 최대로 바깥으로 이동한 상태(px 기준)
concavityStrength:  1.00    // 오목함 100% (최대 변형)
stretchRatio:       1.150   // 막이 15% 늘어난 상태
membraneTint:       1.00    // 장력 색상 강도 최대로 표시
membraneOpacity:    0.90    // 막 거의 불투명 — 장력 최대
arrowOpacity:       1.00    // 화살표 완전 표시
arrowLength:        80.0    // 화살표 최장 (당기는 힘 100%)
arrowWidth:         4.0     // 화살표 두께 최대
boundaryScale:      1.00    // 외곽 8각형 변형 100%
tensionGradient:    1.10    // 내부 그라디언트 강도 최대
```

---

## 6. 리팩토링 요구사항

### 6.1 필수 조건
1. **프레임 12 시각 유지**: 현재 완성된 이미지를 정확히 재현
2. **파라미터화**: 위 10개 파라미터로 모든 시각 요소 제어 가능
3. **독립 렌더링**: 각 프레임을 개별적으로 렌더링 가능
4. **React 호환**: 기존 컴포넌트 구조 유지

### 6.2 기술적 과제

**과제 1: 파라미터 매핑 불일치**
- 제안된 파라미터 vs 현재 코드 구조 차이
- 예: `anchorOffset` (픽셀) vs 현재 배율 기반 계산
- 예: `arrowWidth: 4.0` vs 현재 `1.4`

**과제 2: 복합 계산의 단순화**
- 현재: 방향별 개별 계산 (수평/수직/대각선)
- 목표: 단일 파라미터로 모든 방향 비례 조정

**과제 3: 그라디언트 강도 제어**
- 현재: 고정된 색상 정의
- 목표: `membraneTint`, `tensionGradient`로 동적 조절

### 6.3 예상 Props 구조

```typescript
type AnimationFrameProps = {
  // 기존 props
  width?: number;
  height?: number;
  color?: string;
  showLegend?: boolean;

  // 애니메이션 제어 props
  frameParams?: {
    anchorOffset: number;       // 0-100: 앵커 거리
    concavityStrength: number;  // 0-1.0: 골짜기 깊이
    stretchRatio: number;       // 1.0-1.15: 막 늘어남 정도
    membraneTint: number;       // 0-1.0: 색상 강도
    membraneOpacity: number;    // 0-1.0: 막 불투명도
    arrowOpacity: number;       // 0-1.0: 화살표 불투명도
    arrowLength: number;        // 0-100: 화살표 길이
    arrowWidth: number;         // 0.5-4.0: 화살표 두께
    boundaryScale: number;      // 0.8-1.0: 톤필드 크기
    tensionGradient: number;    // 0.8-1.1: 그라디언트 강도
  };
};
```

---

## 7. 기술 스택

- **프레임워크**: Next.js 15.2.4, React
- **언어**: TypeScript
- **렌더링**: SVG (순수 SVG, 외부 라이브러리 없음)
- **스타일링**: Tailwind CSS

---

## 8. 질문 사항

### 8.1 파라미터 해석
1. `concavityStrength: 1.00`이 현재 골짜기 깊이(0.672/0.781)를 의미하는가?
   - 아니면 별도 스케일 팩터로 작용하는가?

2. `anchorOffset: 100`의 단위와 기준점은?
   - 픽셀 절대값인가, 배율인가?
   - 0일 때 앵커가 어디에 위치하는가?

3. `stretchRatio: 1.150`은 어느 부분의 15% 늘어남을 의미하는가?
   - 전체 막 크기인가, 꼭지점 거리인가?

### 8.2 구현 방식
1. 12개 프레임을 어떻게 렌더링하는가?
   - 옵션 A: 12개 컴포넌트 인스턴스에 각각 다른 props
   - 옵션 B: 단일 컴포넌트를 12번 호출하여 12개 이미지 생성
   - 옵션 C: 서버사이드에서 12개 이미지 사전 생성

2. 파라미터 값의 보간(interpolation) 방식은?
   - 선형 보간인가?
   - 이징(easing) 함수 적용인가?

### 8.3 시각 정확도
1. 프레임 1-11에서 물리적 의미를 유지해야 하는가?
   - 예: 수평/수직 장력 비율이 항상 일정해야 하는가?
   - 아니면 단순히 시각적 전환만 중요한가?

---

## 9. 참고 자료

### 9.1 코드 파일
- `components/TonefieldTensionDiagram.tsx`: 메인 컴포넌트 (1779줄)
- `components/FAQDetail.tsx`: 사용 예시 (라인 3297-3304, 3353-3364)

### 9.2 커밋 히스토리
최근 주요 커밋:
- `b8d7fe8`: 화살표 통일 및 시각화 역할 분담 최적화
- `fd7fe53`: 톤필드 다이어그램 이방성 장력 분포 구현
- `c59f119`: 톤필드 다이어그램 최종 개선 및 문서화 v2.1

### 9.3 물리적 배경
- 핸드팬 톤필드: 2:3 타원 비율
- 이방성 장력: 단축 방향이 장축보다 5-15% 강함
- FEA(Finite Element Analysis) 기반 색상 매핑

---

## 10. 제출물 요청

### 10.1 리팩토링 제안서
1. 파라미터 체계의 정확한 정의
2. 현재 코드 값 → 파라미터 값 매핑 테이블
3. 프레임 1-12의 파라미터 값 시퀀스
4. 구현 방법 (코드 구조 제안)

### 10.2 기술 문서
1. 각 파라미터의 물리적/시각적 의미
2. 파라미터 간 상호작용 및 제약사항
3. 프레임 12 재현 검증 방법

### 10.3 샘플 코드 (옵션)
1. 리팩토링된 컴포넌트 Props 타입 정의
2. 파라미터 → 내부 계산값 변환 함수
3. 12개 프레임 렌더링 예시 코드

---

## 부록: 현재 코드 주요 섹션

### A. 골짜기 깊이 계산 (라인 963-978)
```typescript
const valleyAngles = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];
const valleyPoints = valleyAngles.map(deg => {
  const rad = deg * Math.PI / 180;
  const horizontalComponent = Math.abs(Math.cos(rad));
  // 좌우(수평): 0.672 (더 깊게), 상하(수직): 0.781 (덜 깊게)
  const valleyMultiplier = 0.781 - 0.109 * horizontalComponent;
  const valleyRx = baseRx * valleyMultiplier;
  const valleyRy = baseRy * valleyMultiplier;

  return {
    angle: deg,
    x: cx + valleyRx * Math.cos(rad),
    y: adjustedCy + valleyRy * Math.sin(rad)
  };
});
```

### B. 막 꼭지점 계산 (라인 940-961)
```typescript
const starAngles = [0, 45, 90, 135, 180, 225, 270, 315];
const starPoints = starAngles.map(deg => {
  const rad = deg * Math.PI / 180;
  const isHorizontal = (deg === 0 || deg === 180);
  const baseRx = rx / 1.2;
  const baseRy = ry / 1.2;

  // 좌우측 꼭지점은 더 바깥쪽
  const tipMultiplier = isHorizontal ? 2.12 : 1.8;
  const tipRx = baseRx * tipMultiplier;
  const tipRy = baseRy * tipMultiplier;

  return {
    angle: deg,
    x: cx + tipRx * Math.cos(rad),
    y: adjustedCy + tipRy * Math.sin(rad)
  };
});
```

### C. 앵커 위치 계산 (라인 923-938)
```typescript
const anchorAngles = [0, 45, 90, 135, 180, 225, 270, 315];
const anchorRxBase = baseRx * 2.8;
const anchorRyBase = baseRy * 2.8;
const anchorRxHorizontal = baseRx * 3.9;
const anchorRyHorizontal = baseRy * 3.9;

const anchorPoints = anchorAngles.map(deg => {
  const rad = deg * Math.PI / 180;
  const isHorizontal = (deg === 0 || deg === 180);
  const anchorRx = isHorizontal ? anchorRxHorizontal : anchorRxBase;
  const anchorRy = isHorizontal ? anchorRyHorizontal : anchorRyBase;

  return {
    angle: deg,
    x: cx + anchorRx * Math.cos(rad),
    y: adjustedCy + anchorRy * Math.sin(rad)
  };
});
```

### D. 화살표 렌더링 (라인 1466-1562)
```typescript
const starAngles = [0, 45, 90, 135, 180, 225, 270, 315];
const arrowColor = "#ff5a3c";
const arrowThickness = 1.4;
const arrowOpacity = 0.8;

return starAngles.map((deg, i) => {
  const rad = deg * Math.PI / 180;
  const isHorizontal = (deg === 0 || deg === 180);
  const baseRx = rx / 1.2;
  const baseRy = ry / 1.2;
  const tipMultiplier = isHorizontal ? 2.12 : 1.8;
  const tipRx = baseRx * tipMultiplier;
  const tipRy = baseRy * tipMultiplier;

  const startX = cx + (rx + 3) * Math.cos(rad);
  const startY = adjustedCy + (ry + 3) * Math.sin(rad);
  const endX = cx + (tipRx - 5) * Math.cos(rad);
  const endY = adjustedCy + (tipRy - 5) * Math.sin(rad);

  // ... 화살표 렌더링
});
```

---

**문서 버전**: 1.0
**작성일**: 2025-11-16
**프로젝트**: 핸드팬 FAQ 톤필드 장력 다이어그램
**목적**: 12프레임 애니메이션 리팩토링 외주 의뢰
