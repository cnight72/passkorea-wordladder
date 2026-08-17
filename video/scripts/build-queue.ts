/**
 * 앱 어휘 데이터에서 쇼츠 대기열을 뽑는다.
 *
 *   npm run queue -- --count=10 --theme=safety
 *
 * 이미 영상으로 만든 단어는 used.json 에 쌓아두고 다음 배치에서 제외한다.
 * 문항을 새로 쓰는 게 아니라 앱이 이미 쓰고 있는 것과 같은 로직으로 만드는 것이라,
 * 영상에 나온 문항이 앱에도 반드시 존재한다.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AVAILABLE_THEMES, buildVocabQuiz, getSection, themeOfSection } from '../../src/data/vocab';
import type { ShortQuestion } from '../src/schema';

const HERE = dirname(fileURLToPath(import.meta.url));
const VIDEO_DIR = join(HERE, '..');
const OUT_DIR = join(VIDEO_DIR, 'out');
const QUEUE_PATH = join(OUT_DIR, 'queue.json');
/** out/ 은 산출물이라 버려도 되지만, 이미 영상으로 만든 단어 목록은 남아야 한다 */
const USED_PATH = join(VIDEO_DIR, 'used.json');
const BACKGROUND_DIR = join(VIDEO_DIR, 'public', 'backgrounds');

/** 주제별 기본 배경. 파일이 있으면 쓰고 없으면 그라데이션으로 떨어진다. */
const BACKGROUND_BY_THEME: Record<string, string> = {
  basic: 'street.jpg',
  living: 'home.jpg',
  health: 'hospital.jpg',
  public: 'office.jpg',
  culture: 'hanok.jpg',
  workplace: 'office.jpg',
  worksite: 'factory.jpg',
  trade: 'factory.jpg',
  safety: 'factory.jpg',
  system: 'office.jpg',
};

const CTA = 'pass-korea.com';

/**
 * 쇼츠로 만들면 안 되는 소단원.
 * 1-1 나라 이름  — 라오스/캄보디아처럼 음차라 보자마자 답이 보인다
 * 9-2 숫자와 분류사 — 권·개·명 같은 조수사는 그림이 안 그려지고 보기가 서로 비슷하다
 * 앱 안에서는 멀쩡한 문제지만 24초 영상의 훅으로는 못 쓴다.
 */
const EXCLUDED_SECTIONS = new Set(['1-1', '9-2']);

/** 사람이 보고 걸러낸 단어. 한 번 넣으면 다시는 안 뽑힌다. */
function loadBlocklist(): Set<string> {
  const path = join(VIDEO_DIR, 'blocklist.json');
  if (!existsSync(path)) return new Set();
  try {
    return new Set(JSON.parse(readFileSync(path, 'utf8')) as string[]);
  } catch {
    return new Set();
  }
}

function arg(name: string, fallback: string): string {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
}

function loadUsed(): Set<string> {
  if (!existsSync(USED_PATH)) return new Set();
  try {
    return new Set(JSON.parse(readFileSync(USED_PATH, 'utf8')) as string[]);
  } catch {
    // 파일이 깨졌으면 처음부터 다시 세는 편이 낫다
    return new Set();
  }
}

async function main() {
  const count = Number(arg('count', '10'));
  const theme = arg('theme', 'all');

  if (theme !== 'all' && !AVAILABLE_THEMES.some((t) => t.id === theme)) {
    console.error(`알 수 없는 주제: ${theme}`);
    console.error(`가능한 값: all, ${AVAILABLE_THEMES.map((t) => t.id).join(', ')}`);
    process.exit(1);
  }

  const used = loadUsed();
  const skip = new Set([...used, ...loadBlocklist()]);

  // 소단원 제외는 뽑은 뒤에 걸러야 해서, 필요한 수보다 넉넉히 뽑아 온다
  const questions = (await buildVocabQuiz(count * 4, theme, skip))
    .filter((q) => !EXCLUDED_SECTIONS.has(q.entry.section))
    .slice(0, count);

  if (questions.length === 0) {
    console.error(`'${theme}' 주제의 단어를 모두 소진했습니다. video/used.json 을 비우면 다시 돕니다.`);
    process.exit(1);
  }
  if (questions.length < count) {
    console.log(`남은 단어가 부족해 ${questions.length}편만 뽑았습니다.\n`);
  }

  const queue: ShortQuestion[] = questions.map((q) => {
    const themeId = themeOfSection(q.entry.section)?.id ?? 'basic';
    const background = BACKGROUND_BY_THEME[themeId];
    const hasBackground = background && existsSync(join(BACKGROUND_DIR, background));

    return {
      id: `vocab-${q.entry.word}`,
      word: q.entry.word,
      choices: q.choices,
      answerIndex: q.answerIndex,
      topic: getSection(q.entry.section)?.english ?? themeId,
      ...(hasBackground ? { background } : {}),
      cta: CTA,
    };
  });

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2), 'utf8');
  for (const q of queue) used.add(q.word);
  writeFileSync(USED_PATH, JSON.stringify([...used], null, 2), 'utf8');

  console.log(`대기열 ${queue.length}편 → out/queue.json`);
  console.log(queue.map((q) => `  ${q.word} — ${q.choices[q.answerIndex]}`).join('\n'));
  console.log(`\n누적 사용 단어 ${used.size}개 (video/used.json)`);
  console.log('마음에 안 드는 단어는 video/blocklist.json 에 넣고 다시 뽑으세요.');
  if (!queue.some((q) => q.background)) {
    console.log('배경 이미지가 없어 그라데이션으로 렌더됩니다. video/public/backgrounds/ 참고.');
  }
}

void main();
