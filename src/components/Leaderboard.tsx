import React, { useState } from 'react';
import { COUNTRIES } from '../data/countries';

interface LeaderboardProps {
  myCountry: string;
  playerName: string;
  bestScore: number;
  gamesPlayed: number;
  onBack: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  myCountry,
  playerName,
  bestScore,
  gamesPlayed,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'country' | 'player'>('country');

  return (
    <div className="min-h-full bg-gradient-to-b from-blue-50 to-white">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">🏆 Leaderboard</h1>
          <p className="text-purple-200 text-sm mb-2">리더보드</p>
          <p className="text-purple-100">Global ranking & country battle</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('country')}
            className={`flex-1 py-3 px-2 rounded-lg font-bold transition ${
              activeTab === 'country'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            🌍 Countries
            <span className="block text-xs font-normal opacity-75">국가대항</span>
          </button>
          <button
            onClick={() => setActiveTab('player')}
            className={`flex-1 py-3 px-2 rounded-lg font-bold transition ${
              activeTab === 'player'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            👥 Players
            <span className="block text-xs font-normal opacity-75">개인 순위</span>
          </button>
        </div>

        {activeTab === 'country' && (
          <div className="space-y-3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="divide-y">
                {COUNTRIES.map((country, idx) => (
                  <div
                    key={country.code}
                    className={`p-4 flex items-center justify-between ${
                      country.code === myCountry
                        ? 'bg-purple-50 ring-2 ring-inset ring-purple-400'
                        : idx < 3
                          ? 'bg-gradient-to-r from-yellow-50 to-yellow-100'
                          : ''
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-2xl font-bold text-gray-700 min-w-8">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}️⃣`}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {country.flag} {country.name}
                          {country.code === myCountry && (
                            <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full align-middle">
                              YOU
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600">{country.nativeName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">-</p>
                      <p className="text-xs text-gray-500">Coming soon</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'player' && (
          <div className="space-y-4">
            {gamesPlayed > 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <p className="text-sm font-bold text-gray-800">Your Record</p>
                <p className="text-xs text-gray-500 mb-4">나의 기록</p>

                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl">
                    {COUNTRIES.find((c) => c.code === myCountry)?.flag ?? '🏳️'}
                  </span>
                  <div>
                    <p className="font-bold text-gray-800">{playerName}</p>
                    <p className="text-xs text-gray-500">
                      {COUNTRIES.find((c) => c.code === myCountry)?.name ?? myCountry}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-600">Best Score</p>
                    <p className="text-xs text-gray-400 mb-1">최고 점수</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {bestScore.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-600">Games Played</p>
                    <p className="text-xs text-gray-400 mb-1">플레이 횟수</p>
                    <p className="text-2xl font-bold text-purple-600">{gamesPlayed}</p>
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Saved on this device only. Global ranking coming soon.
                </p>
                <p className="text-xs text-gray-400 text-center">
                  이 기기에만 저장됩니다. 전역 순위는 준비 중입니다.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <p className="text-lg text-gray-700">
                  Play a game to appear here! 🎮
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  게임을 플레이하면 여기에 순위가 표시됩니다
                </p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={onBack}
          className="w-full mt-8 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition"
        >
          ← BACK
          <span className="block text-xs font-normal text-gray-200">뒤로가기</span>
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
