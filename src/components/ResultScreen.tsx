import { COUNTRIES } from '../data/countries';
import MockTestCta from './MockTestCta';

interface ResultScreenProps {
  score: number;
  words: string[];
  playerName: string;
  countryCode: string;
  bestScore: number;
  isNewBest: boolean;
  onPlayAgain: () => void;
  onViewLeaderboard: () => void;
  onHome: () => void;
  /** 이름이 없을 때 리더보드 참여를 위해 설정으로 보낸다 */
  onJoinLeaderboard: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  score,
  words,
  playerName,
  countryCode,
  bestScore,
  isNewBest,
  onPlayAgain,
  onViewLeaderboard,
  onHome,
  onJoinLeaderboard,
}) => {
  const country = COUNTRIES.find((c) => c.code === countryCode);
  const hasName = playerName.trim().length > 0;

  const getMedalEmoji = (score: number) => {
    if (score >= 500) return '🥇';
    if (score >= 300) return '🥈';
    if (score >= 100) return '🥉';
    return '🎖️';
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-green-50 to-white">
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-10 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-5xl mb-4">{getMedalEmoji(score)}</p>
          <h1 className="text-4xl font-bold mb-1">Game Over!</h1>
          <p className="text-green-200 text-sm mb-3">게임 종료</p>
          {hasName && (
            <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-2">
              <span className="text-2xl">{country?.flag ?? '🏳️'}</span>
              <span className="font-semibold">{playerName}</span>
              <span className="text-green-100 text-sm">{country?.name ?? countryCode}</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="text-center mb-8">
            {isNewBest && (
              <p className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
                🎉 NEW BEST SCORE! / 최고 기록 갱신!
              </p>
            )}
            <p className="text-sm text-gray-600">Final Score</p>
            <p className="text-xs text-gray-400 mb-2">최종 점수</p>
            <p className="text-5xl font-bold text-green-600">
              {score.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Best / 최고 기록: {bestScore.toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Correct</p>
              <p className="text-xs text-gray-400 mb-1">맞힌 문제</p>
              <p className="text-3xl font-bold text-blue-600">{words.length}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Avg. Score</p>
              <p className="text-xs text-gray-400 mb-1">문제당 평균</p>
              <p className="text-3xl font-bold text-purple-600">
                {words.length > 0 ? Math.round(score / words.length) : 0}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-bold text-gray-800">📚 Words You Got Right</p>
            <p className="text-xs text-gray-500 mb-3">맞힌 단어</p>
            <div className="flex flex-wrap gap-2">
              {words.map((word, idx) => (
                <span
                  key={idx}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <MockTestCta />
        </div>

        {!hasName && (
          <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-5 mb-6 text-center">
            <p className="text-3xl mb-2">🏆</p>
            <p className="text-sm font-bold text-purple-900">
              Put your country on the leaderboard!
            </p>
            <p className="text-xs text-gray-600 mb-4">
              이름과 국가를 정하면 국가대항전에 참여합니다
            </p>
            <button
              onClick={onJoinLeaderboard}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition"
            >
              JOIN — takes 10 seconds
              <span className="block text-xs font-normal text-purple-100">참여하기 — 10초면 됩니다</span>
            </button>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={onPlayAgain}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            🔄 PLAY AGAIN
            <span className="block text-xs font-normal text-blue-100">다시 하기</span>
          </button>

          <button
            onClick={onViewLeaderboard}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            🏆 LEADERBOARD
            <span className="block text-xs font-normal text-purple-100">리더보드</span>
          </button>

          <button
            onClick={onHome}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            🏠 HOME
            <span className="block text-xs font-normal text-gray-200">홈으로</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
