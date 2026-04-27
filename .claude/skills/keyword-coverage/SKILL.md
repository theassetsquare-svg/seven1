---
name: keyword-coverage
description: 타겟 키워드의 사이트 내 노출 분석 — title/H1/H2/본문/alt/meta/JSON-LD 다층 배치 점검. 과밀(키워드 스터핑) vs 부족 진단. Long-tail 키워드 발굴. Use when user asks 키워드 점검, 키워드 분석, 키워드 노출, 키워드 스터핑, "검색어 잘 박혔나", 롱테일.
---

# Keyword Coverage — 키워드 다층 배치 감사

검색엔진은 **키워드가 페이지의 여러 위치에 자연스럽게 나오는지** 점검. 타이틀에만 있고 본문에 없으면 약함, 본문에 도배하면 페널티. 균형이 핵심.

## 타겟 키워드 (이 프로젝트 기준)

### 1차 (메인) — 무조건 1순위 노출 목표
- `대전세븐나이트`
- `대전 세븐나이트`
- `둔산동 세븐나이트`

### 2차 (보조) — 같이 잡을 키워드
- `대전세븐나이트 원숭이`
- `대전세븐나이트 W.T`
- `대전세븐나이트 부킹`
- `대전 4인1조 W.T`
- `둔산동 부킹`

### 3차 (Long-tail) — 의도가 명확해서 클릭률 높음
- `대전세븐나이트 예약`
- `대전세븐나이트 주대`
- `대전세븐나이트 토요일`
- `대전세븐나이트 후기`
- `대전 합석 잘하는 곳`
- `대전 외지 손님`
- `청주에서 대전 나이트`

## 키워드가 들어가야 할 7개 위치

| 위치 | 1차 키워드 | 2차 키워드 | 3차 키워드 |
|---|---|---|---|
| `<title>` | ✅ 1~2회 | 1회 | 0~1회 |
| `<meta description>` | ✅ 1~2회 | 1회 | 1~2회 |
| `<meta keywords>` | ✅ 모두 | ✅ 모두 | ✅ 일부 |
| `<h1>` | ✅ 1회 | 0~1회 | 0회 |
| `<h2>` (5~7개) | ✅ 2~3회 | ✅ 2~3회 | 1~2회 |
| 본문 | ✅ 5~10회 | ✅ 3~5회 | ✅ 1~3회 |
| `<img alt>` | ✅ 1~2회 | 1회 | 0~1회 |
| JSON-LD (`name`, `alternateName`, `description`) | ✅ 모두 | ✅ 모두 | 일부 |

## 자동 분석 스크립트

```bash
DOMAIN='https://seven1-2jn.pages.dev'
KEYWORD='대전세븐나이트'

curl -s $DOMAIN/ > /tmp/page.html

echo "=== 키워드 '$KEYWORD' 노출 분석 ==="

# title
echo "title:        $(grep -oP '<title>[^<]+' /tmp/page.html | grep -c "$KEYWORD")회"

# meta description
desc=$(grep -oP 'meta name="description" content="\K[^"]+' /tmp/page.html)
echo "description:  $(echo "$desc" | grep -oc "$KEYWORD")회"

# h1
echo "h1:           $(grep -oP '<h1[^>]*>[^<]+' /tmp/page.html | grep -c "$KEYWORD")회"

# h2
echo "h2:           $(grep -oP '<h2[^>]*>[^<]+' /tmp/page.html | grep -c "$KEYWORD")회"

# 본문 (HTML 태그 제거 후 카운트)
body=$(curl -s $DOMAIN/ | sed 's/<[^>]*>//g')
echo "본문 총노출:  $(echo "$body" | grep -oc "$KEYWORD")회"

# JSON-LD
jsonld=$(grep -oP 'application/ld\+json">.*?</script>' /tmp/page.html)
echo "JSON-LD:      $(echo "$jsonld" | grep -oc "$KEYWORD")회"

# alt
echo "img alt:      $(grep -oP 'alt="[^"]*"' /tmp/page.html | grep -c "$KEYWORD")회"
```

## 키워드 밀도 (density) 계산

```bash
DOMAIN='https://seven1-2jn.pages.dev'
KEYWORD='대전세븐나이트'

body=$(curl -s $DOMAIN/ | sed 's/<[^>]*>//g; s/[[:space:]]\+/ /g')
total_chars=$(echo -n "$body" | wc -c)
keyword_count=$(echo "$body" | grep -oc "$KEYWORD")
keyword_chars=$((keyword_count * ${#KEYWORD}))
density=$(awk "BEGIN { printf \"%.2f\", ($keyword_chars / $total_chars) * 100 }")

echo "총 본문 길이: $total_chars 글자"
echo "키워드 출현: $keyword_count회 ($keyword_chars 글자)"
echo "밀도:        $density%"
```

**권장 밀도: 1~3%** (한국어 기준)
- < 1% → 부족, 더 자연스럽게 추가
- 1~3% → 정상
- > 3% → 키워드 스터핑 의심, 줄이기

## 의도 매칭 점검

검색 의도(intent)별로 페이지가 답을 주는가?

| 검색 의도 | 사용자 검색 예 | 이 페이지 답변 위치 |
|---|---|---|
| **정보형** | "대전세븐나이트 영업시간" | `<dl class="meta">` 영업 항목 |
| **거래형** | "대전세븐나이트 예약" | hero CTA + last-CTA |
| **탐색형** | "대전세븐나이트 위치" | info 섹션 + JSON-LD address |
| **비교형** | "대전세븐나이트 vs ..." | proof 섹션 (왜 1순위) |
| **후기형** | "대전세븐나이트 후기" | reviews 섹션 |
| **가격형** | "대전세븐나이트 주대" | FAQ 4번 |

각 의도에 답이 없으면 추가.

## Long-tail 키워드 발굴

### A. 네이버 자동완성 (사용자가 직접)
- 네이버 검색창에 "대전세븐나이트 " 입력 → 드롭다운 자동완성 검색어 캡처
- "대전세븐나이트 " + 자모음("ㄱ"부터 "ㅎ") 입력해서 다양화

### B. 구글 People Also Ask
- 구글 "대전세븐나이트" 검색 → "사람들이 함께 묻는 질문" 박스 → 4~5개 질문 추출
- 그 질문을 FAQ에 추가

### C. 관련 검색어 (네이버 SERP 하단)
- 네이버 검색결과 맨 아래 "관련 검색어" 섹션 → 5~10개 키워드 추출
- 본문·H2에 자연스럽게 녹여 넣기

## 🚦 자동 실행 흐름

1. 사용자에게 1차/2차/3차 타겟 키워드 확인 (또는 위 기본값 사용)
2. 위 자동 분석 스크립트로 7개 위치 노출 카운트
3. 부족한 위치 식별 (예: H2에 키워드 0회)
4. 밀도 계산 (1~3% 범위 확인)
5. 의도 매칭 점검 (6개 의도 모두 답 있는지)
6. 부족한 부분에 자연스럽게 키워드 추가 (스터핑 X)
7. 사용자에게 long-tail 발굴 외부 작업 안내

## 출력 포맷

```
## 키워드 커버리지 — 대전세븐나이트

### 노출 현황
| 위치 | 횟수 | 평가 |
|---|---|---|
| title | 1 | ✅ 적절 |
| description | 1 | ⚠️ 1회 더 권장 |
| h1 | 1 | ✅ 적절 |
| h2 | 0 | ❌ 최소 1회 필요 |
| 본문 | 21 | ✅ 풍부 |
| JSON-LD | 5 | ✅ 적절 |
| img alt | 0 | ⚠️ og.png alt에 추가 권장 |

### 밀도
- 총 본문 1,847자, 키워드 21회 → 밀도 1.8% ✅

### 의도 매칭
- 정보형: ✅ / 거래형: ✅ / 탐색형: ✅ / 비교형: ✅ / 후기형: ✅ / 가격형: ✅

### 권장 수정
1. [HIGH] H2 한 곳에 "대전세븐나이트" 추가 (예: "왜 대전세븐나이트가 1순위?")
2. [MED] description에 1회 더 자연스럽게
3. [LOW] img alt 추가
```

## 🧠 함정

- **키워드 스터핑** (밀도 5%+) → 구글 페널티, 네이버는 더 민감
- **밀도만 맞추고 본문 부자연스러움** → 사용자 이탈 → 체류시간 ↓ → 랭킹 ↓
- **변형 키워드 (띄어쓰기/공백) 무시** — "대전세븐나이트", "대전 세븐나이트", "대전 세븐 나이트" 모두 매칭 카운트해야 정확
- **JSON-LD `alternateName`** 활용 → 변형 키워드 한 번에 해결
- **3차 키워드 (long-tail)는 합쳐서 1차보다 트래픽 많음** — 무시하지 말 것
