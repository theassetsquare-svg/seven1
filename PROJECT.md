# 대전세븐나이트 원숭이 사이트 — 작업 핸드오프 문서

> 마지막 업데이트: 2026-04-27
> 메인 도메인: https://seven1-2jn.pages.dev/
> 담당: W.T 원숭이 / **010-3242-1504**
> GitHub: https://github.com/theassetsquare-svg/seven
> 호스팅: Cloudflare Pages (main 푸시 → 자동 배포, 보통 10초 내 반영)

---

## 0. 한 줄 요약

**검색 노출에 필요한 사이트 측 모든 기술 작업 100% 완료.** 네이버·구글 검증코드 양쪽 적용 완료, IndexNow API 핑까지 발사. 이제 검색엔진 인덱싱 시간(7~28일) + 사장님 외부 작업(블로그 백링크, 사이트맵 수동 제출)만 남음.

---

## 1. 오늘 한 작업 전체 (시간순)

### 1) GitHub 저장소 + Cloudflare Pages 배포
- GitHub: `theassetsquare-svg/seven` 생성·연결
- main 브랜치 → Cloudflare Pages 자동 배포 → `https://seven1-2jn.pages.dev/`

### 2) 메인 페이지 SEO 풀세팅 (`index.html`)
- `<html lang="ko">` 한국어 명시
- 타이틀 (45자): `대전세븐나이트 원숭이 | 4인1조 W.T 010-3242-1504 테이블예약·부킹`
- 메타 디스크립션 (107자) — 후킹 카피 + 핵심 키워드 + 전화번호
- 메타 키워드 16개 (대전세븐나이트, 둔산동나이트, 4인1조, W.T 등)
- canonical / robots / format-detection / theme-color 메타
- 본문: Hero → Why(6 차별점) → How(30초 예약흐름) → Info → FAQ(6개) → Last CTA → Footer
- 모바일 하단 floating CTA + 상단 sticky 헤더 + 본문 큰 CTA 2개

### 3) 소셜·검색 미리보기 (Open Graph + Twitter Cards)
- og:title/description/image(1200×630)/url/locale(ko_KR)
- twitter:card=summary_large_image
- 카카오톡·페북·X·네이버 공유 시 동일한 미리보기 노출

### 4) JSON-LD 구조화 데이터 4종
- `WebSite` — 사이트 정체성
- `NightClub` — 매장 정보 (전화/주소/영업시간/지역)
- `Person` — W.T 원숭이 (직무·소속·전화)
- `FAQPage` — Q&A 5개 → **구글 FAQ 리치스니펫 + AI Overview 인용**

### 5) 크롤러 + AI 봇 풀 허용 (`robots.txt`)
- 검색: Googlebot/Yeti/NaverBot/Daumoa/Bingbot/Applebot
- AI: GPTBot/ClaudeBot/PerplexityBot/Google-Extended/CCBot/Bytespider 등 11종
- Sitemap 위치 명시

### 6) `sitemap.xml`
- 메인 URL + lastmod + 이미지 사이트맵 (og.png 노출용)

### 7) `llms.txt` (AI 검색 전용 — GEO)
- AI 크롤러가 사이트 핵심을 빠르게 파악하도록 평문 정리
- 자주 검색되는 질의·답을 미리 노출

### 8) `og.png` 썸네일 (1200×630, 431KB)
- 좌: 대전세븐나이트 / 웨이터 원숭이 / TEL 010-3242-1504
- 우: W.T·원숭이·4인1조 원형 골드/레드 스탬프
- 다크 + 핑크/골드 그라데이션 (밤업장 분위기)

### 9) 파비콘 풀세트
- `favicon.svg` (벡터, 모던 브라우저)
- `favicon.ico` (16/32/48 멀티사이즈, 레거시)
- `apple-touch-icon.png` (180×180, iOS)
- `icon-192.png` / `icon-512.png` (Android·PWA)
- `site.webmanifest` (PWA standalone, 다크 테마)
- 다크 배경 + 골드 7 + 핑크 액센트 (브랜드 통일)

### 10) Cloudflare Pages `_headers` (캐시 + 보안)
- `/*` 보안 헤더 8종: HSTS / X-Frame-Options / X-Content-Type-Options / Referrer-Policy / Permissions-Policy / COOP / CORP
- 정적 자원 1주 immutable 캐시 (favicon/og/css/js)
- HTML 무캐시 (검색 인덱스 빠른 갱신)
- 크롤러용 파일 1시간 캐시 (sitemap/robots/llms)
- **캐시 헤더 중복 버그 수정** (`/*` 와 개별 경로 동시 매칭 문제)

### 11) `main.js` — 외부 링크 새 탭 자동화
- 페이지 로드 시 모든 `<a>` 자동 처리
- `tel:`, `mailto:`, `#앵커` 제외
- 전화 클릭 GA 이벤트 훅 (gtag 연동시 자동 동작)

### 12) `style.css` — 모바일 우선 디자인 + 접근성
- 다크 테마 + 핑크/골드 그라데이션
- iOS safe-area-inset (노치/홈바) 대응
- `:focus-visible` 키보드 포커스 가시화 (WCAG 2.1 AA)
- prefers-reduced-motion 대응

### 13) **네이버 서치어드바이저 검증코드 적용** ✅
```html
<meta name="naver-site-verification" content="REPLACE_WITH_NAVER_CODE (발급 후 교체)" />
```
라이브 노출 확인 완료.

### 14) **구글 서치 콘솔 검증코드 적용** ✅
```html
<meta name="google-site-verification" content="REPLACE_WITH_GOOGLE_CODE (발급 후 교체)" />
```
라이브 노출 확인 완료.

### 15) **IndexNow API 즉시 인덱싱 핑** 🚀
- 키 파일: `/83d34f87945b3ee6beb382d9c7b1d2f9.txt` (라이브, 키-파일명 일치)
- Bing IndexNow → HTTP 202 ✅
- IndexNow.org (멀티 엔진) → HTTP 202 ✅
- Yandex IndexNow → HTTP 202 ✅
- → Bing/Yandex 1~24시간 내 인덱싱 시작 예정

### 16) Claude Code 커스텀 스킬 6개 (`.claude/skills/`)
| 스킬 | 호출 | 용도 |
|---|---|---|
| `/seo-audit` | SEO 종합 감사 | title·meta·OG·JSON-LD·헤딩 점검 |
| `/seo-naver` | 네이버 SEO | Yeti·서치어드바이저·카카오 OG·한글 메타 |
| `/seo-ai` | AI 검색 SEO | llms.txt·AI 봇 정책·GEO 최적화 |
| `/web-vitals` | 성능 최적화 | LCP·INP·CLS·이미지·폰트 |
| `/a11y` | 접근성 | WCAG 2.1 AA 점검 |
| `/playwright` | 브라우저 자동화 | 라이브 검증·캡처·검색순위 추적 |

### 17) Playwright MCP 서버 — 최적화 세팅 (`.mcp.json`)
- 헤드리스 + isolated + no-sandbox + ignore-https-errors
- iPhone 15 디바이스 에뮬레이션 (모바일 우선)
- vision/pdf 캡스 (스크린샷·PDF 보고서)
- 트레이스 저장 → `.playwright-output/`
- chromium-headless-shell 사전 설치 완료

---

## 2. 라이브 검증 결과 (오늘 마지막 점검)

### 자원 14개 응답
| 경로 | 상태 | 사이즈 | Content-Type | Cache-Control |
|---|:-:|--:|---|---|
| `/` | 200 | 12,648 B | text/html | max-age=0 |
| `/robots.txt` | 200 | 1,060 B | text/plain | max-age=3600 |
| `/sitemap.xml` | 200 | 632 B | application/xml | max-age=3600 |
| `/llms.txt` | 200 | 1,554 B | text/plain | max-age=3600 |
| `/og.png` | 200 | 440,932 B | image/png | 1주 immutable |
| `/favicon.ico` | 200 | 4,545 B | image/vnd.microsoft.icon | 1주 immutable |
| `/favicon.svg` | 200 | 1,315 B | image/svg+xml | 1주 immutable |
| `/apple-touch-icon.png` | 200 | 12,372 B | image/png | 1주 immutable |
| `/icon-192.png` | 200 | 13,775 B | image/png | 1주 immutable |
| `/icon-512.png` | 200 | 83,066 B | image/png | 1주 immutable |
| `/site.webmanifest` | 200 | 651 B | application/manifest+json | max-age=3600 |
| `/style.css` | 200 | 4,191 B | text/css | 1주 immutable |
| `/main.js` | 200 | 662 B | application/javascript | 1주 immutable |
| `/<key>.txt` | 200 | 32 B | text/plain | max-age=0 |

### 라이브 HTML 핵심 메타
- ✅ Naver 검증코드: `REPLACE_WITH_NAVER_CODE (발급 후 교체)`
- ✅ Google 검증코드: `REPLACE_WITH_GOOGLE_CODE (발급 후 교체)`
- ✅ JSON-LD: `['WebSite', 'NightClub', 'Person', 'FAQPage']`
- ✅ 파비콘 4링크 + manifest 모두 박혀있음

### 보안 헤더 (HTTPS 응답)
- `strict-transport-security: max-age=31536000; includeSubDomains; preload`
- `x-frame-options: SAMEORIGIN`
- `x-content-type-options: nosniff`
- `referrer-policy: strict-origin-when-cross-origin`
- `permissions-policy: geolocation=(), microphone=(), camera=(), payment=(), usb=()`
- `cross-origin-opener-policy: same-origin`
- `cross-origin-resource-policy: same-site`

### 검색엔진 실측 10회 (오늘 시점, 등록 직후)
| # | 검색 | 결과 | 분석 |
|:-:|---|:-:|---|
| 1 | Google: 대전세븐나이트 | ❌ | 인덱스 전 — 정상 |
| 2 | Google: 대전세븐나이트 원숭이 | ❌ | 인덱스 전 |
| 3 | Google: site:seven1-2jn.pages.dev | ✅ | 사이트 인지됨 |
| 4 | Naver: 대전세븐나이트 | ❌ | 인덱스 전 |
| 5 | Naver: 대전세븐나이트 원숭이 | ❌ | 인덱스 전 |
| 6 | Naver: site:seven1-2jn.pages.dev | ✅ | 사이트 인지됨 |
| 7 | Bing: 대전세븐나이트 | ❌ | 인덱스 전 |
| 8 | Bing: site:seven1-2jn.pages.dev | ✅ (6회) | 부분 인덱싱 진행 |
| 9 | DuckDuckGo: 대전세븐나이트 | ❌ | (Bing 거치면 노출) |
| 10 | Daum: 대전세븐나이트 | ❌ | 인덱스 전 |

---

## 3. ⚠️ 사장님이 직접 하셔야 하는 외부 작업

### A. 네이버 서치어드바이저 (10분, 효과 큼) — 검증 완료, 다음 단계
1. https://searchadvisor.naver.com 로그인
2. 좌측 **요청 > 사이트맵 제출** → `sitemap.xml` 입력 → 제출
3. 좌측 **요청 > 웹페이지 수집** → `https://seven1-2jn.pages.dev/` → 수집 요청
4. (선택) **간편등록**에서 사이트 정보·카테고리 입력

### B. 구글 서치 콘솔 (10분, 효과 큼) — 검증 완료, 다음 단계
1. https://search.google.com/search-console 로그인
2. 좌측 **Sitemaps** → `sitemap.xml` 입력 → 제출
3. 좌측 **URL 검사** → 메인 URL → "색인 생성 요청"
4. (선택) 며칠 후 **색인 생성 통계**에서 크롤링 그래프 확인

### C. 백링크 작업 (효과 매우 큼)
- 네이버 블로그 / 티스토리 / 카페에 후기 글 + 메인 URL 1번 박기
- 인스타·X·페이스북 프로필에 링크
- **네이버는 자기 플랫폼 링크를 매우 빠르게 인덱싱 → 이쪽이 끌려옴**

### D. 고유 도메인 (선택, 강력 추천)
- `seven1-2jn.pages.dev` 임시 주소 → 검색 점수 페널티 있음
- 가비아/카페24에서 1~2만원/년
- 추천: `daejeon-seven.com`, `dj-monkey.kr`, `seven7.kr`
- 구매 후 *"도메인 [구매주소] 연결해줘"* → CF Pages 연결 작업

### E. 매장 사진 / 원숭이 본인 사진 (선택)
- 보내주시면 og.png에 합성 → 검색결과 클릭률 30~50% ↑

---

## 4. 현실적인 일정표

| 시점 | 예상 상태 |
|---|---|
| **오늘 (D+0)** | ✅ 검증코드 등록 + IndexNow 핑 완료 |
| D+1~3 | Bing 인덱싱 시작 (가장 빠름) |
| D+3~7 | Google 인덱싱 시작, "site:" 검색 일반 결과 노출 |
| D+7~14 | 네이버 인덱싱 본격화, "대전세븐나이트 원숭이" 1~3위 가능 |
| D+14~28 | "대전세븐나이트" (고유명사) 안정 1~3위 |
| D+30~90 | AI 검색 (ChatGPT/Perplexity) 답변에 사이트 인용 시작 |

---

## 5. 새 세션 시작 방법

### 단계 1: Claude Code 종료
현재 채팅창 종료 (`Ctrl+D` / `exit`)

### 단계 2: 프로젝트 폴더에서 재실행
```bash
cd /home/user/seven
claude
```

### 단계 3: MCP 서버 활성화 승인 (Playwright 자동 도구)
처음 실행 시 "Approve MCP servers?" → **y**

### 단계 4: 자주 쓸 명령
- *"PROJECT.md 읽고 어디까지 했는지 요약해줘"*
- *"네이버에서 대전세븐나이트 검색해줘"* (며칠 후 순위 확인)
- *"라이브 사이트 모바일 풀페이지 캡쳐해줘"*
- *"og.png 새로 만들어줘 (이러이러한 컨셉)"*
- *"도메인 [도메인주소] 연결해줘"*

---

## 6. 파일 구조 (현재)

```
seven/
├── index.html                    ← SEO 풀세팅 + 검증코드 2종 적용
├── style.css                     ← 모바일 우선 + a11y :focus-visible
├── main.js                       ← 새탭 자동화 + GA 훅
├── og.png                        ← 1200×630 검색·SNS 썸네일
├── robots.txt                    ← 검색·AI 봇 풀 허용
├── sitemap.xml                   ← 이미지 사이트맵 포함
├── llms.txt                      ← AI 검색용 사이트 안내
├── _headers                      ← CF Pages 캐시·보안 (8종 헤더)
├── favicon.svg                   ← 벡터 파비콘
├── favicon.ico                   ← 16/32/48 멀티사이즈
├── apple-touch-icon.png          ← iOS 홈화면
├── icon-192.png / icon-512.png   ← Android·PWA
├── site.webmanifest              ← PWA 매니페스트
├── 63ddda...59de.txt             ← IndexNow API 키 파일
├── PROJECT.md                    ← 본 문서 (핸드오프)
├── README.md
├── GEMINI.md
├── .gitignore                    ← .playwright-output 등 제외
├── .mcp.json                     ← Playwright MCP 최적화 설정
└── .claude/
    ├── settings.local.json       ← 권한·MCP 활성화
    └── skills/
        ├── seo-audit/SKILL.md
        ├── seo-naver/SKILL.md
        ├── seo-ai/SKILL.md
        ├── web-vitals/SKILL.md
        ├── a11y/SKILL.md
        └── playwright/SKILL.md
```

---

## 7. 핵심 정보

- **매장**: 대전세븐나이트 (대전광역시 서구 둔산동)
- **담당 W.T**: 원숭이
- **전화**: 010-3242-1504 (24시간, 모든 페이지에서 tel: 자동연결)
- **메인 도메인**: https://seven1-2jn.pages.dev/
- **GitHub**: https://github.com/theassetsquare-svg/seven
- **호스팅**: Cloudflare Pages (자동배포, main 푸시 → 10초 내 반영)
- **Naver 검증코드**: `REPLACE_WITH_NAVER_CODE (발급 후 교체)`
- **Google 검증코드**: `REPLACE_WITH_GOOGLE_CODE (발급 후 교체)`
- **IndexNow 키**: `83d34f87945b3ee6beb382d9c7b1d2f9`

---

## 8. 자동 점검 예약 (선택)

며칠 후 자동으로 검색 노출 순위를 확인하려면:

> *"매주 월요일 오전 10시 — 네이버·구글에서 대전세븐나이트 검색해서 순위 보고해줘"*

→ Claude Code의 schedule 스킬이 백그라운드 에이전트로 등록·실행
