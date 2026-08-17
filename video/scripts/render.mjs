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

const queue = JSON.parse(readFileSync(QUEUE_PATH, 'utf8'));
mkdirSync(MP4_DIR, { recursive: true });

console.log(`번들 생성 중... (${queue.length}편 대기)`);
const serveUrl = await bundle({
  entryPoint: join(VIDEO_DIR, 'src', 'index.ts'),
  onProgress: () => {},
});

let done = 0;
for (const question of queue) {
  const outPath = join(MP4_DIR, `${question.id}.mp4`);

  const composition = await selectComposition({
    serveUrl,
    id: 'VocabShort',
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
