/**
 * out/queue.json 의 한국어 발음을 public/tts/ 에 만든다.
 *
 *   npm run tts                 없는 것만 생성
 *   npm run tts -- --force      이미 있어도 다시 생성
 *   npm run tts -- --voice=ko-KR-InJoonNeural
 *
 * Windows 내장 Heami(make-tts.ps1) 를 대체한다. Heami 는 비음이 섞여 학습용
 * 발음으로 쓰기 아쉬웠다. 여기 쓰는 Edge 신경망 음성은 무료이고 계정도 필요 없다.
 *
 * 되돌리려면 make-tts.ps1 이 그대로 남아 있다. 마이크로소프트가 이 비공식 접근을
 * 막으면 그쪽으로 돌아가면 된다 — 그때는 render.mjs 가 wav 를 찾으므로 그대로 동작한다.
 *
 * render.mjs 는 public/tts/{id}.mp3 와 {id}-q.mp3 를 찾아 붙인다(wav 도 계속 인식한다).
 * queue.json 은 건드리지 않는다.
 */
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import { createWriteStream, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const VIDEO_DIR = join(HERE, '..');
const QUEUE_PATH = join(VIDEO_DIR, 'out', 'queue.json');
const TTS_DIR = join(VIDEO_DIR, 'public', 'tts');

function arg(name, fallback) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
}

const voice = arg('voice', 'ko-KR-SunHiNeural');
const force = process.argv.includes('--force');

if (!existsSync(QUEUE_PATH)) {
  console.error('out/queue.json 이 없습니다. 먼저 `npm run queue` 를 실행하세요.');
  process.exit(1);
}

const queue = JSON.parse(readFileSync(QUEUE_PATH, 'utf8'));
mkdirSync(TTS_DIR, { recursive: true });

const tts = new MsEdgeTTS();
await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);

/**
 * 낱말은 천천히 읽어야 알아듣는다. 문장은 느리게 읽으면 오히려 부자연스럽다.
 * Heami 시절 rate -2 / 0 을 나눠 쓰던 것과 같은 이유다.
 */
async function speak(text, file, rate) {
  const path = join(TTS_DIR, file);
  if (!force && existsSync(path)) return false;

  const { audioStream } = tts.toStream(text, { rate });
  await pipeline(audioStream, createWriteStream(path));
  console.log(`  ${file}`);
  return true;
}

let made = 0;
for (const q of queue) {
  if (await speak(q.word, `${q.id}.mp3`, '-15%')) made += 1;

  // 한국어 문제 형식은 질문 문장도 읽어 준다
  if (q.question && (await speak(q.question, `${q.id}-q.mp3`, 'default'))) made += 1;
}

tts.close();

console.log('');
console.log(`${made}개 생성 (${voice}) → public/tts/`);
if (made === 0) console.log('이미 다 있습니다. 다시 만들려면 --force 를 붙이세요.');
