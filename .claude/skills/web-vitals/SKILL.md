---
name: web-vitals
description: Optimize Core Web Vitals (LCP, INP, CLS) and general site performance — image optimization, font loading, render-blocking resources, lazy loading, preconnect/preload, code splitting. Use when user mentions 성능, 속도, web vitals, lighthouse, LCP, INP, CLS, 사이트 빠르게.
---

# Core Web Vitals & Performance

Google 랭킹과 사용자 이탈에 직접 영향. 목표:
- **LCP** (Largest Contentful Paint) < 2.5s
- **INP** (Interaction to Next Paint) < 200ms
- **CLS** (Cumulative Layout Shift) < 0.1

## 체크리스트

### 1. LCP 개선 (가장 큰 콘텐츠 빠르게)
- Hero 이미지에 `fetchpriority="high"` 추가
- `<link rel="preload" as="image" href="...">` for hero
- 이미지 WebP/AVIF 포맷, `<picture>`로 폴백
- 이미지 명시적 `width`/`height` (CLS도 막음)
- CDN 사용 (Cloudflare, Vercel, Cloudfront)

### 2. CLS 제거 (레이아웃 흔들림)
- 모든 `<img>`, `<video>`, `<iframe>`에 `width`/`height` 또는 `aspect-ratio`
- 웹폰트 `font-display: swap` + `size-adjust`
- 동적 삽입 광고/배너에 고정 슬롯 미리 확보

### 3. INP 개선 (반응성)
- 메인 스레드 블로킹 JS 제거 / 분할
- `<script defer>` 또는 `async` 사용
- 큰 이벤트 핸들러를 `requestIdleCallback` / `setTimeout`으로 분할
- 서드파티 스크립트는 `<script async>` + 가능하면 facade 패턴

### 4. 폰트
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="/fonts/Pretendard.woff2" as="font" type="font/woff2" crossorigin>
```
CSS에서:
```css
@font-face {
  font-family: 'Pretendard';
  src: url('/fonts/Pretendard.woff2') format('woff2');
  font-display: swap;
}
```

### 5. 이미지 lazy loading
- 첫 화면 밖 이미지: `loading="lazy" decoding="async"`
- 첫 화면(hero): `loading="eager" fetchpriority="high"`

### 6. 캐싱 / 압축
- `Cache-Control: public, max-age=31536000, immutable` for hashed assets
- HTML은 `Cache-Control: no-cache` 또는 짧게
- Brotli/gzip 압축 활성화
- HTTP/2 또는 HTTP/3

### 7. JS 다이어트
- 사용 안 하는 라이브러리 제거
- Tree-shaking (`import { x } from 'pkg'`)
- 중요 페이지에서 무거운 분석 스크립트 지연 로드

## 측정

사용자에게 안내:
- https://pagespeed.web.dev — Lighthouse + 실제 Field Data
- Chrome DevTools → Performance / Lighthouse 패널
- `web-vitals` npm 패키지로 실제 RUM 수집

## 실행 순서

1. 현재 HTML/CSS/JS 읽기
2. 위 카테고리별 위반 사항 식별
3. 위반 위치를 `file_path:line` 으로 지목
4. 각 항목에 대해 구체적 코드 수정 제시 (또는 직접 적용 후 확인)
5. 측정 결과 비교를 위해 Before/After Lighthouse 점수 안내
