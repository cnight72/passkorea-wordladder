# PassKorea 쇼츠 렌더러

앱 어휘 데이터(`src/data/vocab`)로 EPS-TOPIK 단어 퀴즈 쇼츠 mp4를 찍어낸다.
문항을 새로 쓰지 않고 **앱이 쓰는 것과 같은 함수**(`buildVocabQuiz`)로 만들기 때문에,
영상에 나온 단어는 앱에도 반드시 있다. 딥링크가 항상 살아 있다는 뜻이다.

앱 번들과는 완전히 분리돼 있다. 이 폴더의 의존성은 앱 배포에 들어가지 않는다.

## 쓰는 법

```powershell
cd video
npm install          # 처음 한 번만

npm run queue -- --count=10 --theme=basic   # 대기열 뽑기 → out/queue.json
npm run render                               # 전부 mp4 로 → out/mp4/
```

주제는 `all`, `basic`, `living`, `health`, `public`, `culture`, `workplace`,
`worksite`, `trade`, `safety`, `system`.

미리 보면서 디자인을 고치려면:

```powershell
npm run studio
```

## 배경 이미지

`public/backgrounds/` 에 넣으면 자동으로 잡힌다. 주제별 기본 파일명은
`scripts/build-queue.ts` 의 `BACKGROUND_BY_THEME` 에 있다.

```
street.jpg  home.jpg  hospital.jpg  office.jpg  hanok.jpg  factory.jpg
```

**편당 1장씩 새로 만들지 말 것.** 6~10장을 돌려쓰면 충분하다.
시청자는 배경을 보지 않는다. 1080×1920 이상이면 된다.

파일이 없으면 브랜드 그라데이션으로 렌더된다. 그것만으로도 쓸 만하다.

## 중복 방지

이미 영상으로 만든 단어는 `used.json` 에 쌓이고 다음 배치에서 자동 제외된다.
한 바퀴 다 돌아 소진되면 이 파일을 비운다.

## 24초 구성

| 구간 | 프레임 | 내용 |
|---|---|---|
| 훅 | 0–90 | 단어 등장 |
| 보기 | 90–150 | A~D 순차 등장 |
| 카운트다운 | 150–510 | 12초 |
| 정답 | 510–630 | 오답 흐려지고 정답만 |
| CTA | 630–720 | pass-korea.com |

경계는 `src/schema.ts` 의 `SCENE` 한 곳에서 바꾼다.

## 라이선스

Remotion 은 개인·4인 미만 회사는 무료, 그 이상은 회사 라이선스가 필요하다.
<https://remotion.dev/license>
