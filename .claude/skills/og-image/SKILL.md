---
name: og-image
description: 1:1 정사각 OG 썸네일 (1200×1200) + 파비콘 5종 + multi-size .ico를 헤드리스 크로미움으로 자동 생성. Korean font 자동 설치, Playwright 사용. Use when user asks OG 이미지 새로, 썸네일 새로, 파비콘 새로, 이미지 다시 만들어, og.png 갱신.
---

# OG Image & Favicon — 헤드리스 크로미움 렌더 워크플로

이 프로젝트의 OG는 **1:1 정사각 1200×1200** (사용자 메모리 저장됨, `feedback_og_aspect_ratio.md` 참조). 카카오톡·네이버·인스타 미리보기에서 정사각이 더 눈에 띈다는 사용자 판단.

## 사전 준비 (1회만, 이미 완료)

### 한글 폰트 설치 — 헤드리스 크로미움이 fontconfig로 자동 인식
```bash
mkdir -p ~/.fonts
# Pretendard Black (가독성)
curl -sLo ~/.fonts/Pretendard-Black.woff2 \
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/static/woff2/Pretendard-Black.woff2"
curl -sLo ~/.fonts/Pretendard-Bold.woff2 \
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/static/woff2/Pretendard-Bold.woff2"
# Black Han Sans (디스플레이)
curl -sLo ~/.fonts/BlackHanSans.ttf \
  "https://github.com/google/fonts/raw/main/ofl/blackhansans/BlackHanSans-Regular.ttf"
# Noto Sans KR (광범위 한글)
curl -sLo ~/.fonts/NotoSansKR-Black.ttf \
  "https://github.com/google/fonts/raw/main/ofl/notosanskr/NotoSansKR%5Bwght%5D.ttf"
```

### Playwright 설치
```bash
cd /tmp && npm install playwright-core
```

### Chromium 경로 확인
```bash
which chromium  # /nix/store/.../bin/chromium
```

## ⚠️ 필수 함정 (이거 안 지키면 한글 안 그려짐)

### 1. 시스템 폰트로 사용 (`@font-face`로 불러오면 OTS 파싱 실패)
```css
/* ❌ 안 됨 — 헤드리스 크로미움 OTS가 webfont 거부 */
@font-face {
  font-family: 'NotoKR';
  src: url('http://localhost/font.ttf') format('truetype');
}

/* ✅ 됨 — ~/.fonts 설치된 것 시스템 이름으로 호출 */
font-family: 'Pretendard', 'Black Han Sans', 'Noto Sans KR', sans-serif;
```

### 2. `device.fonts.ready` await + 추가 500ms 대기
```js
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);
await page.screenshot({ path: out });
```

### 3. 이모지 (📞 ☎)는 헤드리스에 없음 → SVG 또는 일반 글자(☎ U+260E) 사용 가능하지만 렌더 환경에 따라 □로 보일 수 있음. 이미지 안에서는 SVG 아이콘 권장.

## 워크플로 — OG 1200×1200 생성

### 1. HTML 템플릿 작성 (`/tmp/og.html`)
이 프로젝트 표준 레이아웃 (에메랄드+시안 테마 예시):
```html
<!doctype html>
<html lang="ko"><head><style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:1200px;height:1200px;overflow:hidden}
  .stage{
    width:1200px;height:1200px;position:relative;
    background:
      radial-gradient(circle at 30% 20%, rgba(52,211,153,.42), transparent 55%),
      radial-gradient(circle at 75% 80%, rgba(6,182,212,.36), transparent 55%),
      linear-gradient(135deg, #0a1410 0%, #08120f 50%, #050a08 100%);
    color:#f5f5f5;
    font-family:'Pretendard','Noto Sans KR','Black Han Sans',sans-serif;
  }
  /* 상단 그라데이션 바 */
  .topbar{ position:absolute;top:0;left:0;right:0;height:14px;
    background:linear-gradient(90deg,#34d399 0%,#10b981 50%,#06b6d4 100%); }
  /* 좌상 라벨 (필 모양 태그 2개) */
  .label{ position:absolute;top:60px;left:60px;display:flex;gap:14px;align-items:center; }
  .label .pill{
    background:rgba(52,211,153,.16); border:3px solid #34d399; color:#34d399;
    padding:14px 30px;border-radius:999px;font-weight:900;font-size:42px;letter-spacing:-1px;
  }
  /* 우상 코너 정보 */
  .corner{ position:absolute;top:60px;right:60px;text-align:right;
    color:#06b6d4;font-weight:900;font-size:36px;line-height:1.4; }
  /* 중앙 매장명 (Black Han Sans 거대) */
  .brand .store{
    font-family:'Black Han Sans','Pretendard',sans-serif;font-weight:900;
    font-size:170px;line-height:1;letter-spacing:-8px;
    background:linear-gradient(180deg,#ffffff 0%, #d1fae5 100%);
    -webkit-background-clip:text;background-clip:text;color:transparent;
    text-shadow:0 0 40px rgba(52,211,153,.3);
  }
  /* 중앙 거대 7 로고 (SVG) */
  .seven{ position:absolute;top:430px;left:50%;transform:translateX(-50%);width:520px;height:520px; }
  /* 닉 배지 + 전화번호 */
  .info .nick{
    background:linear-gradient(135deg,#34d399,#06b6d4);color:#062018;
    font-weight:900;font-size:68px;padding:22px 60px;border-radius:24px;
    box-shadow:0 14px 40px rgba(52,211,153,.45);
  }
  .info .phone{
    font-family:'Black Han Sans','Pretendard',sans-serif;font-weight:900;
    font-size:130px;color:#ffffff;letter-spacing:-4px;
  }
  /* 하단 스트립 */
  .footer{
    position:absolute;bottom:0;left:0;right:0;height:90px;
    display:flex;align-items:center;justify-content:space-around;
    background:linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.6) 100%);
    border-top:3px solid #34d399;color:#a7f3d0;font-size:38px;font-weight:900;
  }
</style></head><body>
  <div class="stage">
    <div class="topbar"></div>
    <div class="label">
      <div class="pill">4인1조</div>
      <div class="pill cyan">24시 직통</div>
    </div>
    <div class="corner">둔산동<span class="b">대전 1등 부킹률</span></div>
    <div class="brand"><div class="store">대전세븐나이트</div><div class="tag">— 둔산동 핫플 1번지 —</div></div>
    <svg class="seven" viewBox="0 0 200 200">...</svg>
    <div class="info"><div class="nick"><span class="small">W.T</span>원숭이</div><div class="phone"></div></div>
    <div class="footer"><span>테이블 즉시</span><span>합석 매칭 OK</span><span>당일예약</span></div>
  </div>
</body></html>
```

### 2. Playwright 렌더 스크립트 (`/tmp/render-og.js`)
```js
const { chromium } = require('/tmp/node_modules/playwright-core');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch({
    executablePath: '/nix/store/.../bin/chromium',  // which chromium
    headless: true,
    args: ['--no-sandbox','--disable-gpu'],
  });
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 1200 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto('file:///tmp/og.html', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/user/seven1/og.png', type: 'png' });
  await browser.close();
})();
```

### 3. 실행
```bash
node /tmp/render-og.js
# 출력: /home/user/seven1/og.png (~900KB, 1200x1200)
```

### 4. 사이즈 검증
```bash
node -e "
const b=require('fs').readFileSync('/home/user/seven1/og.png');
const w=b.readUInt32BE(16), h=b.readUInt32BE(20);
console.log('OG:', w+'x'+h, '('+b.length+' bytes)');
"
# 기대: OG: 1200x1200 (~900000 bytes)
```

## 워크플로 — 파비콘 5종 + .ico 생성

### 1. favicon.svg (벡터, 모든 사이즈 대응)
같은 SVG를 `/home/user/seven1/favicon.svg`에. viewBox 64×64, 7 로고 + bottom accent bar.

### 2. PNG 5종 렌더 (`/tmp/render-icons.js`)
```js
const sizes = [
  { size: 512, out: '/home/user/seven1/icon-512.png' },
  { size: 192, out: '/home/user/seven1/icon-192.png' },
  { size: 180, out: '/home/user/seven1/apple-touch-icon.png' },
  { size: 32,  out: '/tmp/favicon-32.png' },
  { size: 16,  out: '/tmp/favicon-16.png' },
  { size: 48,  out: '/tmp/favicon-48.png' },
];
// favicon.svg를 viewport 크기에 맞춰 렌더 → screenshot
```

### 3. multi-size .ico 빌드 (`/tmp/build-ico.js`)
```js
// 16/32/48 PNG들을 ICO 컨테이너로 묶기
// ICONDIR (6 bytes) + ICONDIRENTRY (16 bytes × N) + PNG payloads
```
참고 구현: 이 프로젝트에 이미 작성된 `/tmp/build-ico.js`

### 4. 검증
```bash
ls -la /home/user/seven1/{favicon.svg,favicon.ico,apple-touch-icon.png,icon-192.png,icon-512.png,og.png}
```

## 색상 변경 시

색만 바꾸면 됨. CSS의 다음 4개 변수만 교체:
```
배경:    #0a1410 (다크 그린톤)  →  새 다크
강조1:   #34d399 (에메랄드)     →  새 강조1
강조2:   #06b6d4 (시안)        →  새 강조2
글로우:  rgba(52,211,153,.4)   →  새 강조1 rgba
```
SVG 그라데이션 stop도 같이 교체.

## 자주 쓰는 색 조합 (사이트별)
| 테마 | 다크 | 강조1 | 강조2 |
|---|---|---|---|
| 골드+핑크 | #0a0a0a | #ffd84d | #ff3d6e |
| 에메랄드+시안 | #0a1410 | #34d399 | #06b6d4 |
| 네이비+골드 | #0a1428 | #ffd700 | #ffa500 |
| 와인+로즈골드 | #1a0a0a | #c9184a | #f4a261 |
| 퍼플+민트 | #14091a | #a78bfa | #5eead4 |

## 🚦 자동 실행 흐름

1. 사용자가 새 OG 요청 → 변경할 변수 (매장명/W.T/전화/색) 확인
2. HTML 템플릿 작성 (`/tmp/og.html`)
3. Playwright 렌더 → `/home/user/seven1/og.png` 출력
4. 사이즈·렌더 시각 확인 (Read 툴로 PNG 미리보기)
5. 파비콘 5종 + .ico 같이 생성 (테마 일치)
6. `index.html`의 `og:image:width/height` 1200으로 업데이트
7. push → CF Pages 자동 배포

## 🧠 함정

- **`@font-face` webfont 방식 사용** → 헤드리스 크로미움 OTS 거부, 안 그려짐. 시스템 폰트만 사용
- **이모지** (📞☎) → 헤드리스에 폰트 없음, 실제 사용자는 정상 표시 (보통 OK지만 OG 안에는 SVG 권장)
- **`document.fonts.ready` 안 await** → 텍스트 안 보임
- **OG 너무 큼** (>5MB) → 카톡 미리보기 안 뜸. 1200×1200이면 ~900KB 안전
- **og.png 변경 후 캐시** → CF가 1주 immutable 캐싱. 변경 후 `?v=2` 쿼리스트링 또는 파일명 변경 필요한 경우 있음
