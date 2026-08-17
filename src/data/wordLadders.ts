export interface WordLadder {
  id: string;
  difficulty: 'easy' | 'normal' | 'hard' | 'expert';
  category: string;
  words: string[];
  topic: string;
  chapter: string;
}

export const WORD_LADDERS: WordLadder[] = [
  // Easy - 신체부위 (5개)
  {
    id: 'easy-body-01',
    difficulty: 'easy',
    category: '신체부위',
    words: ['눈', '손', '발'],
    topic: '기본 신체 부위',
    chapter: '1과~3과',
  },
  {
    id: 'easy-body-02',
    difficulty: 'easy',
    category: '신체부위',
    words: ['머리', '얼굴', '입'],
    topic: '얼굴 부위',
    chapter: '1과~3과',
  },
  {
    id: 'easy-body-03',
    difficulty: 'easy',
    category: '신체부위',
    words: ['팔', '손', '발가락'],
    topic: '팔과 다리',
    chapter: '1과~3과',
  },
  // Easy - 음식 (2개)
  {
    id: 'easy-food-01',
    difficulty: 'easy',
    category: '음식',
    words: ['밥', '국', '떡'],
    topic: '한국 음식',
    chapter: '6과~15과',
  },
  {
    id: 'easy-food-02',
    difficulty: 'easy',
    category: '음식',
    words: ['고기', '밥', '국'],
    topic: '음식 재료',
    chapter: '14과',
  },
  // Easy - 일상동사 (1개, 하지만 실제로는 5개 쌍이므로 조정 필요)
  // Normal로 이동

  // Normal - 직장안전 (2개)
  {
    id: 'normal-work-01',
    difficulty: 'normal',
    category: '직장안전',
    words: ['목재', '손잡이', '안전', '버튼'],
    topic: '기계 조작',
    chapter: '1과',
  },
  {
    id: 'normal-work-02',
    difficulty: 'normal',
    category: '직장안전',
    words: ['안전', '스위치', '전원'],
    topic: '안전 장비',
    chapter: '1과',
  },
  // Normal - 교통 (2개)
  {
    id: 'normal-transport-01',
    difficulty: 'normal',
    category: '교통',
    words: ['버스', '지하철', '택시'],
    topic: '대중교통',
    chapter: '18과',
  },
  {
    id: 'normal-transport-02',
    difficulty: 'normal',
    category: '교통',
    words: ['차', '기차', '비행기'],
    topic: '운송수단',
    chapter: '18과',
  },
  // Normal - 시설 (2개)
  {
    id: 'normal-place-01',
    difficulty: 'normal',
    category: '시설',
    words: ['약국', '병원', '은행'],
    topic: '도시 시설',
    chapter: '12과~28과',
  },
  {
    id: 'normal-place-02',
    difficulty: 'normal',
    category: '시설',
    words: ['역', '길', '거리'],
    topic: '위치 표현',
    chapter: '12과',
  },
  // Normal - 일상동사 (2개)
  {
    id: 'normal-verb-01',
    difficulty: 'normal',
    category: '일상동사',
    words: ['먹다', '마시다', '자다'],
    topic: '일상 활동',
    chapter: '8과~14과',
  },
  {
    id: 'normal-verb-02',
    difficulty: 'normal',
    category: '일상동사',
    words: ['자다', '일어나다', '먹다'],
    topic: '하루 일과',
    chapter: '8과~9과',
  },

  // Hard - 복합표현 (4개)
  {
    id: 'hard-complex-01',
    difficulty: 'hard',
    category: '복합표현',
    words: ['음식', '맛있다', '맛있게', '먹다'],
    topic: '맛 표현',
    chapter: '15과',
  },
  {
    id: 'hard-complex-02',
    difficulty: 'hard',
    category: '복합표현',
    words: ['공부', '도서관', '학습', '시간'],
    topic: '학습 행동',
    chapter: '10과',
  },
  {
    id: 'hard-complex-03',
    difficulty: 'hard',
    category: '복합표현',
    words: ['약속', '만나다', '시간', '장소'],
    topic: '약속 표현',
    chapter: '13과',
  },
  {
    id: 'hard-complex-04',
    difficulty: 'hard',
    category: '복합표현',
    words: ['날씨', '맑다', '맑은', '하늘'],
    topic: '날씨 표현',
    chapter: '15과',
  },

  // Expert - 문법연계 (2개)
  {
    id: 'expert-grammar-01',
    difficulty: 'expert',
    category: '문법연계',
    words: ['먹다', '먹은후', '약복용'],
    topic: '어법 변화형',
    chapter: '26과',
  },
  {
    id: 'expert-grammar-02',
    difficulty: 'expert',
    category: '문법연계',
    words: ['가다', '왔다', '돌아갔다'],
    topic: '시제 표현',
    chapter: '10과',
  },
];

export const getWordLaddersByDifficulty = (difficulty: string): WordLadder[] => {
  return WORD_LADDERS.filter((wl) => wl.difficulty === difficulty);
};

export const getRandomWordLadder = (difficulty: string): WordLadder => {
  const filtered = getWordLaddersByDifficulty(difficulty);
  if (filtered.length === 0) {
    throw new Error(`No word ladders found for difficulty: ${difficulty}`);
  }
  return filtered[Math.floor(Math.random() * filtered.length)];
};
