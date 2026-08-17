import React, { useState, useEffect, useRef } from 'react';
import type { ThemeId, VocabQuestion } from '../data/vocab';
import { buildVocabQuiz, getSection, themeOfSection } from '../data/vocab';
import { addMissed } from '../lib/review';

/** 한 번에 미리 만들어 두는 문항 수. 다 풀면 다음 묶음을 이어붙인다. */
const BATCH = 20;
/** 문항당 제한시간(초) */
const TIME_LIMIT = 15;

interface VocabQuizProps {
  theme: ThemeId | 'all';
  /** 푼 만큼 점수를 남기고 끝낸다 */
  onGameEnd: (score: number, correctWords: string[]) => void;
  /** 한 문제도 풀지 않고 나갈 때 */
  onCancel: () => void;
  onSettings: () => void;
}

const VocabQuiz: React.FC<VocabQuizProps> = ({ theme, onGameEnd, onCancel, onSettings }) => {
  const [questions, setQuestions] = useState<VocabQuestion[]>([]);
  const [loadFailed, setLoadFailed] = useState(false);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [correctWords, setCorrectWords] = useState<string[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);

  /** 이미 낸 단어. 다음 묶음에서 빼서 같은 문제가 반복되지 않게 한다. */
  const seen = useRef<Set<string>>(new Set());
  /** 같은 문항을 두 번 기록하지 않도록 (StrictMode 이중 실행 포함) */
  const recorded = useRef<Set<number>>(new Set());
  const loading = useRef(false);

  const question: VocabQuestion | undefined = questions[index];
  const isAnswered = selected !== null;

  /** 다음 묶음을 이어붙인다. 남은 단어가 없으면 처음부터 다시 돈다. */
  const loadMore = React.useCallback(async () => {
    if (loading.current) return;
    loading.current = true;

    try {
      let next = await buildVocabQuiz(BATCH, theme, seen.current);
      if (next.length === 0) {
        // 주제의 단어를 한 바퀴 다 돌았으면 다시 처음부터
        seen.current.clear();
        next = await buildVocabQuiz(BATCH, theme);
      }
      next.forEach((q) => seen.current.add(q.entry.word));
      setQuestions((prev) => [...prev, ...next]);
    } catch {
      setLoadFailed(true);
    } finally {
      loading.current = false;
    }
  }, [theme]);

  // 주제가 바뀌면 처음부터 다시 시작
  useEffect(() => {
    seen.current.clear();
    recorded.current.clear();
    setQuestions([]);
    setIndex(0);
    setSelected(null);
    setTimeLeft(TIME_LIMIT);
    void loadMore();
  }, [theme, loadMore]);

  // 남은 문항이 얼마 없으면 미리 더 받아둔다
  useEffect(() => {
    if (questions.length > 0 && index >= questions.length - 3) void loadMore();
  }, [index, questions.length, loadMore]);

  useEffect(() => {
    if (isAnswered || !question) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          setSelected(-1); // 시간 초과 = 오답
          return 0;
        }
        return Math.round((prev - 0.1) * 10) / 10;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isAnswered, question]);

  // 틀린 문항은 즉시 복습 목록에 넣는다. 중간에 그만둬도 남는다.
  useEffect(() => {
    if (selected === null || !question) return;
    if (selected === question.answerIndex) return;
    if (recorded.current.has(index)) return;

    recorded.current.add(index);
    const section = getSection(question.entry.section);
    addMissed([
      {
        id: `vocab:${question.entry.word}`,
        kind: 'vocab',
        prompt: question.entry.word,
        answer: question.entry.english,
        source: `${question.entry.section} ${section?.korean ?? ''}`.trim(),
      },
    ]);
  }, [selected, question, index]);

  const handleAnswer = (choiceIndex: number) => {
    if (isAnswered || !question) return;
    setSelected(choiceIndex);
    setAnswered((prev) => prev + 1);

    if (choiceIndex === question.answerIndex) {
      const timeBonus = timeLeft >= 12 ? 30 : timeLeft >= 8 ? 20 : timeLeft >= 4 ? 10 : 0;
      setScore((prev) => prev + 50 + timeBonus);
      setCorrectWords((prev) => [...prev, question.entry.word]);
    }
  };

  const handleNext = () => {
    setIndex((prev) => prev + 1);
    setSelected(null);
    setTimeLeft(TIME_LIMIT);
  };

  /** 언제 그만둬도 그때까지 푼 만큼 점수가 남는다 */
  const handleStop = () => {
    if (answered > 0) onGameEnd(score, correctWords);
    else onCancel();
  };

  if (loadFailed) {
    return (
      <div className="min-h-full flex items-center justify-center bg-blue-50">
        <div className="text-center px-6">
          <p className="text-xl font-semibold text-gray-700">Could not load words</p>
          <p className="text-sm text-gray-500 mb-4">단어를 불러오지 못했습니다</p>
          <button
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            BACK / 뒤로
          </button>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-full flex items-center justify-center bg-blue-50">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-700">Loading...</p>
          <p className="text-sm text-gray-500">불러오는 중</p>
        </div>
      </div>
    );
  }

  const section = getSection(question.entry.section);
  const themeInfo = themeOfSection(question.entry.section);
  const isCorrect = selected === question.answerIndex;

  const choiceStyle = (choiceIndex: number) => {
    if (!isAnswered) return 'bg-white border-gray-300 hover:border-blue-500 hover:bg-blue-50';
    if (choiceIndex === question.answerIndex) return 'bg-green-50 border-green-500 text-green-800';
    if (choiceIndex === selected) return 'bg-red-50 border-red-500 text-red-800';
    return 'bg-white border-gray-200 text-gray-400';
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-blue-100 to-white">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <button
            onClick={onSettings}
            className="text-2xl leading-none opacity-90 hover:opacity-100 transition"
            aria-label="Settings"
          >
            ⚙
          </button>
          <div className="text-center">
            <p className="text-xs opacity-90">📊 Score</p>
            <p className="text-xl font-bold">{score.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs opacity-90">Solved</p>
            <p className="text-xl font-bold">{answered}</p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-90">⏱️</p>
            <p className={`text-xl font-bold ${timeLeft <= 5 ? 'text-yellow-300' : ''}`}>
              {timeLeft.toFixed(1)}s
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-5 text-center">
          {themeInfo && (
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-4">
              {themeInfo.emoji} {section?.english ?? themeInfo.english}
            </span>
          )}

          <p className="text-sm text-gray-600">What does this word mean?</p>
          <p className="text-xs text-gray-400 mb-4">이 단어의 뜻은 무엇입니까?</p>

          <p className="text-4xl font-bold text-blue-600">{question.entry.word}</p>

          {isAnswered && section && (
            <p className="text-xs text-gray-500 mt-4">
              {question.entry.section} {section.korean}
            </p>
          )}
        </div>

        <div className="space-y-3 mb-5">
          {question.choices.map((choice, choiceIndex) => (
            <button
              key={choice}
              onClick={() => handleAnswer(choiceIndex)}
              disabled={isAnswered}
              className={`w-full text-left px-5 py-4 rounded-lg border-2 font-semibold transition ${choiceStyle(choiceIndex)}`}
            >
              <span className="text-gray-500 mr-2">{String.fromCharCode(65 + choiceIndex)}.</span>
              {choice}
            </button>
          ))}
        </div>

        {isAnswered && (
          <>
            <div
              className={`rounded-lg p-4 mb-4 text-center ${
                isCorrect ? 'bg-green-100 border-2 border-green-400' : 'bg-red-100 border-2 border-red-400'
              }`}
            >
              {isCorrect ? (
                <>
                  <p className="font-bold text-green-800">🎉 Correct!</p>
                  <p className="text-xs text-green-700">정답입니다</p>
                </>
              ) : (
                <>
                  <p className="font-bold text-red-800">
                    {selected === -1 ? "⏰ Time's up!" : '❌ Incorrect'}
                  </p>
                  <p className="text-xs text-red-700">
                    {question.entry.word} — {question.entry.english}
                  </p>
                </>
              )}
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition text-lg"
            >
              NEXT →
              <span className="block text-xs font-normal text-blue-100">다음 문제</span>
            </button>
          </>
        )}

        <button
          onClick={handleStop}
          className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg transition"
        >
          {answered > 0 ? 'STOP & SAVE' : 'BACK'}
          <span className="block text-xs font-normal text-gray-500">
            {answered > 0 ? '그만하기 — 여기까지 점수가 저장됩니다' : '뒤로'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default VocabQuiz;
