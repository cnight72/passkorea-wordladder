import { useState } from 'react';
import CountrySelector from './CountrySelector';
import logo from '../assets/logo.png';

interface WordChainHomeProps {
  initialName: string;
  initialCountry: string;
  bestScore: number;
  gamesPlayed: number;
  onStartGame: (playerName: string, countryCode: string) => void;
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
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Word Chain Game</h2>
          <p className="text-gray-600">Learn Korean with word chains!</p>
          <p className="text-gray-500 text-sm">끝말잇기로 한국어를 배워보세요!</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-5 mb-6">
          <p className="text-2xl text-center mb-2">🎯</p>
          <p className="text-sm text-gray-800 font-semibold text-center">
            Practice the Korean words that appear most often on the EPS-TOPIK exam.
          </p>
          <p className="text-xs text-gray-600 text-center mt-1">
            EPS-TOPIK 시험에 자주 나오는 단어 위주로 학습합니다.
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

        <div className="space-y-3">
          <button
            onClick={() => onStartGame(playerName, selectedCountry)}
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
              Enter a word starting with the last letter of the current word
              <span className="block text-xs text-gray-500 ml-4">
                현재 단어의 마지막 글자로 시작하는 단어를 입력하세요
              </span>
            </li>
            <li>
              <span className="font-bold text-blue-600 mr-1">2.</span>
              Earn points and climb the leaderboard
              <span className="block text-xs text-gray-500 ml-4">
                점수를 얻고 리더보드에 올라보세요
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
