---
name: web-vitals
description: Core Web Vitals (LCP/INP/CLS) 및 사이트 성능 최적화. 이미지·폰트·블로킹 리소스·캐시·Cloudflare Pages 헤더·HTTP/3. Use when user mentions 성능, 속도, 사이트 빠르게, web vitals, lighthouse, LCP, INP, CLS, 페이지스피드.
---

# Core Web Vitals & 성능 최적화

Google 랭킹 + 사용자 이탈에 직접 영향. 목표:
- **LCP** (Largest Contentful Paint) < **2.5s**
- **INP** (Interaction to Next Paint) < **200ms**
- **CLS** (Cumulative Layout Shift) < **0.1**

이 프로젝트는 정적 사이트 + Cloudflare Pages 호스팅이라 기본 점수가 매우 높음. 새로 컴포넌트 추가 시 다음 체크리스트로 회귀 방지.

## 1. LCP 개선 (가장 큰 콘텐츠 빠르게)

이 프로젝트의 LCP 후보: hero `<h1>` 또는 OG 이미지가 본문에 임베드된 경우.

- Hero 이미지에 `fetchpriority="high"` + `<link rel="preload" as="image">`
- 폰트는 `font-display: swap` (텍스트 LCP면 차단 X)
- 이미지: WebP/AVIF + `<picture>` 폴백, `width`/`height` 명시
- HTML 자체를 가볍게 (현재 12KB, 이상적)
- CSS·JS 인라이닝 OR preload (현재 `<link rel="preload" href="/style.css" as="style">` 적용됨)

## 2. CLS 제거 (레이아웃 흔들림)

이 프로젝트는 `position:fixed .floating-call`이 항상 80px 차지 — `body { padding-bottom: calc(80px + safe-area) }` 로 막아둠 (`style.css:18`).

- 모든 `<img>`, `<video>`, `<iframe>`에 `width`/`height` 또는 CSS `aspect-ratio`
- 웹폰트 `font-display: swap` + `size-adjust` (FOIT 방지)
- 동적 광고/배너에 고정 슬롯 미리 확보
- `:focus` 변화로 레이아웃 안 흔들리게 (`outline-offset` 사용)

## 3. INP 개선 (반응성)

- `<script defer>` 또는 `async` 사용 (현재 `main.js`는 defer)
- 큰 이벤트 핸들러 → `requestIdleCallback` / `queueMicrotask` 분할
- `addEventListener('click', ...)`을 이벤트 위임 (이 프로젝트의 `main.js` 패턴)
- 서드파티 스크립트는 facade 패턴 (예: GA는 idle 후)

## 4. 폰트 (이 프로젝트는 시스템 폰트 우선)

CSS:
```css
font-family: -apple-system, BlinkMacSystemFont, 'Pretendard', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
```
시스템 폰트 우선 → 외부 폰트 다운로드 0 → LCP 빠름.

웹폰트가 꼭 필요하면:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="/fonts/Pretendard-Black.woff2" as="font" type="font/woff2" crossorigin>
```
```css
@font-face {
  font-family: 'Pretendard';
  src: url('/fonts/Pretendard-Black.woff2') format('woff2');
  font-display: swap;
  font-weight: 900;
}
```

## 5. 이미지 lazy loading

- 첫 화면 안: `loading="eager" fetchpriority="high"`
- 첫 화면 밖: `loading="lazy" decoding="async"`
- og.png는 본문에 안 들어가므로 미리보기용으로만 (lazy 무관)

## 6. Cloudflare Pages 캐시 정책 (`_headers`)

이 프로젝트의 `_headers` 핵심:
```
/                       Cache-Control: public, max-age=0, must-revalidate
/index.html             Cache-Control: public, max-age=0, must-revalidate
/style.css              Cache-Control: public, max-age=604800, immutable
/main.js                Cache-Control: public, max-age=604800, immutable
/og.png                 Cache-Control: public, max-age=604800, immutable
/favicon.ico            Cache-Control: public, max-age=604800, immutable
/sitemap.xml            Cache-Control: public, max-age=3600
/robots.txt             Cache-Control: public, max-age=3600
/llms.txt               Cache-Control: public, max-age=3600
```
- HTML 무캐시 → 콘텐츠 변경 즉시 반영
- 정적 1주 immutable → 재방문 빠름
- 크롤러 파일 1시간 → 검색엔진 빠른 재인식

**주의**: CF Pages는 `_headers` 규칙을 *append*만 하고 *replace* 안 함. 그래서 `/*`에는 보안 헤더만, Cache-Control은 경로별로 명시.

## 7. JS 다이어트

이 프로젝트 `main.js`는 662 bytes. 추가할 때 주의:
- 사용 안 하는 라이브러리 제거
- Tree-shaking (`import { x } from 'pkg'`)
- 분석 스크립트 (GA 등)는 `requestIdleCallback`으로 idle 후 로드

## 8. HTTP/3 + Brotli

Cloudflare는 자동. 별도 설정 X. 다른 호스팅이면:
- HTTP/2 또는 HTTP/3
- Brotli 압축 (gzip보다 ~20% 작음)

## 측정 도구

- **PageSpeed Insights**: https://pagespeed.web.dev/?url=https://seven1-2jn.pages.dev/
- **Lighthouse** (Chrome DevTools)
- **WebPageTest**: https://www.webpagetest.org/
- **Cloudflare Web Analytics** (이미 활성화돼 있다면)

## 🚦 자동 실행 흐름

1. `index.html`, `style.css`, `main.js`, `_headers` 읽기
2. 위 8개 카테고리 점검 → `file_path:line`으로 위반 지목
3. 수정 적용 후 푸시 → CF Pages 자동 배포
4. PageSpeed Insights 점수 확인 (사용자 안내)
5. 회귀 방지를 위해 측정 결과 메모

## 🧠 함정

- **CSS 인라인 vs 외부**: 4KB 미만이면 인라이닝이 빠를 수 있음. 현재는 외부 + preload 조합
- **CF Pages는 자동 minify** 옵션 켜면 더 작아짐 (대시보드에서 활성화)
- **Cloudflare Web Analytics 스크립트**가 INP를 약간 까먹을 수 있음 → 필요한 경우만 활성화
