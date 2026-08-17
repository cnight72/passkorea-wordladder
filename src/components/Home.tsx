import React from 'react';
import { useCrosswordStore } from '../store/crosswordStore';

const Home: React.FC = () => {
  const startGame = useCrosswordStore((state) => state.startGame);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-6 inline-block">
            <div className="text-7xl">🎯</div>
          </div>
          <h1 className="text-6xl font-black text-white mb-4 drop-shadow-lg">
            가로세로낱말퀴즈
          </h1>
          <p className="text-2xl text-gray-300 font-semibold mb-2">
            EPS-TOPIK 한국어 학습 게임
          </p>
          <p className="text-gray-400">외국인 근로자를 위한 재미있는 한국어 학습</p>
        </div>

        {/* Main CTA Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-10 shadow-2xl mb-8 border border-slate-700 backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-8 text-white text-center">
            난이도를 선택하세요
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Easy Button */}
            <button
              onClick={() => startGame('easy')}
              className="group relative w-full py-8 px-6 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg border border-green-400/30"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-300 to-emerald-400 opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="relative">
                <div className="text-4xl mb-2">🟢</div>
                <div className="font-bold text-xl mb-1">초급 (Easy)</div>
                <div className="text-sm font-semibold opacity-90 mb-3">5×5 그리드</div>
                <div className="text-base font-bold bg-black/20 rounded-lg py-2 px-3 inline-block">
                  기본 100점
                </div>
              </div>
            </button>

            {/* Normal Button */}
            <button
              onClick={() => startGame('normal')}
              className="group relative w-full py-8 px-6 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg border border-blue-400/30"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-300 to-indigo-400 opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="relative">
                <div className="text-4xl mb-2">🔵</div>
                <div className="font-bold text-xl mb-1">중급 (Normal)</div>
                <div className="text-sm font-semibold opacity-90 mb-3">7×7 그리드</div>
                <div className="text-base font-bold bg-black/20 rounded-lg py-2 px-3 inline-block">
                  기본 200점
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* How to Play */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 shadow-xl border border-slate-700 hover:border-slate-600 transition-all">
            <h3 className="text-xl font-bold mb-4 text-white flex items-center">
              <span className="text-2xl mr-2">📖</span>게임 규칙
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start text-gray-200">
                <span className="text-green-400 font-bold mr-2">✓</span>
                <span>가로/세로 문제를 읽기</span>
              </li>
              <li className="flex items-start text-gray-200">
                <span className="text-green-400 font-bold mr-2">✓</span>
                <span>그리드에 글자 입력하기</span>
              </li>
              <li className="flex items-start text-gray-200">
                <span className="text-green-400 font-bold mr-2">✓</span>
                <span>모든 답 맞추기</span>
              </li>
              <li className="flex items-start text-gray-200">
                <span className="text-green-400 font-bold mr-2">⚡</span>
                <span>빠를수록 높은 점수!</span>
              </li>
            </ul>
          </div>

          {/* Scoring System */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 shadow-xl border border-slate-700 hover:border-slate-600 transition-all">
            <h3 className="text-xl font-bold mb-4 text-white flex items-center">
              <span className="text-2xl mr-2">🏆</span>점수 시스템
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start text-gray-200">
                <span className="text-yellow-400 font-bold mr-2">⏱️</span>
                <span><strong>시간 보너스:</strong> 빠를수록 UP</span>
              </li>
              <li className="flex items-start text-gray-200">
                <span className="text-purple-400 font-bold mr-2">💡</span>
                <span><strong>힌트 페널티:</strong> -30점</span>
              </li>
              <li className="flex items-start text-gray-200">
                <span className="text-pink-400 font-bold mr-2">🎯</span>
                <span><strong>완성 보너스:</strong> 전부 맞으면</span>
              </li>
              <li className="flex items-start text-gray-200">
                <span className="text-blue-400 font-bold mr-2">📊</span>
                <span><strong>매일 새로운:</strong> 문제 업데이트</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-slate-700">
            <div className="text-3xl mb-2">🌍</div>
            <p className="text-gray-300 font-semibold">17개국</p>
            <p className="text-gray-400 text-sm">외국인 근로자</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-slate-700">
            <div className="text-3xl mb-2">📚</div>
            <p className="text-gray-300 font-semibold">무료</p>
            <p className="text-gray-400 text-sm">제한 없음</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-slate-700">
            <div className="text-3xl mb-2">⚡</div>
            <p className="text-gray-300 font-semibold">즉시 시작</p>
            <p className="text-gray-400 text-sm">설치 불필요</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pb-8">
          <p className="text-gray-400 text-sm mb-1">PassKorea × Crossword Quiz</p>
          <p className="text-gray-500 text-xs">EPS-TOPIK 한국어 능력 시험 준비</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
