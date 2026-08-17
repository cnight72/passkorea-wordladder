import { useState } from 'react';
import CountrySelector from './CountrySelector';
import logo from '../assets/logo.png';
import type { ThemeId } from '../data/vocab';
import { AVAILABLE_THEMES, TOTAL_WORDS } from '../data/vocab';
import type { IndustryId } from '../data/exams';
import { INDUSTRIES, TOTAL_QUESTIONS } from '../data/exams';

export type GameMode =
  | { kind: 'vocab'; theme: ThemeId | 'all' }
  | { kind: 'exam'; industry: IndustryId };

interface WordChainHomeProps {
  initialName: string;
  initialCountry: string;
  bestScore: number;
  gamesPlayed: number;
  onStartGame: (playerName: string, countryCode: string, mode: GameMode) => void;
  onViewLeaderboard: () => void;
}

const WordChainHome: React.FC<WordChainHomeProps> = ({
  initialName,
  initialCountry,
  bestScore,
  gamesPlayed,
  onStartGame,
  onViewLeaderboard,
}) => {
  const [playerName, setPlayerName] = useState(initialName);
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [mode, setMode] = useState<'vocab' | 'exam'>('vocab');
  const [theme, setTheme] = useState<ThemeId | 'all'>('all');
  const [industry, setIndustry] = useState<IndustryId>('machinery');

  const handleStart = () =>
    onStartGame(
      playerName,
      selectedCountry,
      mode === 'vocab' ? { kind: 'vocab', theme } : { kind: 'exam', industry }
    );

  return (
    <div className="min-h-full bg-gradient-to-b from-blue-50 to-white">
      <div className="bg-white border-b border-gray-200 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mb-4">
            <img src={logo} alt="passkorea" className="h-11 w-auto mx-auto" />
          </h1>
          <div className="inline-block bg-blue-700 text-white rounded-full px-3 py-1 text-xs font-bold tracking-wide mb-3">
            EPS-TOPIK
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Exam Practice</h2>
          <p className="text-gray-600">Vocabulary and job skills</p>
          <p className="text-gray-500 text-sm">어휘와 직무, 시험 대비를 한 곳에서</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-5 mb-6">
          <p className="text-2xl text-center mb-2">🎯</p>
          <p className="text-sm text-gray-800 font-semibold text-center">
            Study with the official Standard Korean Textbook and past exam questions.
          </p>
          <p className="text-xs text-gray-600 text-center mt-1">
            EPS-TOPIK 표준교재 어휘와 공개문제로 학습합니다.
          </p>

          <div className="border-t border-amber-200 my-3"></div>

          <p className="text-sm text-amber-900 font-bold text-center">
            Join the EPS-TOPIK Korean study country battle! 🌍
          </p>
          <p className="text-xs text-gray-600 text-center mt-1">
            EPS-TOPIK 한국어 공부 국가 대항전에 참여하세요!
          </p>
        </div>

        {gamesPlayed > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-4 mb-6 flex items-center justify-around">
            <div className="text-center">
              <p className="text-xs text-gray-600">Best Score</p>
              <p className="text-xs text-gray-400 mb-1">최고 점수</p>
              <p className="text-2xl font-bold text-blue-600">{bestScore.toLocaleString()}</p>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center">
              <p className="text-xs text-gray-600">Games Played</p>
              <p className="text-xs text-gray-400 mb-1">플레이 횟수</p>
              <p className="text-2xl font-bold text-purple-600">{gamesPlayed}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <label className="block text-sm font-bold text-gray-800">
            👤 Player Name
          </label>
          <p className="text-xs text-gray-500 mb-3">플레이어 이름</p>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600 text-lg"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <CountrySelector
            selectedCountry={selectedCountry}
            onSelect={setSelectedCountry}
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <label className="block text-sm font-bold text-gray-800">
            🎓 Test Type
          </label>
          <p className="text-xs text-gray-500 mb-3">시험 종류</p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setMode('vocab')}
              className={`px-3 py-3 rounded-lg border-2 transition text-center ${
                mode === 'vocab'
                  ? 'bg-blue-500 border-blue-500 text-white font-semibold'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-800'
              }`}
            >
              📖 Vocabulary
              <span className="block text-xs opacity-75">어휘</span>
              <span className="block text-xs opacity-60 mt-1">{TOTAL_WORDS} words</span>
            </button>
            <button
              onClick={() => setMode('exam')}
              className={`px-3 py-3 rounded-lg border-2 transition text-center ${
                mode === 'exam'
                  ? 'bg-indigo-600 border-indigo-600 text-white font-semibold'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-800'
              }`}
            >
              🏭 Job Skills
              <span className="block text-xs opacity-75">직무</span>
              <span className="block text-xs opacity-60 mt-1">{TOTAL_QUESTIONS} questions</span>
            </button>
          </div>

          {mode === 'exam' && (
            <p className="text-xs text-gray-500 text-center mt-3">
              Official questions from the Special EPS-TOPIK job test.
              <span className="block text-gray-400">
                특별 EPS-TOPIK 직무문항 공개문제(2025)입니다.
              </span>
            </p>
          )}
        </div>

        {mode === 'exam' ? (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <label className="block text-sm font-bold text-gray-800">🏭 Industry</label>
            <p className="text-xs text-gray-500 mb-3">업종</p>

            <div className="space-y-2">
              {INDUSTRIES.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setIndustry(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition flex items-center justify-between ${
                    industry === item.id
                      ? 'bg-indigo-600 border-indigo-600 text-white font-semibold'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-800'
                  }`}
                >
                  <span>
                    {item.emoji} {item.english}
                    <span className="block text-xs opacity-75">{item.korean}</span>
                  </span>
                  <span className="text-xs opacity-75">{item.count}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <label className="block text-sm font-bold text-gray-800">
            📚 Exam Topic
          </label>
          <p className="text-xs text-gray-500 mb-3">시험 영역</p>

          <div className="space-y-2">
            <button
              onClick={() => setTheme('all')}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition flex items-center justify-between ${
                theme === 'all'
                  ? 'bg-blue-500 border-blue-500 text-white font-semibold'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-800'
              }`}
            >
              <span>
                🌐 All Topics
                <span className="block text-xs opacity-75">전체 영역</span>
              </span>
              <span className="text-xs opacity-75">{TOTAL_WORDS}</span>
            </button>

            {AVAILABLE_THEMES.map((item) => (
              <button
                key={item.id}
                onClick={() => setTheme(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition flex items-center justify-between ${
                  theme === item.id
                    ? 'bg-blue-500 border-blue-500 text-white font-semibold'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-800'
                }`}
              >
                <span>
                  {item.emoji} {item.english}
                  <span className="block text-xs opacity-75">{item.korean}</span>
                </span>
                <span className="text-xs opacity-75">{item.count}</span>
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-500 text-center mt-3">
            From the official EPS-TOPIK Standard Korean Textbook.
            <span className="block text-gray-400">EPS-TOPIK 한국어 표준교재 수록 어휘입니다.</span>
          </p>
        </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleStart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition"
          >
            🚀 START GAME
            <span className="block text-xs font-normal text-blue-100">게임 시작</span>
          </button>

          <button
            onClick={onViewLeaderboard}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition"
          >
            🏆 LEADERBOARD
            <span className="block text-xs font-normal text-purple-100">리더보드</span>
          </button>
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-5">
          <p className="text-sm font-bold text-gray-800">How to Play</p>
          <p className="text-xs text-gray-500 mb-3">게임 방법</p>
          <ol className="text-sm text-gray-700 space-y-3">
            <li>
              <span className="font-bold text-blue-600 mr-1">1.</span>
              20 questions — choose the correct answer
              <span className="block text-xs text-gray-500 ml-4">
                20문제 — 알맞은 답을 고르세요
              </span>
            </li>
            <li>
              <span className="font-bold text-blue-600 mr-1">2.</span>
              Answer faster to earn bonus points
              <span className="block text-xs text-gray-500 ml-4">
                빠르게 답할수록 보너스 점수를 받습니다
              </span>
            </li>
            <li>
              <span className="font-bold text-blue-600 mr-1">3.</span>
              Aim for the world ranking!
              <span className="block text-xs text-gray-500 ml-4">
                세계 랭킹을 목표로 하세요!
              </span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default WordChainHome;
