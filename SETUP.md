# 새 사이트 복제 가이드

> 다른 도메인·다른 매장에 같은 SEO 풀세팅을 복사해서 쓰는 방법.
> 3가지 경로 중 골라서 진행하시면 됩니다.

---

## 🚀 경로 1: 통째 복제 (가장 빠름, 1분)

새 폴더에서 GitHub 저장소를 그대로 가져옵니다.

```bash
# 1. 새 폴더 만들기
mkdir my-new-site && cd my-new-site

# 2. 기존 저장소 통째 복제
git clone https://github.com/theassetsquare-svg/seven.git .
rm -rf .git  # 이전 git 히스토리 제거

# 3. 새 git 시작
git init
git add .
git commit -m "초기 복제"

# 4. 새 GitHub 저장소 만들고 푸시
# (https://github.com/new 에서 새 repo 생성 후)
git remote add origin https://github.com/<새계정>/<새이름>.git
git branch -M main
git push -u origin main

# 5. Cloudflare Pages 연결
# https://dash.cloudflare.com → Pages → Create → Connect to Git
```

**이후 변수만 바꾸기** — Claude Code 새 세션에서 아래 한 줄 :
> *"index.html, style.css, og.png, favicon, llms.txt, sitemap.xml 모두에서 도메인 `seven1-2jn.pages.dev`를 `<새도메인>` 으로, 전화번호 ``을 `<새번호>` 으로, 매장명·닉네임 `대전세븐나이트 / 원숭이`을 `<새매장 / 새닉>` 으로 바꿔서 푸시해줘. og.png과 favicon은 새 정보로 다시 그려줘."*

---

## 🤖 경로 2: 새 Claude Code 세션에 한 번에 시키기

새 폴더에서 `claude` 실행 후, 첫 채팅에 **아래 한 박스** 그대로 붙여넣기:

```
다음 GitHub 저장소를 참고로 새 사이트를 만들어줘:
https://github.com/theassetsquare-svg/seven

이 저장소에는 대전세븐나이트 W.T 원숭이용 SEO 풀세팅 사이트가 있어.
같은 구조로 새 사이트를 만들되, 아래 변수만 바꿔서 적용해:

[변수]
- 메인 도메인: <여기에 새 도메인>      예) seven-new.pages.dev
- 매장명:     <여기에 새 매장명>      예) 대구세븐나이트
- 담당 W.T:   <여기에 새 닉네임>      예) 호랑이
- 전화번호:   <여기에 010-xxxx-xxxx>  예) 
- 지역:       <여기에 지역>           예) 대구 / 동성로
- 영업지역:   <여기에 권역>           예) 대구·경북·경남

[그대로 가져올 것]
- 전체 SEO 메타 / OG / JSON-LD / robots / sitemap / llms.txt
- 파비콘 풀세트 (favicon.svg/ico, apple-touch, icon-192/512)
- _headers (캐시·보안 헤더 8종)
- site.webmanifest
- .mcp.json (Playwright MCP 최적화)
- .claude/skills 6개 (seo-audit/seo-naver/seo-ai/web-vitals/a11y/playwright)
- main.js (외부링크 새탭 자동화 + GA 훅)
- style.css (다크 + 핑크/골드 그라데이션 + :focus-visible 접근성)

[새로 만들 것]
- og.png (1200x630): 새 매장명·새 닉·새 전화번호 + 골드 7 로고
- favicon 5종: 같은 7 로고로 새 색감 (원하면)
- PROJECT.md / SETUP.md: 새 정보로 다시

[검증코드는 placeholder로 두기]
- naver-site-verification: REPLACE_WITH_NAVER_CODE
- google-site-verification: REPLACE_WITH_GOOGLE_CODE
→ 내가 발급받아서 나중에 줄게.

[다 끝나고]
- GitHub에 푸시할 수 있게 git init 까지
- 라이브 사이트 확인하고 검증 10번 돌려서 브리핑
```

---

## 📋 경로 3: 변수 swap 체크리스트

기존 코드를 손으로 직접 고치는 경우, 아래 5개 변수를 **모든 파일에서 일관되게** 치환합니다.

| 변수 | 기존 값 | 새 값으로 |
|---|---|---|
| 도메인 | `seven1-2jn.pages.dev` | `<새도메인>` |
| 매장명 | `대전세븐나이트` | `<새매장>` |
| W.T 닉 | `원숭이` | `<새닉>` |
| 전화번호 | `` | `<새번호>` |
| 지역 (시) | `대전` / `대전광역시 서구` / `둔산동` | `<새시/구/동>` |
| 권역 | `대전 · 세종 · 충청` | `<새권역>` |

**치환할 파일 목록:**
```
index.html         ← 거의 모든 변수
style.css          ← (변수 없음, 색만 바꾸려면 :root 변수 4개 수정)
main.js            ← (변수 없음)
og.png             ← 새로 그려야 함 (텍스트 박힘)
robots.txt         ← Sitemap 라인의 도메인
sitemap.xml        ← <loc> 의 도메인 + 이미지 사이트맵
llms.txt           ← 매장명·전화·지역·도메인 모두
_headers           ← (도메인 변수 없음, 그대로)
site.webmanifest   ← name·description
favicon.*          ← 새로 그려야 함 (디자인 다르게 하려면)
PROJECT.md         ← 매장 정보 헤더
SETUP.md           ← 그대로 두거나 정보 갱신
```

**Bash 일괄 치환 (sed):**
```bash
# 도메인
sed -i 's|seven-97b\.pages\.dev|<새도메인>|g' \
  index.html robots.txt sitemap.xml llms.txt site.webmanifest

# 전화번호
sed -i 's||<새번호>|g' \
  index.html llms.txt site.webmanifest
sed -i 's|+82-10-3242-1504|+82-<새번호 국제>|g' index.html

# 매장명·닉
sed -i 's|대전세븐나이트|<새매장>|g' \
  index.html llms.txt site.webmanifest robots.txt sitemap.xml
sed -i 's|원숭이|<새닉>|g' \
  index.html llms.txt site.webmanifest

# 지역
sed -i 's|대전광역시 서구|<새시/구>|g' index.html
sed -i 's|둔산동|<새동>|g' index.html llms.txt
sed -i 's|대전|<새시>|g' index.html llms.txt   # 주의: 다른 단어와 충돌하지 않는지 확인
```

---

## 🎨 og.png · favicon 새로 그리기

색감/텍스트는 매장마다 다르니, 새로 그려야 합니다. Claude Code 세션에서:

> *"og.png과 favicon 새로 만들어줘. 매장명 `<새매장>`, W.T `<새닉>`, 전화 `<새번호>` 박아서. 컬러는 [골드+핑크 / 블루+화이트 / 레드+블랙 등] 으로."*

또는 사장님이 매장 사진/로고를 가지고 계시면 합성 가능.

내부적으로 다음 도구가 필요 (현재 환경에 다 있음):
- chromium (headless 렌더링)
- python3 (PNG 다운샘플 + ICO 빌드)
- 한글 폰트 (Noto Sans KR Black + Black Han Sans)

새 세션에서 자동 처리됩니다.

---

## 📝 새 사이트 등록 5단계 (어떤 경로든 끝나면)

### 1) GitHub + Cloudflare Pages
- GitHub 새 저장소 생성 → 푸시
- https://dash.cloudflare.com/pages → Connect to Git → 자동 배포 설정
- 새 도메인 (`xxx.pages.dev`) 자동 발급

### 2) 도메인 (선택, 추천)
- 가비아/카페24에서 `.kr` 또는 `.com` 1~2만원 구매
- Cloudflare Pages > Custom domains 에서 연결

### 3) 네이버 서치어드바이저 등록
- https://searchadvisor.naver.com → 사이트 추가
- HTML 태그 방식 검증 → 발급코드 받아서 Claude에게 *"네이버 검증코드 [코드] 박아줘"*
- 이후 사이트맵 제출 + 수집 요청

### 4) 구글 서치 콘솔 등록
- https://search.google.com/search-console → 속성 추가
- HTML 태그 방식 → 코드 받아서 *"구글 검증코드 [코드] 박아줘"*
- 이후 Sitemaps 제출 + URL 검사 색인 요청

### 5) IndexNow API 핑 (즉시 인덱싱 가속)
새 도메인용 키 파일을 새로 만들어야 함:
> *"새 도메인용 IndexNow 키 만들고 Bing/Yandex/IndexNow.org 핑 발사해줘"*

---

## 📂 기존 파일 트리 (참고용)

```
seven/
├── index.html                    ← 메인 페이지 (SEO 풀세팅)
├── style.css                     ← 다크 테마 + a11y
├── main.js                       ← 새탭 자동화 + GA 훅
├── og.png                        ← 1200×630 검색·SNS 썸네일
├── robots.txt                    ← 검색·AI 봇 풀 허용 (11종)
├── sitemap.xml                   ← 이미지 사이트맵 포함
├── llms.txt                      ← AI 검색용 사이트 안내
├── _headers                      ← CF Pages 캐시·보안 헤더
├── favicon.svg                   ← 벡터 파비콘
├── favicon.ico                   ← 16/32/48 멀티사이즈
├── apple-touch-icon.png          ← iOS 홈화면 (180×180)
├── icon-192.png / icon-512.png   ← Android·PWA
├── site.webmanifest              ← PWA 매니페스트
├── 63ddda...59de.txt             ← IndexNow API 키 파일
├── PROJECT.md                    ← 작업 핸드오프 문서
├── SETUP.md                      ← 본 가이드
├── .gitignore
├── .mcp.json                     ← Playwright MCP 최적화
└── .claude/
    ├── settings.local.json
    └── skills/                   ← 커스텀 스킬 6개
        ├── seo-audit/SKILL.md
        ├── seo-naver/SKILL.md
        ├── seo-ai/SKILL.md
        ├── web-vitals/SKILL.md
        ├── a11y/SKILL.md
        └── playwright/SKILL.md
```

---

## 💡 추천 순서

**가장 빠르고 실수 없는 방법:**
1. **경로 1** 으로 통째 복제 (1분)
2. Claude Code 새 세션 열어서 변수 swap 한 줄 시킴
3. og.png · favicon 새로 그리기 시킴
4. GitHub 새 저장소에 푸시
5. CF Pages 연결
6. 네이버·구글 등록 → 검증코드 받아서 박기

이 흐름으로 **20~30분이면 새 사이트 검색엔진 등록까지** 완료됩니다.

---

## 🔑 참고: 현재 사이트의 주요 정보

```
도메인:     https://seven1-2jn.pages.dev/
GitHub:     https://github.com/theassetsquare-svg/seven
매장명:     대전세븐나이트
W.T 닉:     원숭이
전화:       
지역:       대전광역시 서구 둔산동
권역:       대전 · 세종 · 충청
영업시간:   20:00 – 05:00 (연중무휴)

Naver 검증:    REPLACE_WITH_NAVER_CODE (발급 후 교체)
Google 검증:   REPLACE_WITH_GOOGLE_CODE (발급 후 교체)
IndexNow 키:   83d34f87945b3ee6beb382d9c7b1d2f9

브랜드 컬러:
  배경:      #0a0a0a (다크)
  배경2:     #141414
  텍스트:    #f5f5f5
  강조:      #ffd84d (골드)
  강조2:     #ff3d6e (핑크)
```
