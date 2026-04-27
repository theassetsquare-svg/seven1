---
name: seo-ai
description: AI 검색 노출 최적화 (GEO — Generative Engine Optimization). llms.txt, JSON-LD @graph, FAQPage, AI 크롤러 robots, 인용 친화적 콘텐츠 구조. Targets ChatGPT search, Claude, Perplexity, Gemini, Google AI Overviews, Bing Copilot. Use when user mentions AI 검색, GEO, llms.txt, AI 노출, ChatGPT 검색, Perplexity, AI Overviews, "AI에서 검색되게".
---

# AI Search Optimization (GEO)

전통 SEO와 달리 AI는 페이지를 **인용 가능한 사실 단위**로 파싱하고 답변에 인용. 핵심:
1. AI 크롤러 명시 허용 (robots)
2. 사이트 안내문서 (`llms.txt`)
3. 구조화된 JSON-LD `@graph` (사실 추출 신호)
4. 직접적 답변 형식 본문 (역피라미드)

## 1. AI 크롤러 robots.txt 정책

이 프로젝트는 **풀 허용** (노출이 목표). robots.txt에 명시:
```
User-agent: GPTBot          # ChatGPT 크롤러
Allow: /
User-agent: OAI-SearchBot   # ChatGPT 검색
Allow: /
User-agent: ChatGPT-User    # ChatGPT 사용자 트리거 fetch
Allow: /
User-agent: ClaudeBot       # Claude 크롤러
Allow: /
User-agent: Claude-Web
Allow: /
User-agent: anthropic-ai
Allow: /
User-agent: PerplexityBot   # Perplexity 크롤러
Allow: /
User-agent: Perplexity-User # Perplexity 사용자 트리거
Allow: /
User-agent: Google-Extended # Gemini / AI Overviews
Allow: /
User-agent: CCBot           # Common Crawl (다수 LLM 학습)
Allow: /
User-agent: Applebot-Extended # Apple Intelligence
Allow: /
User-agent: Bytespider      # ByteDance / Doubao
Allow: /
User-agent: Amazonbot       # Amazon AI
Allow: /
User-agent: cohere-ai
Allow: /
User-agent: Meta-ExternalAgent  # Meta AI
Allow: /
```
차단할 거면 `Disallow: /`. 사용자에게 의도 확인.

## 2. `llms.txt` — AI를 위한 사이트 안내

루트에 `llms.txt`. 이 프로젝트 표준 구조:
```markdown
# <사이트 한 줄 이름>

> <한 문장 핵심 요약 — AI가 인용할 가능성이 가장 높은 문장>

<2~3 문장 컨텍스트 (만 19세 이상 / 합법 주점 / 지역)>

## 핵심 정보
- 매장명: ...
- 담당: ...
- 전화: ...
- 위치: ...
- 영업시간: ...
- 서비스: ...
- 누적 후기: ...건, 평점 ...
- 예약 수수료: ...

## 차별 포인트
- 5~6개 bullet, 각 항목 구체 수치 포함

## 자주 검색되는 질의에 대한 답
- "검색어1" → 답
- "검색어2" → 답
... (5~7개)

## 핵심 페이지
- [메인](URL): 한 줄 설명

## 연락 우선순위
1. 전화 (가장 빠름)
2. 문자
3. 카카오톡
```

**AI는 `>` blockquote 한 줄을 가장 자주 인용**. 이 한 줄에 매장명·서비스·전화·차별점 모두 압축.

## 3. JSON-LD `@graph` — AI가 가장 신뢰

`@graph`로 묶어서 한 `<script>`에 다 넣기. 한국 로컬 비즈니스 표준:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", "@id": "URL#website", ... },
    {
      "@type": "NightClub",         // 또는 Restaurant, BarOrPub, LocalBusiness
      "@id": "URL#business",
      "name": "...",
      "alternateName": ["변형1", "변형2"],  // 검색 변형 다 포함
      "telephone": "+82-10-...",
      "address": { "@type": "PostalAddress", ... },
      "geo": { "@type": "GeoCoordinates", "latitude": ..., "longitude": ... },
      "areaServed": ["...", "..."],
      "openingHoursSpecification": [...],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",       // 본문과 일치
        "reviewCount": "247"        // 본문과 일치
      },
      "employee": { "@id": "URL#person" }
    },
    {
      "@type": "Person",
      "@id": "URL#person",
      "name": "...",
      "jobTitle": "...",
      "worksFor": { "@id": "URL#business" },
      "knowsAbout": ["...", "..."]  // 전문 영역
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "Q?", "acceptedAnswer": {"@type":"Answer","text":"A"} }
        // 5~7개
      ]
    },
    {
      "@type": "Review",
      "itemReviewed": { "@id": "URL#business" },
      "reviewRating": { "@type": "Rating", "ratingValue": "5" },
      "author": { "@type": "Person", "name": "..." },
      "reviewBody": "..."
    }
  ]
}
```

**핵심**: AI는 `@graph` 안의 모든 객체를 그래프로 연결해 인식. `@id` 참조로 NightClub ↔ Person ↔ Review 연결 필수.

## 4. AI 인용 친화적 본문

AI는 **명확한 답을 1~2 문장에 담은** 콘텐츠를 픽업.

### ✅ Do
- H2를 질문형으로: "왜 X가 1순위인가?", "이 시간에 전화하면 어떻게?"
- 첫 문장에 직접 답변 (역피라미드)
- 숫자·날짜·이름 명시 ("247건", "평균 3분", "둔산동 풀타임 7년")
- 출처/저자/발행일 메타 (E-E-A-T 신호)
- TL;DR 박스 페이지 상단

### ❌ Don't
- "...에 대해 알아봅시다" 같은 서론
- 답을 4~5 문단 뒤에 묻기
- 모호한 형용사 ("최고의", "탁월한") 단독 사용

## 5. 사실 인용 가능성 ↑

- `<time datetime="2026-04-27">2026년 4월 27일</time>`
- `<cite>` 태그로 인용·후기 명시
- Person + sameAs로 저자 외부 검증 가능
- 위키피디아·공식 출처 외부 링크 (AI가 cross-check 가능)

## 🚦 자동 실행 흐름

1. 사이트 종류 확인 (로컬/제품/콘텐츠) → schema 결정
2. `robots.txt`에 AI 크롤러 22종 허용 확인
3. `llms.txt` 작성 또는 갱신 (위 표준 구조)
4. `index.html` JSON-LD `@graph` 풀세트 확인
5. 본문 H2 질문형 + 첫 문장 답변형 점검
6. 푸시 후 `indexnow` 스킬로 핑 (Bing이 일부 AI 학습 데이터 공급)

## 🧠 함정

- **JSON-LD `aggregateRating` 본문 불일치** → AI Overviews에서 신뢰도 ↓
- **llms.txt 누락** → 인용 정확도 ↓ (AI가 본문 파싱하다 헛 사실 만들 수 있음)
- **AI가 정보 인용해도 클릭은 안 옴** — 직접 트래픽보다 **브랜드 노출**이 목표
- **할루시네이션 방지** → 사실 단위 명확하게 (날짜·수치·고유명사 검증)
