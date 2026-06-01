---
name: a11y
description: WCAG 2.1 AA 접근성 감사 — 시맨틱 HTML, ARIA, 키보드 내비게이션, 색 대비, 포커스 관리, 스크린리더 지원, alt 텍스트. 접근성은 SEO 신호이기도 함. Use when user mentions 접근성, accessibility, a11y, WCAG, 시각장애인, 키보드 탐색, 스크린리더.
---

# Accessibility (a11y) — WCAG 2.1 AA

접근성은 WCAG 2.1 AA 기준. Google·네이버 모두 접근성 신호를 랭킹에 활용 (특히 모바일).

## 8단계 체크리스트

### 1. 시맨틱 HTML
이 프로젝트 표준:
```html
<header class="topbar">...</header>
<main id="main">
  <section class="hero">...</section>
  <section class="proof">...</section>
  ...
</main>
<footer class="foot">...</footer>
<a class="floating-call" href="https://theassetsquare.com/">...</a>
```
- `<div>` 남발 대신 `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`
- 클릭 가능한 요소는 `<button>` 또는 `<a>` (절대 `<div onclick>` 금지)
- 폼 요소는 `<label for="id">` 또는 감싸기

### 2. 이미지 alt
- 의미 있는 이미지: `alt="대전세븐나이트 둔산동 야경"` (구체적, 한국어)
- 장식용: `alt=""` (빈 문자열, 누락 X)
- SVG 인라인 아이콘: `<svg role="img" aria-label="전화"></svg>` 또는 `aria-hidden="true"`
- og.png는 페이지 본문에 임베드 X (검색 미리보기용) → alt 무관

### 3. 키보드 내비게이션
- 모든 인터랙티브 요소 Tab으로 접근 가능
- 포커스 표시 보이게: `:focus-visible` 스타일 유지, **절대 `outline: none` 단독 X**
- 이 프로젝트의 `:focus-visible` 표준 (`style.css:25`):
  ```css
  a:focus-visible, button:focus-visible, summary:focus-visible {
    outline: 3px solid var(--accent);
    outline-offset: 3px;
    border-radius: 6px;
  }
  ```
- Skip link 표준 (`index.html` body 첫 줄):
  ```html
  <a class="skip" href="#main">본문 바로가기</a>
  ```
  ```css
  .skip { position:absolute; left:-9999px }
  .skip:focus { left:8px; top:8px; ... }
  ```

### 4. 색 대비 (4.5:1 최소)
이 프로젝트의 새 테마 팔레트 검증:
| 조합 | 대비 | 결과 |
|---|---|---|
| `#f5f5f5` on `#0a1410` | 17.2:1 | ✅ Pass AAA |
| `#34d399` on `#0a1410` | 9.8:1 | ✅ Pass AAA |
| `#062018` on `#34d399` (CTA 버튼) | 8.5:1 | ✅ Pass AAA |
| `#94a89e` (--dim) on `#0a1410` | 6.4:1 | ✅ Pass AA |

새 색 추가할 때 https://webaim.org/resources/contrastchecker/ 로 검증.

### 5. ARIA (필요할 때만)
- 시맨틱 HTML로 충분하면 ARIA 추가 X (No ARIA > Bad ARIA)
- 동적 변경: `aria-live="polite"` 또는 `aria-live="assertive"`
- 모달: `role="dialog" aria-modal="true" aria-labelledby="..."`
- 토글 버튼: `aria-pressed` / `aria-expanded`
- 전화 링크: `aria-label="원숭이 직통 "` (스크린리더 풀 안내)

### 6. 폼 (이 프로젝트는 폼 없음 — 추가 시 적용)
- 모든 input에 `<label>`
- 필수 필드: `required` + 시각/스크린리더 표시
- 에러: `aria-invalid="true"` + `aria-describedby="error-id"`
- 자동완성: `autocomplete="email" / tel / name`

### 7. 미디어 (이 프로젝트는 영상 없음)
- 영상: 자막 (`<track kind="captions">`)
- 자동재생 X, 또는 음소거 + 정지 가능
- 깜빡임/번쩍임 3Hz 이하

### 8. 페이지 구조
- `<html lang="ko">` ✓ (이 프로젝트 적용됨)
- 한 페이지에 `<h1>` **하나만** ✓
- 헤딩 순서 안 건너뛰기 (h1 → h2 → h3, h1 → h3 X) ✓
- 페이지 제목 `<title>`이 페이지 내용 반영 ✓

## 측정 도구
- Chrome DevTools → Lighthouse → Accessibility (자동)
- axe DevTools 확장 프로그램 (브라우저 확장)
- WAVE 확장 프로그램
- 키보드만으로 페이지 끝까지 네비게이션 테스트 (수동)
- macOS VoiceOver / Windows NVDA로 실제 청취 (사용자 안내)

## 🚦 자동 실행 흐름

1. HTML 파일 모두 읽기
2. 위 8개 카테고리별 위반 식별 (`file_path:line` 명시)
3. 우선순위: **키보드 차단 > 스크린리더 차단 > 시맨틱 위반 > 색 대비**
4. 각 위반에 대해 구체적 수정 제시
5. 색 대비는 실제 색 코드 추출 후 비율 계산 (위 표 형식)
6. 수정 후 `playwright` 스킬로 키보드 Tab 흐름 시각 검증

## 🧠 함정

- **`outline: none` 단독 사용** → 키보드 사용자 위치 잃음, **반드시 대체 표시**
- **장식 SVG에 alt 누락** → 스크린리더가 읽음, `aria-hidden="true"` 명시
- **`<a href="https://theassetsquare.com/">` aria-label 없음** → "" 한 자리씩 읽음, label로 자연 발음 유도
- **모바일 터치 영역 < 44×44px** → WCAG 위반, CTA는 최소 48×48
