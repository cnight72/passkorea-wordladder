import React, { useState, useEffect, useMemo } from 'react';
import type { CategoryId, QuizQuestion } from '../data/words';
import { buildQuiz, getCategory } from '../data/words';

const QUESTION_COUNT = 20;
/** 문제당 제한시간(초) */
const TIME_LIMIT = 15;

interface VocabQuizProps {
  category: CategoryId | 'all';
  onGameEnd: (score: number, correctWords: string[]) => void;
  onCancel: () => void;
}

const VocabQuiz: React.FC<VocabQuizProps> = ({ category, onGameEnd, onCancel }) => {
  const questions = useMemo(() => buildQuiz(QUESTION_COUNT, category), [category]);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctWords, setCorrectWords] = useState<string[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [finished, setFinished] = useState(false);

  const question: QuizQuestion | undefined = questions[index];
  const answered = selected !== null;

  // 문제당 카운트다운. 답을 고르면 멈춘다.
  useEffect(() => {
    if (answered || finished || !question) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          setSelected(-1); // 시간 초과 = 오답 처리
          return 0;
        }
        return Math.round((prev - 0.1) * 10) / 10;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [answered, finished, question]);

  const handleAnswer = (choiceIndex: number) => {
    if (answered || !question) return;

    setSelected(choiceIndex);

    if (choiceIndex === question.answerIndex) {
      // 정답 50점 + 빠를수록 최대 30점
      const timeBonus = timeLeft >= 12 ? 30 : timeLeft >= 8 ? 20 : timeLeft >= 4 ? 10 : 0;
      setScore((prev) => prev + 50 + timeBonus);
      setCorrectWords((prev) => [...prev, question.entry.word]);
    }
  };

  const handleNext = () => {
    if (index + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setIndex((prev) => prev + 1);
    setSelected(null);
    setTimeLeft(TIME_LIMIT);
  };

  if (!question) {
    return (
      <div className="min-h-full flex items-center justify-center bg-blue-50">
        <div className="text-center px-6">
          <p className="text-xl font-semibold text-gray-700">No words available</p>
          <p className="text-sm text-gray-500 mb-4">출제할 단어가 없습니다</p>
          <button
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            HOME / 홈으로
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-full bg-gradient-to-b from-blue-100 to-white">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-3xl font-bold text-gray-800 mb-1">✅ Quiz Complete!</p>
            <p className="text-sm text-gray-500 mb-6">퀴즈 완료</p>

            <p className="text-6xl font-bold text-blue-600 mb-2">{score.toLocaleString()}</p>
            <p className="text-gray-600 mb-8">
              {correctWords.length} / {questions.length} correct
              <span className="block text-xs text-gray-400">
                {questions.length}문제 중 {correctWords.length}개 정답
              </span>
            </p>

            <button
              onClick={() => onGameEnd(score, correctWords)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition text-lg"
            >
              SEE RESULTS →
              <span className="block text-xs font-normal text-blue-100">결과 확인하기</span>
            </button>
            <button
              onClick={onCancel}
              className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg transition"
            >
              HOME
              <span className="block text-xs font-normal text-gray-500">홈으로</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const categoryInfo = getCategory(question.entry.category);
  const isCorrect = selected === question.answerIndex;
  const progress = ((index + (answered ? 1 : 0)) / questions.length) * 100;

  const choiceStyle = (choiceIndex: number) => {
    if (!answered) return 'bg-white border-gray-300 hover:border-blue-500 hover:bg-blue-50';
    if (choiceIndex === question.answerIndex) return 'bg-green-50 border-green-500 text-green-800';
    if (choiceIndex === selected) return 'bg-red-50 border-red-500 text-red-800';
    return 'bg-white border-gray-200 text-gray-400';
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-blue-100 to-white">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-xs opacity-90">Question</p>
              <p className="text-xl font-bold">
                {index + 1} / {questions.length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs opacity-90">📊 Score</p>
              <p className="text-xl font-bold">{score.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-90">⏱️ Time</p>
              <p className={`text-xl font-bold ${timeLeft <= 5 ? 'text-yellow-300' : ''}`}>
                {timeLeft.toFixed(1)}s
              </p>
            </div>
          </div>

          <div className="h-2 bg-blue-900/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 transition-all duration-200"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-5 text-center">
          {categoryInfo && (
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-4">
              {categoryInfo.emoji} {categoryInfo.english}
            </span>
          )}

          <p className="text-sm text-gray-600">What does this word mean?</p>
          <p className="text-xs text-gray-400 mb-4">이 단어의 뜻은 무엇입니까?</p>

          <p className="text-5xl font-bold text-blue-600">{question.entry.word}</p>

          {answered && (
            <p className="text-sm text-gray-500 mt-4">{question.entry.meaning}</p>
          )}
        </div>

        <div className="space-y-3 mb-5">
          {question.choices.map((choice, choiceIndex) => (
            <button
              key={choice}
              onClick={() => handleAnswer(choiceIndex)}
              disabled={answered}
              className={`w-full text-left px-5 py-4 rounded-lg border-2 font-semibold transition ${choiceStyle(choiceIndex)}`}
            >
              <span className="text-gray-500 mr-2">{String.fromCharCode(65 + choiceIndex)}.</span>
              {choice}
            </button>
          ))}
        </div>

        {answered && (
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
                    {selected === -1 ? '시간이 초과되었습니다' : '틀렸습니다'} — 정답:{' '}
                    {question.entry.english}
                  </p>
                </>
              )}
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition text-lg"
            >
              {index + 1 >= questions.length ? 'FINISH' : 'NEXT →'}
              <span className="block text-xs font-normal text-blue-100">
                {index + 1 >= questions.length ? '끝내기' : '다음 문제'}
              </span>
            </button>
          </>
        )}

        {!answered && (
          <button
            onClick={onCancel}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            QUIT
            <span className="block text-xs font-normal text-gray-200">그만두기</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default VocabQuiz;
