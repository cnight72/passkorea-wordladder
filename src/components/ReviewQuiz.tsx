import React, { useState } from 'react';
import type { ReviewItem } from '../lib/review';
import { clearMissed, loadReviewItems } from '../lib/review';

interface ReviewQuizProps {
  onDone: () => void;
}

/** 한 번에 다루는 최대 문항 수. 너무 많으면 복습이 부담스러워진다. */
const BATCH = 20;

const ReviewQuiz: React.FC<ReviewQuizProps> = ({ onDone }) => {
  const [items] = useState<ReviewItem[]>(() => loadReviewItems().slice(0, BATCH));
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [cleared, setCleared] = useState(0);
  const [kept, setKept] = useState(0);
  const [finished, setFinished] = useState(false);

  const item = items[index];

  const next = () => {
    if (index + 1 >= items.length) {
      setFinished(true);
      return;
    }
    setIndex((prev) => prev + 1);
    setRevealed(false);
  };

  const handleKnew = () => {
    clearMissed(item.id);
    setCleared((prev) => prev + 1);
    next();
  };

  const handleStillHard = () => {
    setKept((prev) => prev + 1);
    next();
  };

  if (items.length === 0) {
    return (
      <div className="min-h-full flex items-center justify-center bg-amber-50">
        <div className="text-center px-6">
          <p className="text-5xl mb-4">🎉</p>
          <p className="text-xl font-semibold text-gray-800">Nothing to review!</p>
          <p className="text-sm text-gray-500 mb-6">복습할 문제가 없습니다</p>
          <button
            onClick={onDone}
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
      <div className="min-h-full bg-gradient-to-b from-amber-100 to-white">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-3xl font-bold text-gray-800 mb-1">🔁 Review Done!</p>
            <p className="text-sm text-gray-500 mb-8">복습 완료</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-xs text-gray-600">Mastered</p>
                <p className="text-xs text-gray-400 mb-1">외웠어요</p>
                <p className="text-3xl font-bold text-green-600">{cleared}</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-4">
                <p className="text-xs text-gray-600">Keep Practicing</p>
                <p className="text-xs text-gray-400 mb-1">더 볼 문제</p>
                <p className="text-3xl font-bold text-amber-600">{kept}</p>
              </div>
            </div>

            <button
              onClick={onDone}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-6 rounded-lg transition text-lg"
            >
              HOME
              <span className="block text-xs font-normal text-amber-100">홈으로</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((index + (revealed ? 1 : 0)) / items.length) * 100;

  return (
    <div className="min-h-full bg-gradient-to-b from-amber-100 to-white">
      <div className="bg-gradient-to-r from-amber-600 to-amber-800 text-white p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-xs opacity-90">🔁 Review</p>
              <p className="text-xl font-bold">
                {index + 1} / {items.length}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-90">Mastered</p>
              <p className="text-xl font-bold">{cleared}</p>
            </div>
          </div>

          <div className="h-2 bg-amber-900/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-300 transition-all duration-200"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="inline-block bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
              {item.kind === 'vocab' ? '📖' : '🏭'} {item.source}
            </span>
            {item.missCount > 1 && (
              <span className="inline-block bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                {item.missCount}번 틀림
              </span>
            )}
          </div>

          <p
            className={`font-bold text-blue-700 ${
              item.kind === 'vocab' ? 'text-4xl' : 'text-lg leading-relaxed text-left'
            }`}
          >
            {item.prompt}
          </p>

          {revealed ? (
            <div className="mt-6 bg-green-50 border-2 border-green-400 rounded-lg p-4">
              <p className="text-xs text-gray-600">Answer / 정답</p>
              <p className="text-lg font-bold text-green-800">{item.answer}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-6">
              Do you remember?
              <span className="block text-xs text-gray-400">기억나시나요?</span>
            </p>
          )}
        </div>

        {revealed ? (
          <div className="space-y-3">
            <button
              onClick={handleKnew}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition"
            >
              ✓ I KNOW IT
              <span className="block text-xs font-normal text-green-100">외웠어요 — 목록에서 뺍니다</span>
            </button>
            <button
              onClick={handleStillHard}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-6 rounded-lg transition"
            >
              ↻ STILL HARD
              <span className="block text-xs font-normal text-amber-100">더 볼래요 — 목록에 남깁니다</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setRevealed(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition text-lg"
          >
            SHOW ANSWER
            <span className="block text-xs font-normal text-blue-100">정답 보기</span>
          </button>
        )}

        <button
          onClick={onDone}
          className="w-full mt-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg transition"
        >
          QUIT
          <span className="block text-xs font-normal text-gray-500">그만두기</span>
        </button>
      </div>
    </div>
  );
};

export default ReviewQuiz;
