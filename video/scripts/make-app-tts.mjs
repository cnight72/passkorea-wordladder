/**
 * 퀴즈 앱에서 단어를 읽어 줄 mp3 를 미리 만든다.
 *
 *   node scripts/make-app-tts.mjs                    basic+living (1~20과)
 *   node scripts/make-app-tts.mjs --units=01-10      한 묶음만
 *   node scripts/make-app-tts.mjs --units=all        전체 60과
 *   node scripts/make-app-tts.mjs --force            이미 있어도 다시
 *
 * 영상과 같은 목소리(ko-KR-SunHiNeural)를 쓴다. 출력은 **앱의** public/tts/ 이고
 * 영상 파이프라인의 video/public/tts/ 와는 별개다(파일명 규칙도 다르다 —
 * 영상은 `vocab-물.mp3`, 앱은 `물.mp3`).
 *
 * **이 스크립트는 video/ 안에 있어야 한다.** msedge-tts 가 video/node_modules 에
 * 설치돼 있어서, 밖에 두면 ERR_MODULE_NOT_FOUND 가 난다(cwd 와 무관하다).
 *
 * 생성은 빌드 전 한 번뿐이므로 런타임에는 Edge TTS 에 의존하지 않는다.
 * 마이크로소프트가 이 비공식 접근을 막아도 이미 만든 파일은 그대로 돈다.
 *
 * 비트레이트는 영상용(96k)보다 낮은 48k 다. 낱말 하나짜리 음성이라 차이가 거의
 * 없는데 용량은 절반이고, 폰 데이터로 내려받는 파일이기 때문이다.
 */
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import { createWriteStream, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const APP_DIR = join(HERE, '..', '..');
const VOCAB_DIR = join(APP_DIR, 'src', 'data', 'vocab');
const OUT_DIR = join(APP_DIR, 'public', 'tts');

const ALL_UNITS = ['01-10', '11-20', '21-30', '31-40', '41-50', '51-60'];

function arg(name, fallback) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
}

const voice = arg('voice', 'ko-KR-SunHiNeural');
const force = process.argv.includes('--force');
const unitsArg = arg('units', '01-10,11-20');
const units = unitsArg === 'all' ? ALL_UNITS : unitsArg.split(',');

/** 파일 이름으로 쓸 수 없는 글자가 든 단어는 건너뛴다 (지금은 없지만 방어용) */
const UNSAFE = /[\\/:*?"<>|]/;

/**
 * .ts 를 그대로 import 할 수 없어 `word: '...'` 를 뽑아 쓴다.
 * 데이터 파일이라 형태가 일정하다: { word: '물', english: 'water', section: '1-1' },
 */
function wordsOf(unit) {
  const path = join(VOCAB_DIR, `units${unit}.ts`);
  const src = readFileSync(path, 'utf8');
  return [...src.matchAll(/\bword:\s*'([^']+)'/g)].map((m) => m[1]);
}

const words = [];
const seen = new Set();
for (const unit of units) {
  for (const w of wordsOf(unit)) {
    if (seen.has(w)) continue;
    seen.add(w);
    if (UNSAFE.test(w)) {
      console.log(`  건너뜀(파일명 불가): ${w}`);
      continue;
    }
    words.push(w);
  }
}

const limit = Number(arg('limit', '0'));
if (limit > 0) words.length = Math.min(words.length, limit);

mkdirSync(OUT_DIR, { recursive: true });

const format =
  OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3 ?? OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3;

let tts = null;
async function connect() {
  tts = new MsEdgeTTS();
  await tts.setMetadata(voice, format);
}
await connect();

/** 689개를 연달아 요청하면 중간에 끊길 수 있다. 끊기면 다시 붙어서 이어간다. */
async function speak(word) {
  const path = join(OUT_DIR, `${word}.mp3`);
  if (!force && existsSync(path) && statSync(path).size > 0) return 'skip';

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const { audioStream } = tts.toStream(word, { rate: '-15%' });
      await pipeline(audioStream, createWriteStream(path));
      if (statSync(path).size > 0) return 'made';
      throw new Error('빈 파일');
    } catch (err) {
      console.log(`  재시도 ${attempt}/3 — ${word}: ${err.message}`);
      try {
        tts.close();
      } catch {
        /* 이미 닫혔으면 무시 */
      }
      await new Promise((r) => setTimeout(r, 1000 * attempt));
      await connect();
    }
  }
  return 'fail';
}

console.log(`${words.length}개 대상 (${units.join(', ')}과) → public/tts/`);

let made = 0;
let skipped = 0;
const failed = [];

for (let i = 0; i < words.length; i += 1) {
  const word = words[i];
  const result = await speak(word);
  if (result === 'made') made += 1;
  else if (result === 'skip') skipped += 1;
  else failed.push(word);

  if ((i + 1) % 50 === 0) console.log(`  ... ${i + 1}/${words.length}`);
}

try {
  tts.close();
} catch {
  /* 이미 닫혔으면 무시 */
}

console.log('');
console.log(`생성 ${made} / 건너뜀 ${skipped} / 실패 ${failed.length}`);
if (failed.length) console.log(`실패: ${failed.join(', ')}`);
