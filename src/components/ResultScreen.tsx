import React from 'react';
import { useCrosswordStore } from '../store/crosswordStore';

const ResultScreen: React.FC = () => {
  const { score, isComplete, elapsedTime, currentCrossword, resetGame } =
    useCrosswordStore();

  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        {isComplete ? (
          <>
            <h1 className="text-4xl font-bold text-green-600 mb-4">
              🎉 성공!
            </h1>
            <p className="text-gray-600 mb-6">
              "{currentCrossword?.title}" 문제를 완성했습니다!
            </p>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 mb-6">
              <div className="mb-4">
                <p className="text-gray-600 mb-1">최종 점수</p>
                <p className="text-5xl font-bold text-green-600">{score}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t-2 border-green-200">
                <div>
                  <p className="text-xs text-gray-600">소요 시간</p>
                  <p className="text-xl font-bold text-gray-800">
                    {minutes}:{seconds.toString().padStart(2, '0')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">난이도</p>
                  <p className="text-xl font-bold text-gray-800">
                    {currentCrossword?.difficulty === 'easy' ? 'Easy' : 'Normal'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                💡 시간이 빠를수록, 힌트를 적게 사용할수록 더 많은 점수를 얻습니다!
              </p>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-red-600 mb-4">❌ 미완성</h1>
            <p className="text-gray-600 mb-6">모든 답을 맞춰주세요!</p>
          </>
        )}

        <div className="space-y-3">
          <button
            onClick={resetGame}
            className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-all"
          >
            🏠 홈으로
          </button>

          <button
            onClick={resetGame}
            className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all"
          >
            🔄 다시 풀기
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-600">
          <p>다른 난이도 도전해보세요!</p>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
