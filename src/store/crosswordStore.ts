import { create } from 'zustand';
import type { Crossword } from '../data/crosswordData';
import { getRandomCrossword } from '../data/crosswordData';

export type GameDifficulty = 'easy' | 'normal';

export interface GameState {
  // Game Flow
  gameStatus: 'idle' | 'playing' | 'completed';
  currentDifficulty: GameDifficulty | null;
  currentCrossword: Crossword | null;
  userAnswers: string[][]; // 사용자 입력 그리드

  // Game Mechanics
  startTime: number | null;
  elapsedTime: number; // 초 단위
  hintsUsed: { across: number; down: number };

  // Scoring
  score: number;
  isComplete: boolean;

  // Actions
  startGame: (difficulty: GameDifficulty) => void;
  setCellAnswer: (row: number, col: number, char: string) => void;
  useHint: () => void;
  checkAnswers: () => boolean;
  completeGame: () => void;
  resetGame: () => void;
  setElapsedTime: (time: number) => void;
}

const HINT_PENALTY = 30;

export const useCrosswordStore = create<GameState>((set, get) => ({
  gameStatus: 'idle',
  currentDifficulty: null,
  currentCrossword: null,
  userAnswers: [],

  startTime: null,
  elapsedTime: 0,
  hintsUsed: { across: 0, down: 0 },

  score: 0,
  isComplete: false,

  startGame: (difficulty: GameDifficulty) => {
    const crossword = getRandomCrossword(difficulty);
    const userAnswers = crossword.grid.map((row) =>
      row.map((cell) => (cell.isBlank ? '' : ''))
    );

    set({
      gameStatus: 'playing',
      currentDifficulty: difficulty,
      currentCrossword: crossword,
      userAnswers,
      startTime: Date.now(),
      elapsedTime: 0,
      hintsUsed: { across: 0, down: 0 },
      score: 0,
      isComplete: false,
    });
  },

  setCellAnswer: (row: number, col: number, char: string) => {
    set((state) => {
      const newAnswers = state.userAnswers.map((r) => [...r]);
      if (newAnswers[row]) {
        newAnswers[row][col] = char.toUpperCase().slice(-1); // 한글자만
      }
      return { userAnswers: newAnswers };
    });
  },

  useHint: () => {
    set((state) => ({
      hintsUsed: {
        across: state.hintsUsed.across + 1,
        down: state.hintsUsed.down + 1,
      },
    }));
  },

  checkAnswers: (): boolean => {
    const state = get();
    if (!state.currentCrossword) return false;

    const grid = state.currentCrossword.grid;
    const answers = state.userAnswers;

    // 모든 답이 일치하는지 확인
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        const cell = grid[i][j];
        const userAnswer = answers[i]?.[j] || '';

        if (!cell.isBlank && cell.char !== userAnswer) {
          return false;
        }
      }
    }

    return true;
  },

  completeGame: () => {
    const state = get();

    // 점수 계산
    const isCorrect = state.checkAnswers();
    if (!isCorrect) {
      set({ gameStatus: 'completed', isComplete: false, score: 0 });
      return;
    }

    const difficulty = state.currentDifficulty;
    const baseScore = difficulty === 'easy' ? 100 : 200;

    // 시간 보너스
    const timeBonus = getTimeBonus(state.elapsedTime);

    // 힌트 페널티
    const hintPenalty =
      (state.hintsUsed.across + state.hintsUsed.down) * HINT_PENALTY;

    const finalScore = Math.max(0, baseScore + timeBonus - hintPenalty);

    set({
      gameStatus: 'completed',
      isComplete: true,
      score: finalScore,
    });
  },

  resetGame: () => {
    set({
      gameStatus: 'idle',
      currentDifficulty: null,
      currentCrossword: null,
      userAnswers: [],
      startTime: null,
      elapsedTime: 0,
      hintsUsed: { across: 0, down: 0 },
      score: 0,
      isComplete: false,
    });
  },

  setElapsedTime: (time: number) => {
    set({ elapsedTime: time });
  },
}));

// Helper: 시간 기반 보너스 계산
const getTimeBonus = (seconds: number): number => {
  const minutes = Math.floor(seconds / 60);

  if (minutes <= 1) return 50;
  if (minutes <= 2) return 40;
  if (minutes <= 3) return 30;
  if (minutes <= 5) return 20;
  return 10;
};
