export interface Cell {
  char: string; // 정답 글자
  number?: number; // 문제 번호
  isBlank: boolean; // 검은 셀
  across?: number; // 가로 문제 ID
  down?: number; // 세로 문제 ID
}

export interface Clue {
  number: number;
  text: string; // "흰 쌀 (2글자)"
  answer: string; // "밥"
  direction: 'across' | 'down';
  length: number; // 글자 수
}

export interface Crossword {
  id: number;
  difficulty: 'easy' | 'normal';
  size: 5 | 7;
  date: string;
  title: string;
  topic: string;
  chapter: string;
  grid: Cell[][];
  clues: {
    across: Clue[];
    down: Clue[];
  };
}

// ==========================================
// EASY (5x5) - 10개 퀴즈
// ==========================================

export const CROSSWORD_EASY_1: Crossword = {
  id: 1,
  difficulty: 'easy',
  size: 5,
  date: '2026-08-17',
  title: '음식 1',
  topic: '음식',
  chapter: '14과-15과',
  grid: [
    [
      { char: '밥', number: 1, isBlank: false, across: 1, down: 1 },
      { char: '국', number: 2, isBlank: false, across: 1, down: 2 },
      { char: '떡', number: 3, isBlank: false, across: 2, down: 3 },
      { char: '', isBlank: true },
      { char: '', isBlank: true },
    ],
    [
      { char: '눈', number: 4, isBlank: false, across: 3, down: 1 },
      { char: '고', number: 5, isBlank: false, across: 3, down: 2 },
      { char: '기', number: 6, isBlank: false, across: 3, down: 3 },
      { char: '', isBlank: true },
      { char: '', isBlank: true },
    ],
    [
      { char: '손', number: 7, isBlank: false, across: 4, down: 1 },
      { char: '금', number: 8, isBlank: false, across: 4, down: 2 },
      { char: '지', number: 9, isBlank: false, across: 4, down: 3 },
      { char: '', isBlank: true },
      { char: '', isBlank: true },
    ],
    [{ char: '', isBlank: true }, { char: '', isBlank: true }, { char: '', isBlank: true }, { char: '', isBlank: true }, { char: '', isBlank: true }],
    [{ char: '', isBlank: true }, { char: '', isBlank: true }, { char: '', isBlank: true }, { char: '', isBlank: true }, { char: '', isBlank: true }],
  ],
  clues: {
    across: [
      { number: 1, text: '흰 쌀 (2글자)', answer: '밥', direction: 'across', length: 2 },
      { number: 2, text: '국물 음식 (2글자)', answer: '국', direction: 'across', length: 2 },
      { number: 3, text: '고기 요리 (2글자)', answer: '고기', direction: 'across', length: 2 },
      { number: 4, text: '신체 부위 (2글자)', answer: '손', direction: 'across', length: 2 },
    ],
    down: [
      { number: 1, text: '얼굴의 기관 (2글자)', answer: '눈', direction: 'down', length: 2 },
      { number: 2, text: '나라 이름 (2글자)', answer: '국', direction: 'down', length: 2 },
      { number: 3, text: '신선한 채소 (2글자)', answer: '기', direction: 'down', length: 2 },
    ],
  },
};

export const CROSSWORD_EASY_2: Crossword = {
  id: 2,
  difficulty: 'easy',
  size: 5,
  date: '2026-08-18',
  title: '신체 부위',
  topic: '신체',
  chapter: '1과-3과',
  grid: [
    [
      { char: '머', number: 1, isBlank: false, across: 1, down: 1 },
      { char: '리', number: 2, isBlank: false, across: 1, down: 2 },
      { char: '', isBlank: true },
      { char: '', isBlank: true },
      { char: '', isBlank: true },
    ],
    [
      { char: '얼', number: 3, isBlank: false, across: 2, down: 1 },
      { char: '굴', number: 4, isBlank: false, across: 2, down: 2 },
      { char: '', isBlank: true },
      { char: '', isBlank: true },
      { char: '', isBlank: true },
    ],
    [
      { char: '입', number: 5, isBlank: false, across: 3, down: 1 },
      { char: '', isBlank: true },
      { char: '', isBlank: true },
      { char: '', isBlank: true },
      { char: '', isBlank: true },
    ],
    [{ char: '', isBlank: true }, { char: '', isBlank: true }, { char: '', isBlank: true }, { char: '', isBlank: true }, { char: '', isBlank: true }],
    [{ char: '', isBlank: true }, { char: '', isBlank: true }, { char: '', isBlank: true }, { char: '', isBlank: true }, { char: '', isBlank: true }],
  ],
  clues: {
    across: [
      { number: 1, text: '머리 위 (2글자)', answer: '머리', direction: 'across', length: 2 },
      { number: 2, text: '코와 입이 있는 곳 (2글자)', answer: '얼굴', direction: 'across', length: 2 },
      { number: 3, text: '음식을 먹는 기관 (1글자)', answer: '입', direction: 'across', length: 1 },
    ],
    down: [
      { number: 1, text: '코와 입 사이 부분 (2글자)', answer: '머', direction: 'down', length: 2 },
      { number: 2, text: '울음을 내는 기관 (1글자)', answer: '리', direction: 'down', length: 2 },
    ],
  },
};

// 간단한 버전: 3개 Easy 퀴즈로 시작
export const CROSSWORD_EASY_3: Crossword = {
  id: 3,
  difficulty: 'easy',
  size: 5,
  date: '2026-08-19',
  title: '일상용어',
  topic: '일상생활',
  chapter: '7과-10과',
  grid: [
    [
      { char: '아', number: 1, isBlank: false, across: 1, down: 1 },
      { char: '침', number: 2, isBlank: false, across: 1, down: 2 },
      { char: '대', number: 3, isBlank: false, across: 2, down: 3 },
      { char: '', isBlank: true },
      { char: '', isBlank: true },
    ],
    [
      { char: '아', number: 4, isBlank: false, across: 3, down: 1 },
      { char: '침', number: 5, isBlank: false, across: 3, down: 2 },
      { char: '대', number: 6, isBlank: false, across: 3, down: 3 },
      { char: '', isBlank: true },
      { char: '', isBlank: true },
    ],
    [
      { char: '의', number: 7, isBlank: false, across: 4, down: 1 },
      { char: '자', number: 8, isBlank: false, across: 4, down: 2 },
      { char: '', isBlank: true },
      { char: '', isBlank: true },
      { char: '', isBlank: true },
    ],
    [{ char: '', isBlank: true }, { char: '', isBlank: true }, { char: '', isBlank: true }, { char: '', isBlank: true }, { char: '', isBlank: true }],
    [{ char: '', isBlank: true }, { char: '', isBlank: true }, { char: '', isBlank: true }, { char: '', isBlank: true }, { char: '', isBlank: true }],
  ],
  clues: {
    across: [
      { number: 1, text: '아침에 자는 가구 (2글자)', answer: '침대', direction: 'across', length: 2 },
      { number: 2, text: '밤에 입는 옷 (2글자)', answer: '옷', direction: 'across', length: 2 },
      { number: 3, text: '책상 위의 물건 (1글자)', answer: '자', direction: 'across', length: 2 },
    ],
    down: [
      { number: 1, text: '아침 인사말 (2글자)', answer: '아침', direction: 'down', length: 2 },
      { number: 2, text: '무언가를 하다 (1글자)', answer: '침', direction: 'down', length: 2 },
      { number: 3, text: '큼직한 평면 (2글자)', answer: '대', direction: 'down', length: 2 },
    ],
  },
};

// MVP: 3개 Easy 퀴즈로 시작
export const CROSSWORDS_EASY = [CROSSWORD_EASY_1, CROSSWORD_EASY_2, CROSSWORD_EASY_3];

// ==========================================
// NORMAL (7x7) - 준비 중
// ==========================================

export const CROSSWORDS_NORMAL: Crossword[] = [];

// Helper functions
export const getCrosswordById = (id: number): Crossword | undefined => {
  const all = [...CROSSWORDS_EASY, ...CROSSWORDS_NORMAL];
  return all.find((cw) => cw.id === id);
};

export const getRandomCrossword = (difficulty: 'easy' | 'normal'): Crossword => {
  const puzzles = difficulty === 'easy' ? CROSSWORDS_EASY : CROSSWORDS_NORMAL;
  if (puzzles.length === 0) {
    throw new Error(`No puzzles available for difficulty: ${difficulty}`);
  }
  return puzzles[Math.floor(Math.random() * puzzles.length)];
};

export const getTodaysCrossword = (difficulty: 'easy' | 'normal'): Crossword => {
  const puzzles = difficulty === 'easy' ? CROSSWORDS_EASY : CROSSWORDS_NORMAL;
  const today = new Date().toISOString().split('T')[0];
  return puzzles.find((cw) => cw.date === today) || getRandomCrossword(difficulty);
};
