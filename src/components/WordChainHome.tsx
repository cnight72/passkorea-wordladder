import { useState } from 'react';
import CountrySelector from './CountrySelector';

interface WordChainHomeProps {
  onStartGame: (playerName: string, countryCode: string) => void;
  onViewLeaderboard: () => void;
}

const WordChainHome: React.FC<WordChainHomeProps> = ({ onStartGame, onViewLeaderboard }) => {
  const [playerName, setPlayerName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('NP');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-2">🎮 PassKorea</h1>
          <h2 className="text-2xl font-semibold mb-2">Word Chain Game</h2>
          <p className="text-blue-100">끝말잇기로 한국어를 배워보세요!</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <label className="block text-sm font-bold text-gray-800 mb-3">
            👤 플레이어 이름
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="이름을 입력하세요"
            className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600 text-lg"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
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
            🚀 게임 시작
          </button>

          <button
            onClick={onViewLeaderboard}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition"
          >
            🏆 리더보드
          </button>
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-6 text-center">
          <p className="text-sm text-gray-700 mb-3">
            <strong>게임 방법:</strong>
          </p>
          <div className="text-sm text-gray-600 space-y-1">
            <p>1️⃣ 현재 단어의 마지막 글자로 시작하는 단어를 입력하세요</p>
            <p>2️⃣ 점수를 얻고 리더보드에 올라보세요</p>
            <p>3️⃣ 세계 랭킹을 목표로 하세요!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordChainHome;