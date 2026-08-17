/**
 * 앱 어휘 데이터에서 쇼츠 대기열을 뽑는다.
 *
 *   npm run queue -- --count=10 --theme=basic                    한국어 단어 → 영어 뜻
 *   npm run queue -- --count=10 --theme=basic --format=category  한국어 문제 → 한국어 보기
 *
 * 이미 영상으로 만든 단어는 used.json 에 쌓아두고 다음 배치에서 제외한다.
 * 문항을 새로 쓰는 게 아니라 앱이 이미 쓰고 있는 데이터로 만드는 것이라,
 * 영상에 나온 단어가 앱에도 반드시 존재한다.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { VocabEntry } from '../../src/data/vocab';
import {
  AVAILABLE_THEMES,
  buildVocabQuiz,
  getSection,
  loadVocab,
  themeOfSection,
} from '../../src/data/vocab';
import type { CategoryQuestion, ShortQuestion } from '../src/schema';

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

interface Category {
  ko: string;
  en: string;
  words: string[];
}

function arg(name: string, fallback: string): string {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
}

function loadList(file: string): Set<string> {
  const path = join(VIDEO_DIR, file);
  if (!existsSync(path)) return new Set();
  try {
    return new Set(JSON.parse(readFileSync(path, 'utf8')) as string[]);
  } catch {
    // 파일이 깨졌으면 처음부터 다시 세는 편이 낫다
    return new Set();
  }
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 단어가 소단원 이름의 형태소를 품고 있는지 본다.
 * '색깔'에 '하얀색', '전자제품'에 '전자레인지'처럼 겹치면 문제를 읽는 순간 답이 보인다.
 * 오답 쪽에서도 걸러야 한다. 겹치면 정답이 둘이 되기 때문이다.
 */
function givesItAway(word: string, sectionKorean: string): boolean {
  const name = sectionKorean.replace(/\s/g, '');
  if (name.length <= 3) return [...name].some((ch) => word.includes(ch));

  for (let i = 0; i + 2 <= name.length; i++) {
    if (word.includes(name.slice(i, i + 2))) return true;
  }
  return false;
}

/** '신체 및 증상 1' 처럼 교재가 붙인 연번은 문제 문장에서 걸리적거린다 */
function cleanName(name: string): string {
  return name.replace(/\s+(\d+|I{1,3})$/, '');
}

function backgroundFor(section: string): string | undefined {
  const themeId = themeOfSection(section)?.id ?? 'basic';
  const file = BACKGROUND_BY_THEME[themeId];
  return file && existsSync(join(BACKGROUND_DIR, file)) ? file : undefined;
}

/** 한국어 단어 → 영어 뜻 */
async function buildVocabQueue(
  count: number,
  theme: string,
  skip: Set<string>
): Promise<ShortQuestion[]> {
  // 소단원 제외는 뽑은 뒤에 걸러야 해서, 필요한 수보다 넉넉히 뽑아 온다
  const questions = (await buildVocabQuiz(count * 4, theme, skip))
    .filter((q) => !EXCLUDED_SECTIONS.has(q.entry.section))
    .slice(0, count);

  return questions.map((q) => {
    const background = backgroundFor(q.entry.section);
    return {
      id: `vocab-${q.entry.word}`,
      word: q.entry.word,
      choices: q.choices,
      answerIndex: q.answerIndex,
      topic: getSection(q.entry.section)?.english ?? q.entry.section,
      ...(background ? { background } : {}),
      cta: CTA,
    };
  });
}

/**
 * 한국어 문제 → 한국어 보기.
 *
 * 분류는 categories.json 에서만 가져온다. 교재 소단원을 그대로 쓰면
 * '음식의 맛' 안의 '다니다'처럼 분류에 안 맞는 단어가 정답으로 나온다.
 * 오답도 다른 분류에서만 뽑으므로 정답이 둘이 될 수 없다.
 */
async function buildCategoryQueue(
  count: number,
  skip: Set<string>
): Promise<CategoryQuestion[]> {
  const all = await loadVocab();
  const bySection = new Map(all.map((e) => [e.word, e]));

  const file = JSON.parse(readFileSync(join(VIDEO_DIR, 'categories.json'), 'utf8')) as {
    categories: Category[];
  };

  // 분류표에 적었는데 어휘 데이터에 없는 단어는 조용히 넘기지 말고 알린다
  const missing = file.categories.flatMap((c) => c.words.filter((w) => !bySection.has(w)));
  if (missing.length) console.log(`분류표에만 있고 어휘에 없는 단어: ${missing.join(', ')}\n`);

  const categories = file.categories
    .map((c) => ({ ...c, words: c.words.filter((w) => bySection.has(w)) }))
    .filter((c) => c.words.length > 0);

  const questions: CategoryQuestion[] = [];
  const usedCategories = new Set<string>();
  /** 한 배치 안에서 같은 오답이 계속 나오면 대충 만든 티가 난다 */
  const usedChoices = new Set<string>();

  for (const category of shuffle(categories)) {
    if (questions.length >= count) break;
    // 한 배치에서 같은 분류를 두 번 내면 단조로워진다
    if (usedCategories.has(category.ko)) continue;

    const candidates = category.words.filter(
      (w) => !skip.has(w) && !givesItAway(w, category.ko)
    );
    if (candidates.length === 0) continue;

    const answer = shuffle(candidates)[0];
    // 오답은 다른 분류에서만. 분류 하나당 하나씩 뽑아 서로도 겹치지 않게 한다.
    const distractors = shuffle(categories.filter((c) => c.ko !== category.ko))
      .slice(0, 3)
      .map(
        (c) =>
          shuffle(
            c.words.filter((w) => !givesItAway(w, category.ko) && !usedChoices.has(w))
          )[0] ?? shuffle(c.words.filter((w) => !givesItAway(w, category.ko)))[0]
      )
      .filter(Boolean);
    if (distractors.length < 3) continue;

    const choices = shuffle([answer, ...distractors]);
    for (const c of choices) usedChoices.add(c);
    const entry = bySection.get(answer)!;
    const background = backgroundFor(entry.section);

    usedCategories.add(category.ko);
    questions.push({
      id: `cat-${answer}`,
      question: `다음 중 '${category.ko}'에 해당하는 단어는?`,
      questionEn: `Which word belongs to '${category.en}'?`,
      choices,
      answerIndex: choices.indexOf(answer),
      answerEn: entry.english,
      word: answer,
      topic: category.en,
      ...(background ? { background } : {}),
      cta: CTA,
    });
  }

  return questions;
}

async function main() {
  const count = Number(arg('count', '10'));
  const theme = arg('theme', 'all');
  const format = arg('format', 'vocab');

  if (format !== 'vocab' && format !== 'category') {
    console.error(`알 수 없는 형식: ${format} (vocab | category)`);
    process.exit(1);
  }
  if (theme !== 'all' && !AVAILABLE_THEMES.some((t) => t.id === theme)) {
    console.error(`알 수 없는 주제: ${theme}`);
    console.error(`가능한 값: all, ${AVAILABLE_THEMES.map((t) => t.id).join(', ')}`);
    process.exit(1);
  }

  const used = loadList('used.json');
  const skip = new Set([...used, ...loadList('blocklist.json')]);

  const queue =
    format === 'category'
      ? await buildCategoryQueue(count, skip)
      : await buildVocabQueue(count, theme, skip);

  if (queue.length === 0) {
    console.error(`'${theme}' 주제의 단어를 모두 소진했습니다. video/used.json 을 비우면 다시 돕니다.`);
    process.exit(1);
  }
  if (queue.length < count) {
    console.log(`남은 단어가 부족해 ${queue.length}편만 뽑았습니다.\n`);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2), 'utf8');
  for (const q of queue) used.add(q.word);
  writeFileSync(USED_PATH, JSON.stringify([...used], null, 2), 'utf8');

  console.log(`대기열 ${queue.length}편 (${format}) → out/queue.json`);
  for (const q of queue) {
    console.log(
      'question' in q ? `  ${q.question}  →  ${q.word}` : `  ${q.word} — ${q.choices[q.answerIndex]}`
    );
  }
  console.log(`\n누적 사용 단어 ${used.size}개 (video/used.json)`);
  console.log('마음에 안 드는 단어는 video/blocklist.json 에 넣고 다시 뽑으세요.');
  if (!queue.some((q) => q.background)) {
    console.log('배경 이미지가 없어 그라데이션으로 렌더됩니다. video/public/backgrounds/ 참고.');
  }
}

void main();
