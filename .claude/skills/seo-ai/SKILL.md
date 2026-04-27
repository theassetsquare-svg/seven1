---
name: seo-ai
description: Optimize the site for AI search engines and LLM-driven discovery (ChatGPT search, Perplexity, Claude, Gemini, Google AI Overviews). Covers llms.txt, schema.org JSON-LD for AI parsing, FAQPage/HowTo/Article schema, citation-friendly content structure, and AI crawler robots rules. Use when user mentions AI 검색, GEO, llms.txt, AI 노출, ChatGPT 검색, Perplexity, AI Overviews.
---

# AI Search Optimization (GEO — Generative Engine Optimization)

전통 SEO와 다르게 AI는 페이지를 **인용 가능한 사실 단위**로 파싱합니다. 핵심은 (1) 구조화된 데이터, (2) 명확한 답변 형식, (3) AI 크롤러 허용.

## 1. `llms.txt` — AI를 위한 사이트 안내

루트에 `llms.txt`를 둡니다. AI 크롤러가 사이트의 핵심 콘텐츠를 빠르게 이해하도록 도와줍니다.

```
# Site Name

> One-sentence site description.

## Core pages
- [Home](https://example.com/): What the site does
- [Pricing](https://example.com/pricing): Plans and prices
- [Docs](https://example.com/docs): Technical reference

## Optional
- [Blog](https://example.com/blog): Long-form articles
```

전체 콘텐츠를 담은 `llms-full.txt`도 선택적으로 추가.

## 2. AI 크롤러 robots.txt 정책

AI에 콘텐츠가 노출되길 원하면 명시 허용:
```
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /
```

차단하려면 `Disallow: /`로 바꾸세요. 사용자에게 의도를 확인하세요.

## 3. JSON-LD schema.org — AI가 가장 신뢰하는 신호

`<head>`에 `<script type="application/ld+json">`로 추가. 페이지 종류별:

### Organization (모든 사이트)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "...",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "sameAs": ["https://twitter.com/...", "https://github.com/..."]
}
```

### WebSite + SearchAction (검색창 있는 사이트)
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://example.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://example.com/search?q={query}",
    "query-input": "required name=query"
  }
}
```

### Article / BlogPosting (콘텐츠)
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "author": {"@type": "Person", "name": "..."},
  "datePublished": "2026-04-27",
  "dateModified": "2026-04-27",
  "image": "https://.../cover.jpg"
}
```

### FAQPage (Q&A 콘텐츠 → AI Overview에 그대로 인용됨)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "질문?",
    "acceptedAnswer": {"@type": "Answer", "text": "답변 본문"}
  }]
}
```

### HowTo, Product, Recipe, Event — 해당 시 추가

## 4. 콘텐츠 작성 — AI 인용 친화적 구조

AI는 **명확한 답을 한 문단에 담은** 콘텐츠를 인용합니다.
- 각 섹션을 질문 형태의 H2로 시작 (`## What is X?`)
- 첫 1~2 문장에 직접적인 답을 담기 (역피라미드)
- 숫자/통계/날짜는 가능한 한 인용 (AI가 사실로 픽업)
- 출처/저자/발행일 명시 → E-E-A-T 강화
- TL;DR / Summary 박스를 페이지 상단에

## 5. 사실 인용 가능성 높이기
- `<time datetime="2026-04-27">` 태그 사용
- 저자 페이지 + sameAs 링크
- 위키피디아/공식 출처 외부 링크 (AI가 검증 가능)

## 실행 순서

1. 사이트 종류 확인 (블로그/제품/문서/회사) → 어떤 schema가 맞는지 결정
2. `llms.txt` 생성
3. `robots.txt`에 AI 크롤러 정책 추가
4. `<head>`에 적절한 JSON-LD 삽입
5. 기존 콘텐츠를 AI 인용 형식으로 재구성 제안
6. 사용자에게 의도 확인: "AI에 노출 허용?" "어떤 페이지를 우선 인용시키고 싶은지?"
