---
name: seo-audit
description: Full SEO audit for Korean local-business sites — title/meta/canonical, Open Graph (1:1 1200×1200), JSON-LD (NightClub/Person/FAQ/Review/AggregateRating), robots/sitemap/llms.txt, internal linking, keyword coverage. Use when user says SEO 점검, 검색 최적화, 구글 SEO, "사이트 점검", or before pushing to production.
---

# SEO Audit — 풀체크

이 스킬은 **대전세븐나이트 W.T 원숭이 직통 (`seven1-2jn.pages.dev`)** 같은 한국 로컬 비즈니스 사이트를 기준으로 작성되었습니다. 다른 사이트도 동일한 체크리스트로 진행.

## ✅ 8단계 체크리스트

### 1. `<head>` 필수 (한국 사이트 권장 길이 기준)
- `<title>` — **40~60자** (네이버 검색결과 잘림 마지노선), 핵심 키워드 + 전화번호 + 차별 포인트
- `<meta name="description">` — **80~120자** (네이버 SERP 풀 노출), 액션 동사 + 사회적 증거 포함
- `<meta name="keywords">` — 15~20개 키워드 (네이버 약하게 참고)
- `<html lang="ko">` 필수
- `<link rel="canonical" href="https://<domain>/">` (서브도메인·www 충돌 방지)
- `<meta name="theme-color" content="#0a1410">` (모바일 브라우저 UI 통일)

### 2. 검증 메타 (네이버·구글)
```html
<meta name="naver-site-verification" content="..." />
<meta name="google-site-verification" content="..." />
```
- 발급 전이면 `REPLACE_WITH_NAVER_CODE`, `REPLACE_WITH_GOOGLE_CODE` placeholder로 두고 사용자에게 발급 요청

### 3. Open Graph — **1:1 정사각 1200×1200 권장** (이 프로젝트 표준)
```html
<meta property="og:type" content="website" />
<meta property="og:image" content="https://.../og.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="1200" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:alt" content="..." />
<meta property="og:locale" content="ko_KR" />
```
**Why 1:1**: 카카오톡·인스타·네이버 미리보기에서 정사각 크롭 없이 풀 노출. 1200×630 가로형은 모바일 피드에서 작게 보임. → 새로 만들 때는 `og-image` 스킬 호출

### 4. JSON-LD `@graph` 풀세트 — 한국 로컬 비즈니스 표준
- `WebSite` — 사이트 식별
- `NightClub` (또는 LocalBusiness 하위) — 매장 식별 + telephone + address + geo + openingHours + **AggregateRating** (필수, AI Overviews 인용 신호)
- `Person` — W.T(웨이터) 개인 식별 + worksFor → NightClub 연결
- `FAQPage` — 5~7개 질문, 본문 FAQ와 1:1 매칭
- `Review` — 1~3건 (AggregateRating의 reviewCount와 함께)

JSON-LD가 본문과 **불일치**하면 구글 페널티. 평점·후기 수·전화번호 모두 본문과 동일해야 함.

### 5. robots.txt — 검색·AI 봇 22종 풀 허용
- 일반: `User-agent: *` + `Allow: /`
- 한국: `Yeti`, `NaverBot`, `Daumoa`
- 구글: `Googlebot`, `Googlebot-Image`, `Googlebot-Mobile`
- AI: `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `Claude-Web`, `anthropic-ai`, `PerplexityBot`, `Perplexity-User`, `Google-Extended`, `CCBot`, `Applebot`, `Applebot-Extended`, `Bytespider`, `Amazonbot`, `cohere-ai`, `Meta-ExternalAgent`
- 마지막 줄: `Sitemap: https://<domain>/sitemap.xml`

### 6. sitemap.xml — 이미지 사이트맵 포함
```xml
<urlset xmlns="..." xmlns:image="...">
  <url>
    <loc>https://<domain>/</loc>
    <lastmod>YYYY-MM-DD</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>https://<domain>/og.png</image:loc>
      <image:title>...</image:title>
      <image:caption>...</image:caption>
    </image:image>
  </url>
</urlset>
```
**lastmod는 매번 push 시 오늘 날짜로 갱신**.

### 7. llms.txt — AI 검색 대응 (자세한 건 `seo-ai` 스킬)

### 8. 본문 콘텐츠
- 1개 H1, 키워드 포함, 사회적 증거(평점·후기 수·연차) 포함
- H2 5~7개, 검색 의도별로 구획
- 전화 CTA **5~7개** (헤더, hero, 섹션 끝, last-CTA, fixed floating)
- 모든 `<a href="tel:...">`에 `aria-label` 명시
- 본문 1500자 이상 (네이버는 긴 글 선호)
- 키워드 다층 배치: title·H1·H2·본문·alt·meta·JSON-LD 모두

## 🚦 자동 실행 흐름

1. `index.html`, `robots.txt`, `sitemap.xml`, `llms.txt`, `site.webmanifest` 읽기
2. 위 8단계 항목별 누락·불일치 점검
3. 발견 사항 우선순위로 정렬 (HIGH=노출 직격 / MED=강화 / LOW=폴리시)
4. 큰 콘텐츠 변경(타이틀/본문)은 사용자 확인 후 적용
5. 수정 후 `playwright` 스킬로 라이브 재검증

## 📤 Output 포맷

```
## SEO Audit — <domain>

### ✅ Pass (n)
- ...

### ⚠️ Issues
1. [HIGH] og:image 1200×630 → 1200×1200 1:1로 교체 필요 (og-image 스킬)
2. [MED] JSON-LD AggregateRating 누락 → 247건/4.9 추가
3. [LOW] sitemap lastmod 오래됨 → 오늘 날짜로

### 🚀 다음 액션
- 인덱싱 가속: `indexnow` 스킬 호출
- 라이브 검증: `playwright` 스킬 호출
```

## 🧠 흔한 함정

- **JSON-LD와 본문 불일치** → 평점·전화·주소 모두 동일해야 함
- **canonical 빠짐** → http/https, www 유무로 중복 페이지 인식
- **og.png 깨짐 (텍스트 안 보임)** → 한글 폰트 문제 → `og-image` 스킬 참조
- **검증코드 placeholder인 채로 푸시** → 인식만 안 되고 페널티는 없음, 발급 후 즉시 박기
- **여러 H1** → 의외로 흔함, `<h1>` count 1개 확인
