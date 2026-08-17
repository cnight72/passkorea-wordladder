/** EPS-TOPIK 표준교재(24년 개정판)의 어휘 항목 */
export interface VocabEntry {
  /** 한국어 표제어 */
  word: string;
  /** 교재에 병기된 영어 뜻 */
  english: string;
  /** 소단원 번호 (예: '31-1') */
  section: string;
}

/** 교재 소단원 */
export interface Section {
  id: string;
  korean: string;
  english: string;
}

/** 홈 화면에 노출할 주제 묶음 */
export interface Theme {
  id: string;
  korean: string;
  english: string;
  emoji: string;
  /** 이 묶음에 속한 단원 번호 (1~60) */
  units: number[];
}

export const THEMES: Theme[] = [
  { id: 'basic', korean: '기초 생활', english: 'Everyday Basics', emoji: '🏠', units: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { id: 'living', korean: '생활 실무', english: 'Daily Living', emoji: '🛒', units: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
  { id: 'health', korean: '병원·건강', english: 'Health & Hospital', emoji: '🏥', units: [21, 22] },
  { id: 'public', korean: '공공기관', english: 'Public Services', emoji: '🏛️', units: [23, 24, 25] },
  { id: 'culture', korean: '한국 문화', english: 'Korean Culture', emoji: '🎎', units: [26, 27, 28, 29, 30] },
  { id: 'workplace', korean: '직장 생활', english: 'Workplace Life', emoji: '👷', units: [31, 32, 33, 34] },
  { id: 'worksite', korean: '작업 현장', english: 'Work Site', emoji: '🏭', units: [35, 36, 37, 38, 39, 40] },
  { id: 'trade', korean: '업종별 전문', english: 'Trade Skills', emoji: '🔧', units: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52] },
  { id: 'safety', korean: '안전 표지', english: 'Safety Signs', emoji: '⚠️', units: [53, 54, 55, 56] },
  { id: 'system', korean: '고용·체류 제도', english: 'Employment System', emoji: '📄', units: [57, 58, 59, 60] },
];

/** '31-1' 에서 단원 번호 31을 얻는다 */
export function unitOf(section: string): number {
  return Number(section.split('-')[0]);
}
