---
name: seo-naver
description: Optimize the site for Naver search (네이버 검색 상위노출). Covers Naver Search Advisor 사이트 소유확인 메타, Naver-friendly sitemap, KakaoTalk/Naver OG previews, Korean meta, and Naver-specific bot rules. Use when user mentions 네이버, Naver, 네이버 SEO, 서치어드바이저, or targets Korean search.
---

# Naver SEO (네이버 검색 최적화)

Naver는 Google과 다르게 동작합니다. 자체 웹 크롤러(Yeti)를 쓰고, Search Advisor 등록과 메타 검증이 핵심입니다.

## 필수 작업

### 1. 네이버 서치어드바이저 등록 준비
사용자에게 https://searchadvisor.naver.com 에서 사이트 등록 후 발급받은 검증 코드를 받아야 합니다. 받은 코드를 `<head>`에 넣습니다.

```html
<meta name="naver-site-verification" content="<발급받은_코드>" />
```

구글도 함께:
```html
<meta name="google-site-verification" content="<발급받은_코드>" />
```

### 2. `<html lang="ko">` 필수
네이버는 한국어 콘텐츠를 우선 인덱싱합니다.

### 3. robots.txt — Yeti 명시 허용
```
User-agent: *
Allow: /

User-agent: Yeti
Allow: /

Sitemap: https://<domain>/sitemap.xml
```

### 4. sitemap.xml — Naver는 lastmod 중요
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2026-04-27</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

서치어드바이저에서 sitemap 수동 제출까지 안내하세요.

### 5. RSS 피드 (콘텐츠 사이트인 경우)
네이버는 RSS도 수집합니다. 블로그/뉴스 형태면 `/rss.xml` 추가 후 서치어드바이저에 제출.

### 6. 카카오톡/네이버 미리보기 OG
국내 공유는 카카오톡이 압도적이고, 카카오는 OG 태그를 그대로 씁니다.
```html
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="https://.../og.png">  <!-- 1200x630, 5MB 이하 -->
<meta property="og:url" content="...">
<meta property="og:type" content="website">
<meta property="og:locale" content="ko_KR">
<meta property="og:site_name" content="...">
```

### 7. 한글 메타 작성 팁
- `<title>`: 핵심 키워드를 앞쪽에, 25자 내외 (네이버 검색결과는 짧게 잘림)
- `<meta name="description">`: 80자 내외, 검색 의도에 맞는 키워드 포함
- `<meta name="keywords">`: 네이버는 아직 약하게 참고함. 5~10개만 (스팸 금지)

### 8. 콘텐츠 가이드
- 본문 1000자 이상 권장
- h1 → h2 → h3 구조
- 이미지 `alt` 한국어로 설명
- 내부링크 풍부하게 (네이버는 사이트 내 링크 구조 중시)

## 실행 순서

1. `index.html`의 `<head>` 확인
2. 위 항목별 누락 점검
3. 누락 항목을 코드로 직접 추가 (사용자 검증 코드는 placeholder로 두고 사용자에게 받기)
4. `robots.txt`, `sitemap.xml`이 없으면 root에 생성
5. 사용자에게 서치어드바이저 등록 절차 안내

## 사용자에게 안내할 외부 작업
- https://searchadvisor.naver.com 가입 및 사이트 등록
- 사이트 소유 확인 (메타태그 방식 권장)
- sitemap.xml 수동 제출
- 웹마스터 도구에서 수집 요청
