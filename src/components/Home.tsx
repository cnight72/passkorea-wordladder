import React from 'react';
import { useCrosswordStore } from '../store/crosswordStore';

const Home: React.FC = () => {
  const startGame = useCrosswordStore((state) => state.startGame);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">
            🎯 가로세로낱말퀴즈
          </h1>
          <p className="text-xl text-gray-600">
            EPS-TOPIK 한국어 학습 게임
          </p>
        </div>

        {/* Game Button */}
        <div className="bg-white rounded-lg p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            오늘의 문제를 풀어보세요!
          </h2>

          <div className="space-y-4">
            <button
              onClick={() => startGame('easy')}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg text-lg transition-all transform hover:scale-105"
            >
              🟢 초급 (Easy - 5x5)
              <div className="text-sm font-normal mt-1">100점 기본</div>
            </button>

            <button
              onClick={() => startGame('normal')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg text-lg transition-all transform hover:scale-105"
            >
              🔵 중급 (Normal - 7x7)
              <div className="text-sm font-normal mt-1">200점 기본</div>
            </button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* How to Play */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-bold mb-3 text-gray-800">📖 게임 규칙</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>✓ 가로/세로 문제를 읽기</li>
              <li>✓ 그리드에 글자 입력하기</li>
              <li>✓ 모든 답 맞추기</li>
              <li>✓ 빠를수록 높은 점수!</li>
            </ul>
          </div>

          {/* Scoring */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-bold mb-3 text-gray-800">🏆 점수 시스템</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>⏱️ 시간 보너스: 빠를수록 UP</li>
              <li>💡 힌트 페널티: -30점</li>
              <li>🎯 완성 보너스: 전부 맞으면</li>
              <li>📊 매일 새로운 문제</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>PassKorea × Crossword Quiz</p>
          <p>EPS-TOPIK 한국어 능력 시험 준비</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
