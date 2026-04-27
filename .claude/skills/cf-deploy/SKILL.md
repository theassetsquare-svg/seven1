---
name: cf-deploy
description: Cloudflare Pages 자동 배포 흐름 — git push → CF auto-build → 라이브 검증 → 14자원 200 OK 확인. _headers 캐시·보안 정책 점검. Use when user asks 배포, deploy, push, 라이브, 사이트 올려, Cloudflare Pages, 배포 확인.
---

# Cloudflare Pages — 배포 + 라이브 검증 흐름

이 프로젝트는 **GitHub → Cloudflare Pages 자동 배포** 연결됨:
- Repo: `https://github.com/theassetsquare-svg/seven1`
- Live: `https://seven1-2jn.pages.dev/`
- Build: 정적 사이트, 빌드 명령 없음 (HTML/CSS/JS 그대로)

## 0. 사전 1회 설정 (이미 완료)

1. https://dash.cloudflare.com → Pages → Create → Connect to Git
2. GitHub 계정 연결 → 저장소 `seven1` 선택
3. Build settings: **Framework preset = None**, Build command 비움, Output directory `/`
4. Production branch: `main`
5. 자동 발급되는 도메인: `seven1-2jn.pages.dev`

## 1. 일반 배포 흐름

### A. 변경 → push
```bash
cd /home/user/seven1
git add -A
git commit -m "<변경 내용>"
git push origin main
```

### B. CF Pages 자동 빌드 (60~120초)
push 시 GitHub webhook → Cloudflare Pages 자동 트리거. 별도 액션 불필요.

### C. 배포 완료 polling
```bash
DOMAIN='https://seven1-2jn.pages.dev'
for i in 1 2 3 4 5 6; do
  sleep 15
  status=$(curl -s -o /dev/null -w "%{http_code}" $DOMAIN/)
  if [ "$status" = "200" ]; then
    title=$(curl -s $DOMAIN/ | grep -oP '<title>[^<]+' | head -1)
    echo "[$i] HTTP $status — $title"
    break
  fi
  echo "[$i] HTTP $status, waiting..."
done
```

## 2. 14 자원 풀 검증 (배포 직후)

```bash
DOMAIN='https://seven1-2jn.pages.dev'
echo "=== 14 자원 라이브 검증 ==="
for path in / robots.txt sitemap.xml llms.txt site.webmanifest og.png \
            favicon.svg favicon.ico apple-touch-icon.png icon-192.png \
            icon-512.png main.js style.css; do
  res=$(curl -sI "$DOMAIN/$path" | head -1 | tr -d '\r')
  printf "  %-50s %s\n" "$DOMAIN/$path" "$res"
done

# IndexNow 키 파일 별도
KEY=$(ls *.txt | grep -E '^[a-f0-9]{32}\.txt$' | head -1)
res=$(curl -sI "$DOMAIN/$KEY" | head -1 | tr -d '\r')
printf "  %-50s %s\n" "$DOMAIN/$KEY" "$res"
```

## 3. _headers 정책 검증 (보안·캐시 8종)

```bash
curl -sI https://seven1-2jn.pages.dev/ | grep -iE \
  'strict-transport|x-content|x-frame|referrer|permissions|cross-origin|cache-control'
```

기대 출력 (8개 중 7개 + Cache-Control):
- `strict-transport-security: max-age=31536000; includeSubDomains; preload`
- `x-content-type-options: nosniff`
- `x-frame-options: SAMEORIGIN`
- `referrer-policy: strict-origin-when-cross-origin`
- `permissions-policy: geolocation=(), microphone=(), camera=(), payment=(), usb=()`
- `cross-origin-opener-policy: same-origin`
- `cross-origin-resource-policy: same-site`
- `cache-control: public, max-age=0, must-revalidate` (HTML)

## 4. 캐시 정책 핵심 규칙

CF Pages는 `_headers` 규칙을 *append*만 하고 *replace* 안 함. 그래서:
- `/*`에는 보안 헤더만 (모든 경로 공통)
- `Cache-Control`은 경로별로만 명시 (중복 방지)

```
/*
  X-Content-Type-Options: nosniff
  ...

/                       Cache-Control: public, max-age=0, must-revalidate
/index.html             Cache-Control: public, max-age=0, must-revalidate
/style.css              Cache-Control: public, max-age=604800, immutable
/og.png                 Cache-Control: public, max-age=604800, immutable
/favicon.ico            Cache-Control: public, max-age=604800, immutable
/sitemap.xml            Cache-Control: public, max-age=3600
/robots.txt             Cache-Control: public, max-age=3600
```

**주의**: 정적 자원에 `immutable` 캐시 1주. 그래서 og.png 갱신해도 사용자 브라우저는 1주 캐시 들고 있음. 즉시 반영 필요하면:
- `og:image` URL에 `?v=2` 쿼리스트링
- 또는 파일명 변경

## 5. 빌드 로그 보기

CF Pages 대시보드:
- https://dash.cloudflare.com → Pages → seven1 프로젝트 → Deployments → 최근 빌드 클릭
- "Build log" 탭에서 git diff·수집된 파일·빌드 시간 확인

빌드 실패 시:
- "Failed to build" → 보통 `_headers` 문법 오류 → 한 줄에 `key: value` 형식 확인

## 6. 강제 재배포 (변경 없이)

git 변경 없이 빌드만 다시:
- 대시보드 → Deployments → "Retry deployment" 또는
- 빈 커밋: `git commit --allow-empty -m "redeploy" && git push`

## 7. 롤백

대시보드 → Deployments → 이전 성공 빌드 우측 ⋯ → "Rollback to this deployment"

## 🚦 자동 실행 흐름

1. 변경 사항 stage + commit (작업 완료 후)
2. `git push origin main`
3. 60~120초 대기 (배포 polling)
4. 14 자원 200 OK 확인
5. _headers 8종 검증
6. 라이브 시각 검증 (`playwright` 스킬)
7. IndexNow 핑 (`indexnow` 스킬)

## 🧠 함정

- **`_headers` 한 칸 들여쓰기 안 하면 무시됨** — 헤더는 들여쓰기 필수, 경로는 들여쓰기 X
- **Cache-Control이 `/*`에도 있고 `/index.html`에도 있으면** → CF가 둘 다 보내고 더 엄격한 게 적용. `/*`에는 안 두는 게 안전
- **GitHub force-push 후 CF는 자동으로 재배포 안 할 수 있음** — 강제 재배포 필요할 때 있음
- **빌드 실패해도 라이브는 이전 버전 유지** — 다행
- **Custom domain 추가 시** → DNS 설정 (CNAME `seven1` → `seven1-2jn.pages.dev`) + CF에서 도메인 추가
