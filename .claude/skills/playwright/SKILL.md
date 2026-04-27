---
name: playwright
description: 실제 브라우저(Playwright MCP)로 라이브 사이트 검증, 스크린샷, SEO 메타·JSON-LD 렌더 확인, 모바일 전화 CTA 테스트, OG 미리보기, 접근성·성능 체크. Targets https://seven1-2jn.pages.dev/. Use when user asks 사이트 확인, 스크린샷, 모바일 미리보기, OG 미리보기, lighthouse, 접속 테스트, 렌더링 확인, playwright, 라이브 검증.
---

# Playwright MCP — 실전 매뉴얼

이 프로젝트는 모바일 우선이라 MCP 기본 디바이스가 **iPhone 15** (393×852, touch)으로 잠겨 있습니다. 데스크톱 검증이 필요하면 `browser_resize`로 런타임 변경.

## 자주 쓰는 절차

### 1. 라이브 사이트 시각 확인
```
browser_navigate → https://seven1-2jn.pages.dev/
browser_wait_for(text="010-3242-1504")
browser_take_screenshot(filename="live-mobile.png", fullPage=true)
```
풀페이지 캡처로 hero → CTA → FAQ → 후기 → 푸터까지 모바일 시점 한 번에 검증.

### 2. 전화 CTA 클릭 자동 연결 검증
```
browser_navigate → URL
browser_snapshot   # accessibility tree로 요소 ref 받기
browser_click(ref="<floating-call ref>")
```
클릭 시 `tel:010-3242-1504` 네비게이션이 떠야 함 (브라우저는 차단하지만 네트워크 로그에서 확인).

### 3. SEO 메타·JSON-LD 렌더 확인 (한 번에)
```
browser_evaluate(function="() => ({
  title: document.title,
  desc: document.querySelector('meta[name=description]')?.content,
  canonical: document.querySelector('link[rel=canonical]')?.href,
  naver: document.querySelector('meta[name=naver-site-verification]')?.content,
  google: document.querySelector('meta[name=google-site-verification]')?.content,
  ogImg: document.querySelector('meta[property=\"og:image\"]')?.content,
  ogW: document.querySelector('meta[property=\"og:image:width\"]')?.content,
  ogH: document.querySelector('meta[property=\"og:image:height\"]')?.content,
  h1: document.querySelector('h1')?.innerText,
  phoneLinks: document.querySelectorAll('a[href^=\"tel:\"]').length,
  faqCount: document.querySelectorAll('.faq details').length,
  reviewCount: document.querySelectorAll('.reviews .rev').length,
  jsonld: [...document.querySelectorAll('script[type=\"application/ld+json\"]')].map(s=>JSON.parse(s.textContent))
})")
```
배포된 HTML에 메타가 다 박혔는지 한 번에 확인.

### 4. OG 미리보기 (카카오톡/페북이 보는 그대로)
```
browser_navigate → https://seven1-2jn.pages.dev/og.png
browser_take_screenshot(filename="og-preview.png")
```
실측 픽셀 확인 (1200×1200 1:1):
```
browser_evaluate(function="() => {
  const img = document.querySelector('img');
  return { w: img.naturalWidth, h: img.naturalHeight, ratio: img.naturalWidth / img.naturalHeight };
}")
```
- 외부 검증: opengraph.xyz, metatags.io 같은 사이트로 이동해 URL 입력해 미리보기 확인

### 5. 데스크톱 뷰
```
browser_resize(width=1280, height=800)
browser_navigate → URL
browser_take_screenshot(fullPage=true)
```

### 6. 검색 노출 추적 (인덱싱 후)
```
browser_navigate → https://www.google.com/search?q=대전세븐나이트
browser_take_screenshot(filename="google-rank.png")
browser_navigate → https://search.naver.com/search.naver?query=대전세븐나이트
browser_take_screenshot(filename="naver-rank.png")
```
순위·미리보기 썸네일이 어떻게 나오는지 시각 검증.

### 7. PDF 보고서 (`vision,pdf` caps 활성화됨)
```
browser_pdf_save(filename="audit.pdf")
```

### 8. 접근성/성능 데이터
- 콘솔: `browser_console_messages` — 에러/경고 수집
- 네트워크: `browser_network_requests` — 느린 리소스, 4xx/5xx 추적
- DOM 평가: `browser_evaluate(...)` 로 LCP 요소·이미지 크기·blocking 스크립트 확인

### 9. 14 자원 풀 검증 (배포 후)
```
const paths = ['/', 'robots.txt', 'sitemap.xml', 'llms.txt', 'site.webmanifest',
               'og.png', 'favicon.svg', 'favicon.ico', 'apple-touch-icon.png',
               'icon-192.png', 'icon-512.png', 'main.js', 'style.css'];
for (const p of paths) {
  browser_navigate → https://seven1-2jn.pages.dev/${p}
  // 200 확인, 콘텐츠 확인
}
```

## 산출물 위치
- 스크린샷·트레이스: `./.playwright-output/` (gitignore)
- 트레이스 분석: `npx playwright show-trace .playwright-output/<id>.zip`

## 헤드리스 크로미움으로 OG 만들 때
**OG 이미지 새로 그리려면 `og-image` 스킬 사용** — Playwright MCP는 *검증용*, OG 생성용 별도 워크플로 있음 (한글 폰트 ~/.fonts 설치 필수).

## 주의
- `--isolated` 모드라 매 세션 쿠키/스토리지 초기화 — 로그인 흐름 테스트 시 `--storage-state` 추가
- `--no-sandbox` 는 컨테이너 환경 호환용 (보안 영향 무시 가능)
- Cloudflare Pages 배포 지연 1~2분 → 푸시 후 기다리고 검증
- 헤드리스 환경에 이모지 폰트 없음 → ☎/📞이 □로 보이는 건 **렌더링 환경 문제**, 실제 사용자 기기는 정상
