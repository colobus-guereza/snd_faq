# WordPress 임베드 방법 (Embed URL 에러 해결)

## 문제
WordPress의 "Embed URL" 기능은 oEmbed를 지원하는 서비스만 작동합니다. 일반 웹사이트는 직접 임베드할 수 없어 "Sorry, this content could not be embedded" 에러가 발생합니다.

## 해결 방법: HTML 블록 사용

### 방법 1: HTML 블록 사용 (가장 간단)

1. **WordPress 편집기에서 블록 추가**
   - 페이지/포스트 편집 화면에서 `+` 버튼 클릭
   - "HTML" 또는 "Custom HTML" 검색 후 선택

2. **아래 코드를 복사하여 붙여넣기**

```html
<iframe 
  src="https://sndfaq.vercel.app/" 
  width="100%" 
  height="1200" 
  frameborder="0"
  scrolling="yes"
  style="border: none; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); min-height: 1200px;"
  allowfullscreen>
</iframe>
```

3. **저장/발행**

### 방법 2: 반응형 iframe (모바일 최적화)

```html
<div style="position: relative; width: 100%; padding-bottom: 150%; height: 0; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
  <iframe 
    src="https://sndfaq.vercel.app/" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
    frameborder="0"
    scrolling="yes"
    allowfullscreen>
  </iframe>
</div>
```

### 방법 3: 특정 카테고리만 표시

```html
<!-- 기술특징 카테고리 -->
<iframe 
  src="https://sndfaq.vercel.app/?category=기술특징" 
  width="100%" 
  height="1200" 
  frameborder="0"
  scrolling="yes"
  style="border: none; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); min-height: 1200px;"
  allowfullscreen>
</iframe>
```

## 단계별 가이드

### Gutenberg 편집기 (WordPress 5.0+)

1. 페이지/포스트 편집 화면 열기
2. `+` 버튼 클릭 (블록 추가)
3. 검색창에 "HTML" 입력
4. "Custom HTML" 블록 선택
5. 위의 iframe 코드 붙여넣기
6. "미리보기" 또는 "업데이트" 클릭

### 클래식 편집기

1. 페이지/포스트 편집 화면 열기
2. "텍스트" 탭 클릭 (HTML 모드)
3. 원하는 위치에 iframe 코드 붙여넣기
4. "시각적" 탭으로 전환하여 확인
5. "업데이트" 클릭

## WordPress에서 iframe이 차단되는 경우

일부 WordPress 테마나 보안 플러그인이 iframe을 차단할 수 있습니다.

### 해결 방법:

1. **보안 플러그인 확인**
   - Wordfence, iThemes Security 등에서 iframe 허용 설정 확인

2. **테마 설정 확인**
   - 테마의 보안 설정에서 iframe 허용

3. **플러그인 사용**
   - "Iframe Shortcode" 플러그인 설치
   - 또는 "Advanced Editor Tools" 플러그인 사용

4. **functions.php에 추가** (고급 사용자)
```php
// iframe 허용
add_filter('wp_kses_allowed_html', 'allow_iframe_in_html', 10, 2);
function allow_iframe_in_html($allowed, $context) {
    if ($context === 'post') {
        $allowed['iframe'] = array(
            'src' => true,
            'width' => true,
            'height' => true,
            'frameborder' => true,
            'scrolling' => true,
            'style' => true,
            'allowfullscreen' => true,
        );
    }
    return $allowed;
}
```

## 높이 조절

필요에 따라 `height` 값을 조절하세요:
- 짧은 페이지: `height="800"`
- 중간 페이지: `height="1200"` (기본값)
- 긴 페이지: `height="1600"` 또는 `height="2000"`

## 문제 해결

### iframe이 표시되지 않는 경우
1. HTML 블록이 올바르게 추가되었는지 확인
2. 브라우저 콘솔에서 오류 확인 (F12)
3. 보안 플러그인 설정 확인
4. 테마의 HTML 필터링 설정 확인

### 높이가 맞지 않는 경우
- `scrolling="yes"` 속성이 있는지 확인
- 높이 값을 늘려보기
- 반응형 iframe 코드 사용

### 모바일에서 레이아웃이 깨지는 경우
- 반응형 iframe 코드 사용 (방법 2)
- `width="100%"` 확인

