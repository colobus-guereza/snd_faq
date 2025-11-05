# FAQ 사이트

자주 묻는 질문 FAQ 사이트입니다.

## 기술 스택

- Next.js 16.0.1 (App Router)
- TypeScript
- Tailwind CSS v4
- Fuse.js (검색 기능)

## 주요 기능

- 검색 기능 (Fuse.js 기반)
- 카테고리별 필터링
- FAQ 상세 페이지
- 반응형 디자인

## 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 배포

이 프로젝트는 Vercel에 배포되어 있습니다.

### Vercel 배포 방법

1. [Vercel](https://vercel.com)에 가입하고 로그인
2. "Add New Project" 클릭
3. GitHub 리포지토리 연결
4. 프로젝트 설정 확인:
   - Framework Preset: Next.js (자동 감지)
   - Build Command: `npm run build` (기본값)
   - Output Directory: `.next` (기본값)
5. "Deploy" 클릭

배포가 완료되면 자동으로 URL이 생성됩니다.

## 프로젝트 구조

```
app/
  ├── page.tsx          # 메인 FAQ 리스트 페이지
  ├── faq/[id]/
  │   ├── layout.tsx   # FAQ 상세 페이지 레이아웃
  │   └── page.tsx     # FAQ 상세 페이지
components/
  ├── Header.tsx       # 헤더 컴포넌트
  ├── SearchBar.tsx    # 검색바 컴포넌트
  ├── CategoryMenu.tsx # 카테고리 메뉴 컴포넌트
  ├── FAQList.tsx      # FAQ 리스트 컴포넌트
  └── FAQDetail.tsx    # FAQ 상세 컴포넌트
data/
  └── faqs.ts          # FAQ 데이터
types/
  └── faq.ts           # FAQ 타입 정의
```

## 라이선스

MIT