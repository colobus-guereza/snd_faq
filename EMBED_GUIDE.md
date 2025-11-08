# 외부 웹사이트 임베드 가이드

현재 FAQ 웹페이지를 외부 호스팅 웹사이트의 게시판 편집 페이지에 임베드하는 방법입니다.

## 방법 1: iframe 방식 (가장 간단, 권장)

### 배포 후 사용

1. **Next.js 애플리케이션을 배포** (Vercel, Netlify 등)
2. 배포된 URL을 사용하여 iframe 코드 생성

### HTML 코드

```html
<!-- 기본 iframe (고정 높이) -->
<iframe 
  src="https://your-faq-site.vercel.app" 
  width="100%" 
  height="800" 
  frameborder="0"
  scrolling="auto"
  style="border: none; min-height: 800px;">
</iframe>
```

### 반응형 iframe (자동 높이 조절)

```html
<!-- 컨테이너 div -->
<div style="position: relative; width: 100%; padding-bottom: 100%; height: 0; overflow: hidden;">
  <iframe 
    src="https://your-faq-site.vercel.app" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
    frameborder="0"
    scrolling="auto"
    allowfullscreen>
  </iframe>
</div>
```

### 고정 높이 iframe (권장)

```html
<iframe 
  src="https://your-faq-site.vercel.app" 
  width="100%" 
  height="1200" 
  frameborder="0"
  scrolling="yes"
  style="border: 1px solid #e5e7eb; border-radius: 8px; min-height: 1200px;">
</iframe>
```

### 특정 카테고리만 표시

```html
<!-- 특정 카테고리로 이동 -->
<iframe 
  src="https://your-faq-site.vercel.app/?category=문의" 
  width="100%" 
  height="1000" 
  frameborder="0"
  scrolling="auto"
  style="border: none;">
</iframe>
```

### 특정 질문만 표시

```html
<!-- 특정 FAQ 상세 페이지 -->
<iframe 
  src="https://your-faq-site.vercel.app/faq/7" 
  width="100%" 
  height="800" 
  frameborder="0"
  scrolling="auto"
  style="border: none;">
</iframe>
```

---

## 방법 2: JavaScript Widget 방식 (더 유연함)

### 1단계: Widget 컴포넌트 생성

`components/FAQWidget.tsx` 파일 생성 (별도로 제공 가능)

### 2단계: 빌드 및 호스팅

- FAQ 위젯을 별도로 빌드하여 CDN에 호스팅
- 또는 현재 사이트의 `/widget.js` 경로로 제공

### 3단계: 외부 사이트에 추가

```html
<!-- 위젯 컨테이너 -->
<div id="faq-widget-container"></div>

<!-- 위젯 스크립트 로드 -->
<script src="https://your-faq-site.vercel.app/widget.js"></script>
<script>
  // 위젯 초기화
  FAQWidget.init({
    containerId: 'faq-widget-container',
    defaultCategory: '문의', // 선택사항
    height: 'auto' // 또는 고정 높이 '800px'
  });
</script>
```

---

## 방법 3: 정적 HTML 추출 (완전한 제어)

### 1단계: 정적 사이트로 빌드

```bash
# next.config.ts에 output: 'export' 추가 필요
npm run build
```

### 2단계: 빌드된 파일 추출

`out/` 폴더의 HTML/CSS/JS 파일을 추출하여 호스팅

### 3단계: HTML 코드에 직접 삽입

```html
<!-- CSS 파일 링크 -->
<link rel="stylesheet" href="https://your-cdn.com/_next/static/css/...">

<!-- HTML 내용 -->
<div id="faq-app">
  <!-- 빌드된 HTML 내용 -->
</div>

<!-- JavaScript 파일 -->
<script src="https://your-cdn.com/_next/static/chunks/..."></script>
```

**주의**: 이 방법은 Next.js의 동적 기능(라우팅 등)이 제한될 수 있습니다.

---

## 권장 방법: iframe 사용

### 장점
- ✅ 가장 간단하고 빠르게 적용 가능
- ✅ 완전히 독립적인 환경 (스타일 충돌 없음)
- ✅ 업데이트 시 자동 반영
- ✅ 보안 격리

### 단점
- ⚠️ 높이 조절이 필요할 수 있음
- ⚠️ 모바일 반응형 고려 필요

### 최적화된 iframe 코드

```html
<!-- 반응형 iframe (모바일 대응) -->
<div style="width: 100%; max-width: 1200px; margin: 0 auto;">
  <div style="position: relative; padding-bottom: 150%; height: 0; overflow: hidden;">
    <iframe 
      src="https://your-faq-site.vercel.app" 
      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
      frameborder="0"
      scrolling="yes"
      allowfullscreen
      loading="lazy">
    </iframe>
  </div>
</div>

<!-- 또는 고정 높이 (더 간단) -->
<iframe 
  src="https://your-faq-site.vercel.app" 
  width="100%" 
  height="1200" 
  frameborder="0"
  scrolling="yes"
  style="border: none; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
  allowfullscreen>
</iframe>
```

---

## 보안 고려사항

### X-Frame-Options 헤더 설정

Next.js에서 iframe 임베드를 허용하려면 `next.config.ts`에 추가:

```typescript
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', // 또는 'ALLOWALL' (보안상 권장하지 않음)
          },
        ],
      },
    ];
  },
};
```

또는 특정 도메인만 허용:

```typescript
{
  key: 'Content-Security-Policy',
  value: "frame-ancestors 'self' https://your-external-site.com",
}
```

---

## 사용 예시

### 예시 1: 전체 FAQ 페이지 임베드

```html
<iframe 
  src="https://your-faq-site.vercel.app" 
  width="100%" 
  height="1200" 
  frameborder="0"
  scrolling="yes"
  style="border: none; border-radius: 8px;">
</iframe>
```

### 예시 2: 문의 카테고리만 임베드

```html
<iframe 
  src="https://your-faq-site.vercel.app/?category=문의" 
  width="100%" 
  height="1000" 
  frameborder="0"
  scrolling="yes"
  style="border: none;">
</iframe>
```

### 예시 3: 특정 질문만 임베드

```html
<iframe 
  src="https://your-faq-site.vercel.app/faq/7" 
  width="100%" 
  height="800" 
  frameborder="0"
  scrolling="yes"
  style="border: none;">
</iframe>
```

---

## 다음 단계

1. **Next.js 애플리케이션 배포**
   - Vercel: https://vercel.com
   - Netlify: https://netlify.com
   - 기타 호스팅 서비스

2. **배포 URL 확인**
   - 예: `https://faq-site.vercel.app`

3. **위의 iframe 코드에서 URL 교체**
   - `https://your-faq-site.vercel.app` → 실제 배포 URL

4. **게시판 편집 페이지에 HTML 코드 붙여넣기**

---

## 문제 해결

### iframe이 표시되지 않는 경우
- X-Frame-Options 헤더 확인
- HTTPS 사용 확인
- 브라우저 콘솔에서 오류 확인

### 높이가 맞지 않는 경우
- `height` 값을 조정
- `scrolling="yes"` 추가
- 반응형 컨테이너 div 사용

### 모바일에서 레이아웃이 깨지는 경우
- `width="100%"` 사용
- `max-width` 설정
- 반응형 iframe 코드 사용

