---
name: search-console
description: 네이버 서치어드바이저 + 구글 서치 콘솔 등록·검증·사이트맵 제출·색인 요청 풀 흐름. 검증코드 placeholder 박기 → 발급 → 교체 → 제출. Use when user asks 서치어드바이저, 서치콘솔, search console, 검증코드, 사이트 등록, 색인 요청, 사이트맵 제출.
---

# Search Console — 네이버 + 구글 등록 흐름

검색엔진이 사이트를 **인식·색인·랭킹**하려면 등록 필수. 두 곳 모두 사용자가 직접 발급해야 하지만 코드 받으면 자동 박기.

## 1. 코드 placeholder 사전 박기

이 프로젝트의 `index.html`에 이미 placeholder 박혀있음:
```html
<meta name="naver-site-verification" content="REPLACE_WITH_NAVER_CODE" />
<meta name="google-site-verification" content="REPLACE_WITH_GOOGLE_CODE" />
```
사용자가 코드 발급해서 던져주면 sed로 즉시 교체:
```bash
NAVER_CODE='<발급받은 네이버 코드>'
GOOGLE_CODE='<발급받은 구글 코드>'
sed -i "s|REPLACE_WITH_NAVER_CODE|$NAVER_CODE|g" /home/user/seven1/index.html
sed -i "s|REPLACE_WITH_GOOGLE_CODE|$GOOGLE_CODE|g" /home/user/seven1/index.html
git add index.html && git commit -m "검증코드 적용" && git push
```

## 2. 네이버 서치어드바이저 (사용자 직접)

### A. 사이트 등록
1. https://searchadvisor.naver.com 접속 (네이버 로그인)
2. 우측 상단 "사이트 등록" 또는 "웹마스터 도구"
3. URL: `https://seven1-2jn.pages.dev/` 입력
4. 소유 확인 방식: **"HTML 태그"** 선택 (가장 간편)
5. 표시되는 메타 태그에서 `content="..."` 부분 **복사**
6. 클로드한테: *"네이버 검증코드 [붙여넣기] 박아줘"* → 자동 push
7. CF Pages 배포 완료 후 (~2분) 네이버 페이지에서 "확인" 버튼

### B. 사이트맵 제출
사이트 등록 + 검증 완료 후:
1. 좌측 메뉴 → **"요청" → "사이트맵 제출"**
2. URL: `sitemap.xml` 입력 → 확인
3. 상태가 "처리중" → "성공"으로 바뀔 때까지 대기 (보통 1~3일)

### C. 수집 요청
1. 좌측 메뉴 → **"요청" → "웹페이지 수집"**
2. URL: `https://seven1-2jn.pages.dev/` 입력 → 확인
3. 1일 50건 한도

### D. RSS 피드 (선택, 콘텐츠 사이트면)
이 프로젝트는 단일 페이지라 RSS 불필요.

### E. 모바일 친화도
좌측 메뉴 → **"진단" → "모바일 친화도"** → URL 입력 → 자동 검사

## 3. 구글 서치 콘솔 (사용자 직접)

### A. 속성 추가
1. https://search.google.com/search-console 접속 (구글 로그인)
2. 좌측 상단 속성 셀렉터 → "속성 추가"
3. **"URL 접두어"** 선택 (도메인 전체보다 간편)
4. URL: `https://seven1-2jn.pages.dev/` 입력
5. 소유권 확인 방식: **"HTML 태그"** (구글 권장 1순위)
6. 표시되는 코드에서 `content="..."` 부분 **복사**
7. 클로드한테: *"구글 검증코드 [붙여넣기] 박아줘"* → 자동 push
8. CF 배포 완료 후 구글 페이지에서 "확인"

### B. 사이트맵 제출
좌측 메뉴 → **"색인 → Sitemaps"** → "새 사이트맵 추가" → `sitemap.xml` 입력

### C. URL 검사 (색인 요청)
1. 상단 검색창에 `https://seven1-2jn.pages.dev/` 입력
2. "URL이 Google에 등록되어 있지 않음" → "색인 생성 요청" 클릭
3. 1일 10건 한도

### D. 색인 상태 모니터링
- 좌측 메뉴 → **"색인 → 페이지"** — 색인된 페이지 vs 제외된 페이지
- 좌측 메뉴 → **"실적"** — 검색어, 클릭, 노출, CTR, 평균 순위 (최소 며칠 후부터 데이터 쌓임)

## 4. 추가 등록 (선택, 권장)

### Bing Webmaster Tools
- https://www.bing.com/webmasters
- 구글 서치 콘솔 인증 정보로 import 가능 (코드 발급 안 해도 됨)
- 사이트맵 제출 후 IndexNow 자동 통합

### Yandex Webmaster
- https://webmaster.yandex.com (외국 트래픽 노릴 때만)

### 네이버 비즈니스 (네이버 플레이스)
- https://smartplace.naver.com — 매장형 비즈니스는 필수
- 네이버 지도/플레이스 노출 = 모바일 검색 1순위 진입로

## 5. 검증 후 30일 체크리스트

| 항목 | 시기 | 확인 방법 |
|---|---|---|
| 네이버 색인 진입 | 등록 후 3~7일 | site:seven1-2jn.pages.dev (네이버 검색) |
| 구글 색인 진입 | 등록 후 1~7일 | site:seven1-2jn.pages.dev (구글 검색) |
| 키워드 첫 노출 | 등록 후 2~4주 | "대전세븐나이트 원숭이" 검색 |
| 1페이지 진입 | 등록 후 4~12주 | 상동 (백링크·트래픽 신호 따라) |

## 🚦 자동 실행 흐름

### 검증코드 받기 전
1. `index.html`에 placeholder 박혀있는지 확인
2. 사용자에게 등록 절차 안내 (위 1, 2 섹션)

### 검증코드 받은 후
1. sed로 placeholder → 실제 코드 교체
2. git commit + push
3. CF 배포 완료 polling (90초)
4. 사용자에게: "네이버/구글 페이지 가서 '확인' 버튼 누르세요"
5. 확인 완료되면: 사이트맵 제출 + 수집 요청 안내
6. `indexnow` 스킬로 IndexNow 핑 같이 발사

## 🧠 함정

- **검증 페이지에서 "확인" 누르기 전에 CF 배포 완료 확인** → HTML에 코드 박혀있어야 검증 통과
- **`<meta>`가 아닌 `<noscript>` 안에 들어가면 안 됨** → `<head>` 직속이어야 함
- **placeholder 그대로 두고 push해도 안전** — 인식 안 될 뿐 페널티 없음
- **네이버는 등록 후에도 인덱싱 느림** (3~7일) — 조급해하지 말 것
- **구글 "URL 검사 → 색인 요청"은 빠른 페이스 1일 10건** — 페이지 많으면 sitemap에 의존
- **여러 도메인 운영 시 각각 등록** — pages.dev 도메인 + custom 도메인 따로
