---
name: indexnow
description: IndexNow API로 Bing/Yandex/Naver(간접)에 즉시 인덱싱 핑 발사. 푸시 후 24시간 내 검색엔진 인식 가속. 키 파일 발급·교체·핑 자동화. Use when user asks 인덱스나우, IndexNow, 인덱싱 가속, 검색엔진 즉시 알림, 핑 보내, push 후 검색엔진 알림.
---

# IndexNow — 검색엔진 즉시 인덱싱 핑

IndexNow는 **Microsoft + Yandex + Seznam이 공동 운영**하는 표준. 한 번 핑 → 모든 참여 엔진에 전파. 네이버는 직접 참여 X지만 Bing 인덱스가 일부 네이버 결과에 영향.

## 1. 키 발급 (1회)

랜덤 32자 hex 키를 만들어 **루트에 `<key>.txt` 파일**로 둡니다.
```bash
NEW_KEY=$(node -e "console.log(require('crypto').randomBytes(16).toString('hex'))")
echo -n "$NEW_KEY" > /home/user/seven1/${NEW_KEY}.txt
echo "Key file: ${NEW_KEY}.txt (content: $NEW_KEY)"
```

이 프로젝트의 현재 키: `83d34f87945b3ee6beb382d9c7b1d2f9` (`83d34f...txt`)

키 파일은 **검색엔진이 fetch해서 본문 == 파일명 매치 확인** 용. 변경 시 새 키 → 새 파일.

## 2. 푸시 후 핑 발사

### A. 단일 URL
```bash
KEY=$(ls /home/user/seven1/*.txt | grep -E '/[a-f0-9]{32}\.txt$' | head -1 | xargs basename | sed 's/\.txt$//')
DOMAIN='seven1-2jn.pages.dev'

curl -sX POST "https://api.indexnow.org/IndexNow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "{
    \"host\": \"$DOMAIN\",
    \"key\": \"$KEY\",
    \"keyLocation\": \"https://$DOMAIN/${KEY}.txt\",
    \"urlList\": [\"https://$DOMAIN/\"]
  }"
```

### B. 다중 URL (페이지 여러 개 변경 시)
```bash
curl -sX POST "https://api.indexnow.org/IndexNow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "{
    \"host\": \"$DOMAIN\",
    \"key\": \"$KEY\",
    \"keyLocation\": \"https://$DOMAIN/${KEY}.txt\",
    \"urlList\": [
      \"https://$DOMAIN/\",
      \"https://$DOMAIN/about\",
      \"https://$DOMAIN/contact\"
    ]
  }"
```

### C. 응답 코드
- **200** = 성공, 모든 참여 엔진에 전파
- **202** = 수신, 키 검증 진행 중 (정상)
- **400** = 잘못된 요청 (URL 형식, 키 형식 확인)
- **403** = 키 검증 실패 (키 파일이 fetch 안 되거나 내용 불일치)
- **422** = host 불일치 (urlList의 도메인이 host와 다름)
- **429** = rate limit (24시간 내 너무 많은 요청)

### D. 개별 검색엔진 직접 핑 (백업)
```bash
# Bing
curl -s "https://www.bing.com/indexnow?url=https://$DOMAIN/&key=$KEY"
# Yandex
curl -s "https://yandex.com/indexnow?url=https://$DOMAIN/&key=$KEY"
# IndexNow.org (mirror)
curl -s "https://api.indexnow.org/indexnow?url=https://$DOMAIN/&key=$KEY"
```

## 3. 자동 push hook (선택)

`.git/hooks/post-push`에 자동 핑:
```bash
#!/bin/sh
KEY=$(ls $(git rev-parse --show-toplevel)/*.txt | grep -E '/[a-f0-9]{32}\.txt$' | head -1 | xargs basename | sed 's/\.txt$//')
DOMAIN='seven1-2jn.pages.dev'
sleep 90  # CF Pages 배포 대기
curl -sX POST "https://api.indexnow.org/IndexNow" -H "Content-Type: application/json" \
  -d "{\"host\":\"$DOMAIN\",\"key\":\"$KEY\",\"keyLocation\":\"https://$DOMAIN/${KEY}.txt\",\"urlList\":[\"https://$DOMAIN/\"]}"
```
또는 GitHub Actions 워크플로로.

## 4. 키 변경 절차

기존 키 노출되면 새 키 발급:
```bash
OLD_KEY="<기존>"
NEW_KEY=$(node -e "console.log(require('crypto').randomBytes(16).toString('hex'))")
mv ${OLD_KEY}.txt ${NEW_KEY}.txt
echo -n "$NEW_KEY" > ${NEW_KEY}.txt
# git commit + push
# 새 키로 IndexNow 핑 발사
```

## 5. 검증 — 키 파일 fetch 가능한가?

```bash
DOMAIN='seven1-2jn.pages.dev'
KEY='83d34f87945b3ee6beb382d9c7b1d2f9'
curl -s https://$DOMAIN/${KEY}.txt
# 출력: 83d34f87945b3ee6beb382d9c7b1d2f9 (키와 동일해야 함)
```

## 🚦 자동 실행 흐름

1. `git push` 후 60~90초 대기 (CF Pages 배포)
2. 키 파일 fetch 검증 (200 + 본문 일치)
3. IndexNow 핑 발사 (단일 또는 다중 URL)
4. 응답 코드 확인 (200/202면 성공)
5. Bing Webmaster Tools에서 24시간 내 인덱싱 확인 (사용자 안내)

## 🧠 함정

- **키 파일 위치 잘못** → 루트가 아니면 검증 실패. `https://<domain>/<key>.txt` 풀 fetch 가능해야 함
- **CF 캐시** → 키 파일 변경 후 `_headers`에 `/<key>.txt`도 짧은 캐시 (1시간) 권장
- **Rate limit** — 1일 1만 URL 한도. 단일 페이지 사이트는 무시 가능
- **`urlList`의 도메인이 `host`와 다름** → 422 에러. www/non-www 통일
- **네이버는 IndexNow 직접 지원 X** — 네이버는 별도 서치어드바이저 수동 제출 필요 (`search-console` 스킬)
