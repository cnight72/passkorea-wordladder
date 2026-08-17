// 자동 생성 파일 — 직접 수정하지 마세요.
import type { RawExamQuestion } from './types';

export type IndustryId =
  | 'machinery'
  | 'metal'
  | 'electronics'
  | 'chemical'
  | 'textile'
  | 'food'
  | 'wood'
  | 'rubber';

export interface Industry {
  id: IndustryId;
  korean: string;
  english: string;
  emoji: string;
  /** 수록 문항 수 */
  count: number;
}

/** 고용허가제 8개 제조 업종 */
export const INDUSTRIES: Industry[] = [
  { id: 'machinery', korean: "기계·금형 제조업", english: "Machinery & Molding", emoji: '⚙️', count: 165 },
  { id: 'metal', korean: "금속·금속제품 제조업", english: "Metal Products", emoji: '🔩', count: 165 },
  { id: 'electronics', korean: "전기·전자제품 제조업", english: "Electronics & Electricity", emoji: '🔌', count: 144 },
  { id: 'chemical', korean: "화학물·화학제품 제조업", english: "Chemicals", emoji: '🧪', count: 161 },
  { id: 'textile', korean: "섬유·의복 제조업", english: "Textile & Sewing", emoji: '🧵', count: 181 },
  { id: 'food', korean: "음식료품 제조업", english: "Food Products", emoji: '🍱', count: 191 },
  { id: 'wood', korean: "종이·목재 제조업", english: "Pulp, Paper & Wood", emoji: '🪵', count: 185 },
  { id: 'rubber', korean: "고무·플라스틱 제조업", english: "Rubber & Plastic", emoji: '🧴', count: 170 },
];

export interface ExamQuestion {
  id: string;
  industry: IndustryId;
  number: number;
  question: string;
  choices: string[];
  /** choices 안에서 정답 위치 */
  answer: number;
}

/** 업종별 문항은 번들을 나눠 필요할 때만 내려받는다. */
const loaders: Record<IndustryId, () => Promise<{ default: RawExamQuestion[] }>> = {
  machinery: () => import('./machinery'),
  metal: () => import('./metal'),
  electronics: () => import('./electronics'),
  chemical: () => import('./chemical'),
  textile: () => import('./textile'),
  food: () => import('./food'),
  wood: () => import('./wood'),
  rubber: () => import('./rubber'),
};

export function getIndustry(id: IndustryId): Industry | undefined {
  return INDUSTRIES.find((i) => i.id === id);
}

export const TOTAL_QUESTIONS = INDUSTRIES.reduce((sum, i) => sum + i.count, 0);

/** 'machinery-12' 형태의 딥링크 식별자로 문항 하나를 찾는다. */
export async function loadQuestionById(id: string): Promise<ExamQuestion | null> {
  const dash = id.lastIndexOf('-');
  if (dash < 0) return null;

  const industry = id.slice(0, dash) as IndustryId;
  if (!(industry in loaders)) return null;

  const questions = await loadQuestions(industry);
  return questions.find((q) => q.id === id) ?? null;
}

export async function loadQuestions(industry: IndustryId): Promise<ExamQuestion[]> {
  const mod = await loaders[industry]();
  return mod.default.map((raw) => ({
    id: `${industry}-${raw.n}`,
    industry,
    number: raw.n,
    question: raw.q,
    choices: raw.c,
    answer: raw.a,
  }));
}
