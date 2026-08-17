import React, { useEffect, useState } from 'react';
import { COUNTRIES } from '../data/countries';
import type { LeaderboardData } from '../lib/leaderboard';
import { fetchLeaderboard } from '../lib/leaderboard';

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
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchLeaderboard().then((result) => {
      if (cancelled) return;
      if (result) setData(result);
      else setFailed(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const myFlag = COUNTRIES.find((c) => c.code === myCountry)?.flag ?? '🏳️';
  const myCountryName = COUNTRIES.find((c) => c.code === myCountry)?.name ?? myCountry;

  const standingOf = (code: string) => data?.standings.find((s) => s.countryCode === code);
  const rankOf = (code: string) => {
    const idx = data?.standings.findIndex((s) => s.countryCode === code) ?? -1;
    return idx >= 0 ? idx + 1 : null;
  };

  // 참여자가 있는 나라를 순위대로 먼저, 아직 없는 나라는 뒤에
  const ranked = data ? data.standings.map((s) => s.countryCode) : [];
  const empty = COUNTRIES.filter((c) => !ranked.includes(c.code)).map((c) => c.code);
  const ordered = [...ranked, ...empty];

  return (
    <div className="min-h-full bg-gradient-to-b from-blue-50 to-white">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">🏆 Leaderboard</h1>
          <p className="text-purple-200 text-sm mb-2">리더보드</p>
          <p className="text-purple-100">
            {data
              ? `${data.totalPlayers} players from ${data.standings.length} countries`
              : 'Global ranking & country battle'}
          </p>
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
            👥 You
            <span className="block text-xs font-normal opacity-75">나의 기록</span>
          </button>
        </div>

        {activeTab === 'country' && (
          <>
            {!data && !failed && (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <p className="text-gray-700">Loading rankings...</p>
                <p className="text-sm text-gray-500">순위를 불러오는 중</p>
              </div>
            )}

            {failed && (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <p className="text-gray-700">Could not load rankings.</p>
                <p className="text-sm text-gray-500 mb-1">순위를 불러오지 못했습니다</p>
                <p className="text-xs text-gray-400">
                  Check your connection and try again. / 연결을 확인하고 다시 시도해 주세요.
                </p>
              </div>
            )}

            {data && (
              <>
                <p className="text-xs text-gray-600 text-center mb-3">
                  Ranked by average best score, not total.
                  <span className="block text-gray-400">
                    총점이 아니라 참여자 평균 점수 순입니다
                  </span>
                </p>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="divide-y">
                    {ordered.map((code) => {
                      const country = COUNTRIES.find((c) => c.code === code);
                      if (!country) return null;

                      const standing = standingOf(code);
                      const rank = rankOf(code);
                      const isMine = code === myCountry;

                      return (
                        <div
                          key={code}
                          className={`p-4 flex items-center justify-between ${
                            isMine
                              ? 'bg-purple-50 ring-2 ring-inset ring-purple-400'
                              : rank !== null && rank <= 3
                                ? 'bg-gradient-to-r from-yellow-50 to-yellow-100'
                                : ''
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="text-xl font-bold text-gray-700 w-8 shrink-0 text-center">
                              {rank === 1
                                ? '🥇'
                                : rank === 2
                                  ? '🥈'
                                  : rank === 3
                                    ? '🥉'
                                    : rank !== null
                                      ? rank
                                      : '–'}
                            </span>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-800 truncate">
                                {country.flag} {country.name}
                                {isMine && (
                                  <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full align-middle">
                                    YOU
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-gray-500">
                                {standing
                                  ? `${standing.players} players · top ${standing.topScore.toLocaleString()}`
                                  : 'Be the first! / 첫 주자가 되세요'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0 ml-2">
                            <p className="text-xl font-bold text-purple-600">
                              {standing ? standing.averageScore.toLocaleString() : '–'}
                            </p>
                            <p className="text-xs text-gray-500">avg</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'player' && (
          <div className="space-y-4">
            {gamesPlayed > 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <p className="text-sm font-bold text-gray-800">Your Record</p>
                <p className="text-xs text-gray-500 mb-4">나의 기록</p>

                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl">{myFlag}</span>
                  <div>
                    <p className="font-bold text-gray-800">{playerName}</p>
                    <p className="text-xs text-gray-500">{myCountryName}</p>
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

                {data && rankOf(myCountry) !== null && (
                  <p className="text-sm text-center text-gray-700 mt-5">
                    {myFlag} {myCountryName} is ranked{' '}
                    <strong className="text-purple-700">#{rankOf(myCountry)}</strong> of{' '}
                    {data.standings.length}
                    <span className="block text-xs text-gray-500">
                      참여 중인 {data.standings.length}개국 중 {rankOf(myCountry)}위입니다
                    </span>
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <p className="text-lg text-gray-700">Play a game to appear here! 🎮</p>
                <p className="text-sm text-gray-500 mt-1">
                  게임을 플레이하면 여기에 기록이 표시됩니다
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
