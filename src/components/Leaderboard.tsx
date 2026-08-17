import React, { useState } from 'react';

interface LeaderboardProps {
  onBack: () => void;
}

const COUNTRIES = [
  { code: 'NP', name: 'Nepal', flag: '🇳🇵' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'LA', name: 'Laos', flag: '🇱🇦' },
  { code: 'KH', name: 'Cambodia', flag: '🇰🇭' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿' },
  { code: 'KG', name: 'Kyrgyzstan', flag: '🇰🇬' },
  { code: 'TJ', name: 'Tajikistan', flag: '🇹🇯' },
  { code: 'TM', name: 'Turkmenistan', flag: '🇹🇲' },
];

const Leaderboard: React.FC<LeaderboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'country' | 'player'>('country');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-6 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">🏆 리더보드</h1>
          <p className="text-purple-100">글로벌 순위 및 국가대항전</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('country')}
            className={`flex-1 py-3 px-4 rounded-lg font-bold transition ${
              activeTab === 'country'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            🌍 국가대항
          </button>
          <button
            onClick={() => setActiveTab('player')}
            className={`flex-1 py-3 px-4 rounded-lg font-bold transition ${
              activeTab === 'player'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            👥 개인 순위
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
                      idx < 3 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-2xl font-bold text-gray-700 min-w-8">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}️⃣`}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {country.flag} {country.name}
                        </p>
                        <p className="text-sm text-gray-600">참여 중</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">-</p>
                      <p className="text-xs text-gray-600">Firebase 연동 대기</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'player' && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-lg text-gray-600">
              게임을 플레이하면 여기에 순위가 표시됩니다! 🎮
            </p>
          </div>
        )}

        <button
          onClick={onBack}
          className="w-full mt-8 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition"
        >
          ← 뒤로가기
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
