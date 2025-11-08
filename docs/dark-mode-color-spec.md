# 다크모드 색상 설정 가이드

이 문서는 FAQ 앱에서 사용되는 다크모드 색상 설정값을 상세히 정리한 것입니다.

## 1. 기본 배경 및 텍스트 색상

### CSS 변수 (globals.css)
```css
:root {
  --background: #ffffff;      /* 라이트 모드 배경 */
  --foreground: #171717;     /* 라이트 모드 텍스트 */
}

.dark {
  --background: #171717;      /* 다크 모드 배경 */
  --foreground: #ffffff;     /* 다크 모드 텍스트 */
}
```

### Tailwind CSS 클래스
- **배경색**: `bg-white` → `dark:bg-gray-900` (#111827)
- **텍스트색**: `text-gray-900` → `dark:text-gray-100` (#F3F4F6)

## 2. Gray 색상 팔레트 (Tailwind CSS 기본값)

다크모드에서 사용되는 Gray 색상 값:

| 클래스 | 라이트 모드 | 다크 모드 | HEX 값 (다크) | 용도 |
|--------|------------|----------|---------------|------|
| `gray-50` | #F9FAFB | - | - | 라이트 모드 배경 |
| `gray-100` | #F3F4F6 | `dark:bg-gray-800` | #1F2937 | 호버 배경, 활성 상태 |
| `gray-200` | #E5E7EB | `dark:border-gray-800` | #1F2937 | 테두리 |
| `gray-300` | #D1D5DB | `dark:text-gray-700` | #374151 | 보조 텍스트 |
| `gray-400` | #9CA3AF | `dark:text-gray-400` | #9CA3AF | 아이콘, 보조 텍스트 |
| `gray-500` | #6B7280 | `dark:text-gray-500` | #6B7280 | 플레이스홀더 |
| `gray-600` | #4B5563 | `dark:text-gray-600` | #4B5563 | 구분선 |
| `gray-700` | #374151 | `dark:border-gray-700` | #374151 | 테두리, 보조 텍스트 |
| `gray-800` | #1F2937 | `dark:bg-gray-800` | #1F2937 | 호버 배경, 카드 배경 |
| `gray-900` | #111827 | `dark:bg-gray-900` | #111827 | 메인 배경 |

## 3. 컴포넌트별 색상 매핑

### 3.1 Header (헤더)
```tsx
// 배경
bg-white dark:bg-gray-900

// 테두리
border-gray-200 dark:border-gray-800

// 텍스트
text-gray-700 dark:text-gray-300        // 기본 텍스트
text-gray-900 dark:text-gray-100        // 강조 텍스트
text-gray-400 dark:text-gray-600        // 구분선 (/)

// 호버
hover:bg-gray-100 dark:hover:bg-gray-800
```

### 3.2 SearchBar (검색바)
```tsx
// 배경
bg-white dark:bg-gray-900

// 테두리
border-gray-300 dark:border-gray-700
focus:border-blue-500 dark:focus:border-[#14B8A6]

// 텍스트
text-gray-900 dark:text-gray-100
placeholder-gray-400 dark:placeholder-gray-500

// 아이콘
text-gray-400 dark:text-gray-500
```

### 3.3 FAQList (질문 목록)
```tsx
// 호버 배경
hover:bg-gray-50 dark:hover:bg-gray-800

// 텍스트
text-gray-900 dark:text-gray-100

// 호버 텍스트 색상
hover:text-blue-600 dark:hover:text-[#14B8A6]
```

### 3.4 CategoryMenu (카테고리 메뉴)
```tsx
// 호버 배경
group-hover:bg-gray-50 dark:group-hover:bg-gray-800

// 텍스트
text-gray-700 dark:text-gray-300        // 기본
text-[#14B8A6]                          // 활성화 (동일)
group-hover:text-[#14B8A6] dark:group-hover:text-[#14B8A6]  // 호버

// 공유 아이콘
text-gray-600 dark:text-gray-400
hover:text-gray-900 dark:hover:text-gray-100
```

### 3.5 FAQDetail (질문 상세)
```tsx
// 카드 배경
bg-white dark:bg-gray-900

// 테두리
border-gray-200 dark:border-gray-800

// 제목
text-gray-900 dark:text-gray-100

// 본문 텍스트
text-gray-700 dark:text-gray-300

// 보조 텍스트
text-gray-600 dark:text-gray-400

// 태그 배경
bg-gray-100 dark:bg-gray-800
text-gray-700 dark:text-gray-300

// 뒤로가기 버튼
text-gray-600 dark:text-gray-400
hover:text-gray-900 dark:hover:text-gray-100
hover:bg-gray-100 dark:hover:bg-gray-800

// 공유 버튼
text-gray-600 dark:text-gray-400
hover:text-gray-900 dark:hover:text-gray-100
hover:bg-gray-100 dark:hover:bg-gray-800
```

### 3.6 Chart (차트 영역)
```tsx
// 배경
bg-white dark:bg-gray-900

// 테두리
border-gray-200 dark:border-gray-800

// 제목
text-gray-900 dark:text-gray-100

// Y축 라벨
text-gray-600 dark:text-gray-400

// 그리드 라인
text-gray-300 dark:text-gray-700

// 범례 텍스트
text-gray-700 dark:text-gray-300

// 파라미터 설명 텍스트
text-gray-600 dark:text-gray-400
```

### 3.7 CategorySelectorMobile (모바일 카테고리 선택)
```tsx
// 모달 배경
bg-white dark:bg-gray-900

// 테두리
border-gray-200 dark:border-gray-800

// 텍스트
text-gray-900 dark:text-gray-100        // 제목
text-gray-700 dark:text-gray-300        // 기본 카테고리
text-gray-500 dark:text-gray-400        // 닫기 버튼

// 호버
hover:bg-gray-50 dark:hover:bg-gray-800
hover:text-[#14B8A6] dark:hover:text-[#14B8A6]
```

### 3.8 InquiryForm (문의 폼)
```tsx
// 폼 배경
bg-gray-50 dark:bg-gray-800

// 테두리
border-gray-200 dark:border-gray-700

// 입력 필드 배경
bg-white dark:bg-gray-900

// 입력 필드 테두리
border-gray-300 dark:border-gray-600

// 라벨 텍스트
text-gray-700 dark:text-gray-300

// 입력 텍스트
text-gray-900 dark:text-gray-100

// 성공 메시지
bg-green-50 dark:bg-green-900/20
border-green-200 dark:border-green-800
text-green-700 dark:text-green-300

// 에러 메시지
bg-red-50 dark:bg-red-900/20
border-red-200 dark:border-red-800
text-red-700 dark:text-red-300
```

## 4. 브랜드 컬러 (Accent Color)

### Primary Color
- **색상**: `#14B8A6` (Teal/Cyan)
- **다크 모드**: 동일 색상 사용
- **용도**: 
  - 활성화된 카테고리
  - 호버 상태
  - 포커스 상태
  - 링크 색상
  - 강조 요소

### 사용 예시
```tsx
// 활성화된 카테고리
text-[#14B8A6]

// 호버
hover:text-[#14B8A6]
dark:hover:text-[#14B8A6]

// 포커스
focus:border-[#14B8A6]
dark:focus:border-[#14B8A6]

// 버튼 배경
bg-[#14B8A6]
hover:bg-[#0d9488]
```

## 5. 전환 효과 (Transitions)

모든 색상 변경에 부드러운 전환 효과 적용:

```css
transition: background-color 0.2s ease, color 0.2s ease;
```

또는 Tailwind 클래스:
```tsx
transition-colors
transition-all duration-200
```

## 6. 다크모드 활성화 방법

### CSS 클래스 기반
```css
.dark {
  /* 다크 모드 스타일 */
}
```

### Tailwind CSS 사용법
```tsx
className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
```

## 7. 색상 대비 비율 (접근성)

다크모드에서 텍스트 가독성을 위한 대비 비율:

- **주요 텍스트**: `text-gray-900` → `dark:text-gray-100` (최대 대비)
- **보조 텍스트**: `text-gray-700` → `dark:text-gray-300` (충분한 대비)
- **비활성 텍스트**: `text-gray-400` → `dark:text-gray-400` (최소 대비)

## 8. 다른 서비스에 적용하기

### 8.1 Tailwind CSS 설정 (tailwind.config.js)
```js
module.exports = {
  darkMode: 'class', // 또는 'media'
  theme: {
    extend: {
      colors: {
        // 브랜드 컬러 추가
        brand: {
          DEFAULT: '#14B8A6',
          dark: '#0d9488',
        },
      },
    },
  },
}
```

### 8.2 CSS 변수 설정 (globals.css)
```css
:root {
  --background: #ffffff;
  --foreground: #171717;
}

.dark {
  --background: #171717;
  --foreground: #ffffff;
}
```

### 8.3 컴포넌트 색상 매핑
위의 "3. 컴포넌트별 색상 매핑" 섹션을 참고하여 동일한 패턴으로 적용하세요.

## 9. 체크리스트

다른 서비스에 적용할 때 확인할 사항:

- [ ] `dark:` 접두사가 모든 색상 클래스에 적용되었는가?
- [ ] 배경색: `bg-white` → `dark:bg-gray-900`
- [ ] 텍스트색: `text-gray-900` → `dark:text-gray-100`
- [ ] 테두리: `border-gray-200` → `dark:border-gray-800`
- [ ] 호버 상태: `hover:bg-gray-50` → `dark:hover:bg-gray-800`
- [ ] 브랜드 컬러 `#14B8A6`가 다크모드에서도 동일하게 적용되는가?
- [ ] 전환 효과(`transition-colors`)가 적용되었는가?
- [ ] 접근성을 위한 충분한 색상 대비가 확보되었는가?

