import { create } from 'zustand';
import type { WordLadder } from '../data/wordLadders';
import { getRandomWordLadder } from '../data/wordLadders';

export type GameDifficulty = 'easy' | 'normal' | 'hard' | 'expert';

export interface GameState {
  // Game Flow
  gameStatus: 'idle' | 'playing' | 'completed';
  currentDifficulty: GameDifficulty | null;
  currentWordLadder: WordLadder | null;
  currentIndex: number;

  // Game Mechanics
  userGuess: string;
  attempts: number;
  isCorrect: boolean;
  hintsUsed: { consonant: number; vowel: number; answer: number };

  // Scoring
  credits: number;
  score: number;
  consecutiveWins: number;

  // Actions
  startGame: (difficulty: GameDifficulty) => void;
  submitGuess: (guess: string) => void;
  nextWord: () => void;
  useHint: (type: 'consonant' | 'vowel' | 'answer') => void;
  completeGame: () => void;
  resetGame: () => void;
  addCredits: (amount: number) => void;
}

const DIFFICULTY_POINTS = {
  easy: 50,
  normal: 100,
  hard: 150,
  expert: 200,
};

const HINT_COSTS = {
  consonant: 5,
  vowel: 5,
  answer: 15,
};

const calculateComboMultiplier = (consecutiveWins: number): number => {
  if (consecutiveWins >= 7) return 3.0;
  if (consecutiveWins >= 5) return 2.5;
  if (consecutiveWins >= 4) return 2.0;
  if (consecutiveWins >= 3) return 1.5;
  return 1.0;
};

export const useGameStore = create<GameState>((set) => ({
  gameStatus: 'idle',
  currentDifficulty: null,
  currentWordLadder: null,
  currentIndex: 0,

  userGuess: '',
  attempts: 0,
  isCorrect: false,
  hintsUsed: { consonant: 0, vowel: 0, answer: 0 },

  credits: 100, // Starting credits
  score: 0,
  consecutiveWins: 0,

  startGame: (difficulty: GameDifficulty) => {
    const wordLadder = getRandomWordLadder(difficulty);
    set({
      gameStatus: 'playing',
      currentDifficulty: difficulty,
      currentWordLadder: wordLadder,
      currentIndex: 0,
      userGuess: '',
      attempts: 0,
      isCorrect: false,
      hintsUsed: { consonant: 0, vowel: 0, answer: 0 },
    });
  },

  submitGuess: (guess: string) => {
    set((state) => {
      if (!state.currentWordLadder) return state;

      const targetWord =
        state.currentWordLadder.words[state.currentIndex + 1];
      const isCorrect = guess.trim().toLowerCase() === targetWord.toLowerCase();

      return {
        ...state,
        userGuess: guess,
        isCorrect,
        attempts: isCorrect ? state.attempts : state.attempts + 1,
      };
    });
  },

  nextWord: () => {
    set((state) => {
      if (!state.currentWordLadder) return state;

      const nextIndex = state.currentIndex + 1;
      const isComplete = nextIndex >= state.currentWordLadder.words.length - 1;

      if (isComplete) {
        // Game completed, calculate final score
        const deduction =
          state.attempts === 1 ? 0 : state.attempts === 2 ? 10 : 20;
        const baseScore = DIFFICULTY_POINTS[state.currentDifficulty!] - deduction;
        const comboMultiplier = calculateComboMultiplier(state.consecutiveWins);
        const finalScore = Math.floor(baseScore * comboMultiplier);

        return {
          ...state,
          gameStatus: 'completed',
          score: finalScore,
          consecutiveWins: state.consecutiveWins + 1,
        };
      }

      return {
        ...state,
        currentIndex: nextIndex,
        userGuess: '',
        attempts: 0,
        isCorrect: false,
      };
    });
  },

  useHint: (type: 'consonant' | 'vowel' | 'answer') => {
    set((state) => {
      const cost = HINT_COSTS[type];

      if (state.credits < cost) {
        console.warn(`Not enough credits. Need ${cost}, have ${state.credits}`);
        return state;
      }

      return {
        ...state,
        credits: state.credits - cost,
        hintsUsed: {
          ...state.hintsUsed,
          [type]: state.hintsUsed[type] + 1,
        },
      };
    });
  },

  completeGame: () => {
    set((state) => ({
      ...state,
      gameStatus: 'completed',
    }));
  },

  resetGame: () => {
    set({
      gameStatus: 'idle',
      currentDifficulty: null,
      currentWordLadder: null,
      currentIndex: 0,
      userGuess: '',
      attempts: 0,
      isCorrect: false,
      hintsUsed: { consonant: 0, vowel: 0, answer: 0 },
    });
  },

  addCredits: (amount: number) => {
    set((state) => ({
      credits: state.credits + amount,
    }));
  },
}));
