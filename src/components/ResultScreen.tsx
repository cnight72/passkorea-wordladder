import React from 'react';
import { useCrosswordStore } from '../store/crosswordStore';

const ResultScreen: React.FC = () => {
  const { score, isComplete, elapsedTime, currentCrossword, resetGame } =
    useCrosswordStore();

  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;

  // 별점 계산
  const getStars = () => {
    if (score >= 200) return '⭐⭐⭐⭐⭐';
    if (score >= 150) return '⭐⭐⭐⭐';
    if (score >= 100) return '⭐⭐⭐';
    if (score >= 50) return '⭐⭐';
    return '⭐';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        {isComplete ? (
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl shadow-2xl p-8 border border-slate-700 backdrop-blur-sm">
            {/* Success Animation */}
            <div className="text-center mb-8">
              <div className="text-7xl mb-4 animate-bounce">🎉</div>
              <h1 className="text-5xl font-black text-green-400 mb-3 drop-shadow-lg">
                성공!
              </h1>
              <p className="text-gray-300 text-lg">
                "{currentCrossword?.title}" 문제를 완성했습니다!
              </p>
            </div>

            {/* Score Card */}
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl p-8 mb-6 border border-green-400/30">
              <div className="text-center mb-6">
                <p className="text-gray-300 text-sm mb-2">최종 점수</p>
                <p className="text-6xl font-black text-green-400 drop-shadow-lg">{score}</p>
                <p className="text-yellow-300 text-2xl mt-3">{getStars()}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-green-400/30">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <p className="text-gray-400 text-xs mb-1">소요 시간</p>
                  <p className="text-white font-bold text-lg">
                    {minutes}:{seconds.toString().padStart(2, '0')}
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <p className="text-gray-400 text-xs mb-1">난이도</p>
                  <p className="text-white font-bold text-lg">
                    {currentCrossword?.difficulty === 'easy' ? '초급' : '중급'}
                  </p>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-500/20 rounded-lg p-4 mb-8 border border-blue-400/30">
              <p className="text-blue-200 text-sm">
                <strong>💡 팁:</strong> 시간이 빠를수록, 힌트를 적게 사용할수록 더 많은 점수를 얻습니다!
              </p>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={resetGame}
                className="group w-full py-3 px-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-blue-400/30"
              >
                <span className="text-xl mr-2">🏠</span>홈으로
              </button>

              <button
                onClick={resetGame}
                className="group w-full py-3 px-6 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-green-400/30"
              >
                <span className="text-xl mr-2">🔄</span>다시 풀기
              </button>
            </div>

            <p className="text-center text-gray-400 text-sm mt-6">
              다른 난이도도 도전해보세요! 🎮
            </p>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-red-500/20 to-rose-600/20 rounded-2xl shadow-2xl p-8 border border-red-400/30 backdrop-blur-sm text-center">
            <div className="text-7xl mb-4 animate-pulse">❌</div>
            <h1 className="text-5xl font-black text-red-400 mb-4 drop-shadow-lg">
              미완성
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              모든 답을 맞춰주세요!
            </p>

            <button
              onClick={resetGame}
              className="w-full py-4 px-6 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-red-400/30"
            >
              <span className="text-xl mr-2">🔄</span>다시 풀기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultScreen;
