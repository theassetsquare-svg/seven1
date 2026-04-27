---
name: seo-naver
description: Naver 검색 상위노출 최적화 — 서치어드바이저 등록·검증·사이트맵 제출, Yeti/NaverBot robots, 한국어 메타 길이, 카카오톡 OG, 네이버 RSS, 인덱스나우 연동까지. Use when user mentions 네이버, Naver, 네이버 SEO, 서치어드바이저, 네이버 노출, "한국 검색".
---

# Naver SEO — 한국 검색엔진 풀 최적화

네이버는 **자체 크롤러(Yeti) + 자체 검색 알고리즘**. 구글과 다른 점:
- 등록·검증 **수동 필수** (서치어드바이저)
- 사이트맵 **수동 제출**
- C-Rank·D.I.A. 알고리즘 (저자성·체류시간·체험성 평가)
- 카카오톡 미리보기가 사실상 1차 진입점

## 📋 단계별 체크리스트

### 1. 메타 검증 (사용자가 발급 → 박기)
```html
<meta name="naver-site-verification" content="<발급코드>" />
```
발급 위치: https://searchadvisor.naver.com → 사이트 추가 → "HTML 태그" 방식 → 코드 복사

### 2. `<html lang="ko">` 필수
네이버는 한국어 콘텐츠 우선 인덱싱. lang 누락 시 외국 사이트로 분류될 수 있음.

### 3. robots.txt — Yeti·NaverBot·Daumoa 명시
```
User-agent: Yeti
Allow: /

User-agent: NaverBot
Allow: /

User-agent: Daumoa
Allow: /

Sitemap: https://<domain>/sitemap.xml
```

### 4. sitemap.xml — lastmod 매번 갱신
네이버는 **lastmod 기준 재크롤 주기**를 결정. 푸시할 때마다 오늘 날짜로:
```bash
sed -i "s|<lastmod>.*</lastmod>|<lastmod>$(date +%F)</lastmod>|g" sitemap.xml
```

### 5. 한국어 메타 길이 (네이버 SERP 기준)
- `<title>`: **30~40자가 안 잘림 마지노선** (검색결과는 보통 28자에서 ... 처리)
  - 핵심 키워드를 **앞쪽**에
  - 전화번호 끼면 클릭률 ↑
- `<meta description>`: **80~120자**
  - 검색 의도 키워드 + 사회적 증거(후기수/평점/연차) + CTA
- `<meta keywords>`: 15~20개 (네이버는 약하게 참고)

### 6. 카카오톡·네이버 미리보기 OG (1:1 정사각 권장)
국내 공유의 80%+가 카톡·네이버 메신저. OG 이미지가 잘 보여야 클릭률이 폭증.
```html
<meta property="og:image" content="https://.../og.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="1200" />  <!-- 1:1 정사각 -->
<meta property="og:locale" content="ko_KR" />
<meta property="og:site_name" content="..." />
```
- 5MB 이하 (카톡 제한)
- 텍스트는 굵은 한글 폰트(Black Han Sans/Pretendard Black)
- 전화번호·매장명·차별 포인트 명확하게

### 7. 본문 — 네이버 C-Rank·D.I.A. 신호
- **체험성**: "직접 가본", "247건 후기", "평균 매칭 3분" 같은 구체 수치
- **저자성**: `<author>` + Person JSON-LD + sameAs 외부 링크
- **체류시간**: H2 5~7개로 스크롤 길이 확보, FAQ로 페이지 내 클릭(상세보기) 유도
- **이미지 alt 한국어**: `alt="대전세븐나이트 둔산동 야경"` 식

### 8. 외부 작업 안내 (사용자가 직접)
| 단계 | URL | 할 것 |
|---|---|---|
| 사이트 등록 | searchadvisor.naver.com | 사이트 추가 |
| 소유 확인 | (위) | HTML 태그 방식 → 코드 받아오기 |
| 사이트맵 제출 | 등록된 사이트 → 사이트맵 제출 | sitemap.xml URL |
| 수집 요청 | 등록된 사이트 → 웹페이지 수집 | 메인 URL |
| 모바일 친화도 | 도구 → 모바일친화도 | 통과 확인 |

### 9. IndexNow 연동 — 즉시 인덱싱 (네이버는 직접 지원 X지만 Bing→네이버 영향)
별도 `indexnow` 스킬 호출. 푸시 후 자동 핑.

## 🚦 자동 실행 흐름

1. `index.html` `<head>` 점검 → 누락 메타 추가
2. `robots.txt`에 Yeti/NaverBot/Daumoa 확인
3. `sitemap.xml` lastmod 오늘로 갱신
4. og.png 1:1 1200×1200 확인 (아니면 `og-image` 스킬)
5. 사용자에게 서치어드바이저 등록 + 검증코드 요청
6. 검증코드 받으면 `index.html`에 박고 push
7. push 후 `search-console` 스킬로 사이트맵 제출 안내
8. `indexnow` 스킬로 핑 발사

## 🧠 한국 SEO 함정

- **PC와 모바일 검색결과 다름** — 모바일 위주로 최적화 (clientele가 모바일)
- **네이버 블로그·카페 백링크가 도메인 권한보다 강함** — 외부 백링크 작업 필수
- **신규 사이트는 6~12주 정도 "샌드박스"** — 인덱싱돼도 즉시 상위 안 옴
- **동일 매장 다중 사이트** — 콘텐츠 차별화 필수 (`content-diff` 스킬)
