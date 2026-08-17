import type { Section, Theme, VocabEntry } from './types';
import { THEMES, unitOf } from './types';
import { SECTIONS, THEME_WORD_COUNTS, TOTAL_WORDS } from './summary';

export type { Section, Theme, VocabEntry };
export { THEMES, unitOf, SECTIONS, TOTAL_WORDS };

/** 어휘 본문은 용량이 커서 퀴즈를 시작할 때 내려받는다. */
const loaders = [
  () => import('./units01-10'),
  () => import('./units11-20'),
  () => import('./units21-30'),
  () => import('./units31-40'),
  () => import('./units41-50'),
  () => import('./units51-60'),
];

let cache: VocabEntry[] | null = null;

export async function loadVocab(): Promise<VocabEntry[]> {
  if (!cache) {
    const mods = await Promise.all(loaders.map((load) => load()));
    cache = mods.flatMap((m) => m.default);
  }
  return cache;
}

const SECTION_MAP = new Map(SECTIONS.map((s) => [s.id, s]));

export function getSection(id: string): Section | undefined {
  return SECTION_MAP.get(id);
}

const THEME_OF_UNIT = new Map<number, Theme>();
for (const theme of THEMES) {
  for (const unit of theme.units) THEME_OF_UNIT.set(unit, theme);
}

export function themeOfSection(sectionId: string): Theme | undefined {
  return THEME_OF_UNIT.get(unitOf(sectionId));
}

export type ThemeId = string;

function filterByTheme(all: VocabEntry[], themeId: ThemeId | 'all'): VocabEntry[] {
  if (themeId === 'all') return all;
  return all.filter((e) => themeOfSection(e.section)?.id === themeId);
}

/** 어휘가 실제로 들어 있는 주제만 (교재 1권은 아직 미입력) */
export const AVAILABLE_THEMES: Array<Theme & { count: number }> = THEMES.map((t) => ({
  ...t,
  count: THEME_WORD_COUNTS[t.id] ?? 0,
})).filter((t) => t.count > 0);

export interface VocabQuestion {
  entry: VocabEntry;
  /** 영어 뜻 보기 4개 */
  choices: string[];
  /** choices 안에서 정답 위치 */
  answerIndex: number;
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
 * 사지선다 문제를 만든다.
 * 오답은 같은 소단원 → 같은 주제 → 전체 순으로 골라 변별력을 유지한다.
 * 표제어는 전 범위에서 유일하므로 한 단어에 정답이 둘일 일은 없다.
 */
export async function buildVocabQuiz(
  count: number,
  themeId: ThemeId | 'all'
): Promise<VocabQuestion[]> {
  const all = await loadVocab();
  const pool = filterByTheme(all, themeId);
  const selected = shuffle(pool).slice(0, Math.min(count, pool.length));

  return selected.map((entry) => {
    const sameSection = all.filter((e) => e.section === entry.section && e.english !== entry.english);
    const themeOf = themeOfSection(entry.section)?.id;
    const sameTheme = all.filter(
      (e) => themeOfSection(e.section)?.id === themeOf && e.section !== entry.section
    );
    const others = all.filter((e) => themeOfSection(e.section)?.id !== themeOf);

    const distractors = [...shuffle(sameSection), ...shuffle(sameTheme), ...shuffle(others)].reduce<string[]>(
      (acc, e) => {
        if (acc.length < 3 && e.english !== entry.english && !acc.includes(e.english)) acc.push(e.english);
        return acc;
      },
      []
    );

    const choices = shuffle([entry.english, ...distractors]);
    return { entry, choices, answerIndex: choices.indexOf(entry.english) };
  });
}
