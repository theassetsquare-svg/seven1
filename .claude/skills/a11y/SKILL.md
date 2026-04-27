---
name: a11y
description: Accessibility (WCAG 2.1 AA) audit — semantic HTML, ARIA, keyboard navigation, color contrast, focus management, screen reader support, alt text. Accessibility is also an SEO signal. Use when user mentions 접근성, accessibility, a11y, WCAG, 시각장애인, 키보드 탐색.
---

# Accessibility (a11y) Audit

접근성은 WCAG 2.1 AA 기준이 표준. Google은 접근성 신호도 랭킹에 활용.

## 체크리스트

### 1. 시맨틱 HTML
- `<div>` 남발 대신 `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`
- 클릭 가능한 요소는 `<button>` 또는 `<a>` (절대 `<div onclick>` 안됨)
- 폼 요소는 `<label for="id">` 또는 감싸기

### 2. 이미지
- 의미 있는 이미지: `alt="설명"`
- 장식용: `alt=""` (빈 문자열, 누락 X)
- SVG 아이콘: `<svg role="img" aria-label="...">` 또는 `aria-hidden="true"`

### 3. 키보드 탐색
- 모든 인터랙티브 요소 Tab으로 접근 가능
- 포커스 표시 보이게 (`:focus-visible` 스타일 유지, 절대 `outline: none` 단독 X)
- 모달 열리면 포커스 트랩, 닫으면 트리거로 복귀
- Skip link: `<a href="#main" class="skip-link">본문 바로가기</a>`

### 4. 색 대비
- 일반 텍스트: 4.5:1 이상
- 큰 텍스트(18pt+): 3:1
- UI 컴포넌트(버튼 보더 등): 3:1
- 색만으로 정보 전달 금지 (예: 빨간 텍스트만으로 에러 표시 X → 아이콘/문구 추가)

### 5. ARIA (필요할 때만)
- 시맨틱 HTML로 충분하면 ARIA 추가 X (No ARIA > Bad ARIA)
- 동적 변경: `aria-live="polite"` 또는 `aria-live="assertive"`
- 모달: `role="dialog" aria-modal="true" aria-labelledby="..."`
- 토글 버튼: `aria-pressed` / `aria-expanded`

### 6. 폼
- 모든 input에 `<label>`
- 필수 필드: `required` + 시각/스크린리더 표시
- 에러: `aria-invalid="true"` + `aria-describedby="error-id"`
- 자동완성: `autocomplete` 속성 (이메일/이름/주소)

### 7. 미디어
- 영상: 자막 (`<track kind="captions">`)
- 자동재생 X, 또는 음소거 + 정지 가능
- 깜빡임/번쩍임 3Hz 이하

### 8. 페이지 구조
- `<html lang="ko">`
- 한 페이지에 `<h1>` 하나
- 헤딩 순서 안 건너뛰기 (h1 → h2 → h3, h1 → h3 X)
- 페이지 제목 `<title>`이 페이지 내용 반영

## 측정 도구 (사용자 안내)
- Chrome DevTools → Lighthouse → Accessibility
- axe DevTools 확장 프로그램
- WAVE 확장 프로그램
- 키보드만으로 페이지 끝까지 네비게이션 테스트
- macOS VoiceOver / Windows NVDA로 실제 청취

## 실행 순서

1. HTML 파일 모두 읽기
2. 위 8개 카테고리별 위반 식별 (`file_path:line` 명시)
3. 우선순위: 키보드 차단 > 스크린리더 차단 > 시맨틱 위반 > 색 대비
4. 각 위반에 대해 구체적 수정 제시
5. 색 대비는 실제 색 코드 추출 후 비율 계산
