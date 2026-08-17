import React, { useState } from 'react';
import CountrySelector from './CountrySelector';

interface WordChainHomeProps {
  onStartGame: (difficulty: 'easy' | 'normal', country: string) => void;
  onViewLeaderboard: () => void;
}

const WordChainHome: React.FC<WordChainHomeProps> = ({ onStartGame, onViewLeaderboard }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'normal'>('easy');
  const [selectedCountry, setSelectedCountry] = useState<string>('NP');
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  const COUNTRIES: { [key: string]: { flag: string; name: string; nativeName: string } } = {
    NP: { flag: '🇳🇵', name: 'Nepal', nativeName: 'नेपाल' },
    ID: { flag: '🇮🇩', name: 'Indonesia', nativeName: 'Indonesia' },
    PH: { flag: '🇵🇭', name: 'Philippines', nativeName: 'Pilipinas' },
  };

  const selectedCountryData = COUNTRIES[selectedCountry];

  const handleStartGame = () => {
    if (!playerName.trim()) {
      alert('이름을 입력해주세요!');
      return;
    }
    onStartGame(selectedDifficulty, selectedCountry);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 px-4">
        <h1 className="text-4xl font-bold text-center mb-2">🎮 PassKorea</h1>
        <h2 className="text-2xl font-semibold text-center mb-2">Word Chain Game</h2>
        <p className="text-center text-blue-100">끝말 잇기로 배우는 한국어!</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📖 게임 설명</h3>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>시작 단어</strong> → 마지막 글자로 <strong>새 단어 입력</strong> → 반복!
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-center">
                <span className="font-semibold text-blue-600">가자</span>
                <span className="text-gray-500"> → </span>
                <span className="font-semibold text-blue-600">자전거</span>
                <span className="text-gray-500"> → </span>
                <span className="font-semibold text-blue-600">거위</span>
                <span className="text-gray-500"> → </span>
                <span className="font-semibold text-blue-600">위장약</span>
              </p>
            </div>
            <p className="text-sm text-gray-600">
              ✓ 점수 = 글자 수 × 10점 + 시간 보너스
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6 space-y-6">
          {!showNameInput ? (
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                📝 플레이어 이름
              </label>
              <button
                onClick={() => setShowNameInput(true)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition"
              >
                {playerName || '이름 입력'}
              </button>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                📝 플레이어 이름
              </label>
              <div className="flex gap-2">
                <input
                  autoFocus
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && setShowNameInput(false)}
                  placeholder="이름을 입력하세요"
                  className="flex-1 px-4 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
                <button
                  onClick={() => setShowNameInput(false)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                >
                  완료
                </button>
              </div>
            </div>
          )}

          {!showCountrySelector ? (
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                🌍 국가 선택
              </label>
              <button
                onClick={() => setShowCountrySelector(true)}
                className="w-full bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-gray-800 py-3 px-4 rounded-lg transition flex items-center justify-center gap-3 font-semibold"
              >
                <span className="text-3xl">{selectedCountryData?.flag}</span>
                <div className="text-left">
                  <p className="text-lg">{selectedCountryData?.name}</p>
                  <p className="text-xs text-gray-600">{selectedCountryData?.nativeName}</p>
                </div>
              </button>
            </div>
          ) : (
            <CountrySelector
              selectedCountry={selectedCountry}
              onSelect={(code) => {
                setSelectedCountry(code);
                setShowCountrySelector(false);
              }}
            />
          )}

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3">
              ⚡ 난이도 선택
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedDifficulty('easy')}
                className={`py-4 px-4 rounded-lg font-semibold transition ${
                  selectedDifficulty === 'easy'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                <p className="text-2xl mb-1">🟢</p>
                <p>초급</p>
              </button>

              <button
                onClick={() => setSelectedDifficulty('normal')}
                className={`py-4 px-4 rounded-lg font-semibold transition ${
                  selectedDifficulty === 'normal'
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                <p className="text-2xl mb-1">🔴</p>
                <p>중급</p>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleStartGame}
            disabled={!playerName.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-4 rounded-lg transition text-lg"
          >
            🎮 게임 시작
          </button>

          <button
            onClick={onViewLeaderboard}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            🏆 리더보드 보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default WordChainHome;
