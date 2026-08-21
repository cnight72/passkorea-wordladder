/**
 * out/queue.json 을 한 편씩 mp4 로 렌더한다.
 *
 *   npm run render
 *
 * 번들은 한 번만 만들고 문항마다 프롭만 갈아끼운다. 편당 비용이 거의 렌더링뿐이라
 * 10편을 한 번에 돌리는 게 1편씩 열 번 돌리는 것보다 훨씬 빠르다.
 */
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const VIDEO_DIR = join(HERE, '..');
const QUEUE_PATH = join(VIDEO_DIR, 'out', 'queue.json');
const MP4_DIR = join(VIDEO_DIR, 'out', 'mp4');

if (!existsSync(QUEUE_PATH)) {
  console.error('out/queue.json 이 없습니다. 먼저 `npm run queue` 를 실행하세요.');
  process.exit(1);
}

const TTS_DIR = join(VIDEO_DIR, 'public', 'tts');

/**
 * 발음 파일이 있으면 붙인다. 없으면 소리 없이 렌더된다.
 *
 * mp3 는 make-tts.mjs(Edge 신경망 음성), wav 는 make-tts.ps1(Windows Heami)이 만든다.
 * mp3 를 먼저 찾으므로 새 엔진으로 다시 만들면 자동으로 그쪽이 쓰인다.
 */
function findAudio(base) {
  return ['mp3', 'wav'].map((ext) => `${base}.${ext}`).find((f) => existsSync(join(TTS_DIR, f)));
}

function withVoice(q) {
  const word = findAudio(q.id);
  const question = findAudio(`${q.id}-q`);
  return {
    ...q,
    ...(word ? { voice: word } : {}),
    ...(question ? { voiceQuestion: question } : {}),
  };
}

const queue = JSON.parse(readFileSync(QUEUE_PATH, 'utf8')).map(withVoice);

mkdirSync(MP4_DIR, { recursive: true });
console.log(`발음 있음 ${queue.filter((q) => q.voice).length}편 / 전체 ${queue.length}편`);

console.log(`번들 생성 중... (${queue.length}편 대기)`);
const serveUrl = await bundle({
  entryPoint: join(VIDEO_DIR, 'src', 'index.ts'),
  onProgress: () => {},
});

let done = 0;
for (const question of queue) {
  const outPath = join(MP4_DIR, `${question.id}.mp4`);

  // 한국어 문제 형식은 question 항목이 있는 것으로 구분한다
  const compositionId = question.question ? 'CategoryShort' : 'VocabShort';

  const composition = await selectComposition({
    serveUrl,
    id: compositionId,
    inputProps: question,
  });

  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    pixelFormat: 'yuv420p',
    outputLocation: outPath,
    inputProps: question,
    // 동시 렌더 수는 Remotion 이 CPU 를 보고 정하게 둔다
    onProgress: ({ progress }) => {
      process.stdout.write(`\r[${done + 1}/${queue.length}] ${question.word} ${Math.round(progress * 100)}%   `);
    },
  });

  done += 1;
  process.stdout.write(`\r[${done}/${queue.length}] ${question.word} 완료 → out/mp4/${question.id}.mp4\n`);
}

console.log(`\n${done}편 렌더 완료: video/out/mp4/`);
