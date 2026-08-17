import React, { useState, useEffect } from 'react';

const WORD_DATABASE = [
  { word: '가자', hangul: '가자', english: 'Let\'s go', meaning: '어디론가 함께 가자는 뜻' },
  { word: '자전거', hangul: '자전거', english: 'Bicycle', meaning: '페달로 움직이는 탈것' },
  { word: '거위', hangul: '거위', english: 'Goose', meaning: '오리처럼 생긴 새' },
  { word: '위장약', hangul: '위장약', english: 'Digestive medicine', meaning: '위장병에 쓰는 약' },
  { word: '약속', hangul: '약속', english: 'Promise', meaning: '정해진 시간에 만나기로 함' },
  { word: '속담', hangul: '속담', english: 'Proverb', meaning: '오래전부터 내려오는 말' },
  { word: '담배', hangul: '담배', english: 'Cigarette', meaning: '피우는 기호품' },
  { word: '배우', hangul: '배우', english: 'Actor', meaning: '영화나 연극을 하는 사람' },
  { word: '우산', hangul: '우산', english: 'Umbrella', meaning: '비를 막는 물건' },
  { word: '산책', hangul: '산책', english: 'Walk', meaning: '느리게 걷는 활동' },
];

interface WordChainGameProps {
  onGameEnd: (score: number, words: string[]) => void;
  onCancel: () => void;
}

const WordChainGame: React.FC<WordChainGameProps> = ({ onGameEnd, onCancel }) => {
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [nextWordInput, setNextWordInput] = useState('');
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'gameOver'>('playing');
  const [errorMessage, setErrorMessage] = useState('');
  const [wordTime, setWordTime] = useState(0);

  useEffect(() => {
    const randomWord = WORD_DATABASE[Math.floor(Math.random() * WORD_DATABASE.length)];
    setCurrentWord(randomWord.word);
    setUsedWords([randomWord.word]);
    setWordCount(1);
  }, []);

  useEffect(() => {
    if (gameStatus === 'playing') {
      const timer = setInterval(() => {
        setWordTime(prev => prev + 0.1);
      }, 100);
      return () => clearInterval(timer);
    }
  }, [gameStatus]);

  const handleSubmitWord = () => {
    if (!nextWordInput.trim()) {
      setErrorMessage('단어를 입력하세요!');
      return;
    }

    const input = nextWordInput.trim();
    const wordData = WORD_DATABASE.find(w => w.word === input);

    if (!wordData) {
      setErrorMessage('데이터베이스에 없는 단어입니다.');
      return;
    }

    if (usedWords.includes(input)) {
      setErrorMessage('이미 사용한 단어입니다.');
      return;
    }

    if (currentWord && currentWord[currentWord.length - 1] !== input[0]) {
      setErrorMessage(`"${currentWord[currentWord.length - 1]}"로 시작하는 단어를 입력하세요!`);
      return;
    }

    const scoreBreakdown = {
      base: input.length * 10,
      timeBonus: wordTime <= 5 ? 20 : wordTime <= 10 ? 10 : 0,
      completionBonus: wordCount > 0 && wordCount % 10 === 9 ? 50 : 0,
    };
    const wordScore = scoreBreakdown.base + scoreBreakdown.timeBonus + scoreBreakdown.completionBonus;

    setCurrentWord(input);
    setUsedWords([...usedWords, input]);
    setTotalScore(totalScore + wordScore);
    setWordCount(wordCount + 1);
    setNextWordInput('');
    setErrorMessage('');
    setWordTime(0);
  };

  const handleGameOver = () => {
    onGameEnd(totalScore, usedWords);
  };

  if (!currentWord) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <p className="text-xl font-semibold text-gray-700">게임 준비 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div>
            <p className="text-sm opacity-90">📊 점수</p>
            <p className="text-2xl font-bold">{totalScore.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm opacity-90">단어</p>
            <p className="text-2xl font-bold">{wordCount}개</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">⏱️ 시간</p>
            <p className="text-2xl font-bold">{wordTime.toFixed(1)}초</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {gameStatus === 'playing' ? (
          <>
            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
              <p className="text-center text-sm text-gray-600 mb-4">현재 단어</p>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 text-center mb-6">
                <p className="text-5xl font-bold text-blue-600 mb-4">{currentWord}</p>
                <p className="text-lg text-gray-700">
                  <strong>다음 단어:</strong> <span className="text-2xl text-blue-600 font-semibold">"{currentWord[currentWord.length - 1]}"</span>로 시작하세요!
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <label className="block text-sm font-bold text-gray-800 mb-3">
                📝 다음 단어 입력
              </label>
              <div className="flex gap-2">
                <input
                  autoFocus
                  type="text"
                  value={nextWordInput}
                  onChange={(e) => {
                    setNextWordInput(e.target.value);
                    setErrorMessage('');
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmitWord()}
                  placeholder="단어 입력..."
                  className="flex-1 px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600 text-lg"
                />
                <button
                  onClick={handleSubmitWord}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition"
                >
                  제출 ✓
                </button>
              </div>

              {errorMessage && (
                <div className="mt-3 bg-red-100 border-2 border-red-400 text-red-700 px-4 py-2 rounded-lg">
                  <p className="text-sm"><strong>❌</strong> {errorMessage}</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <p className="text-sm font-bold text-gray-800 mb-3">📚 사용한 단어 ({usedWords.length})</p>
              <div className="flex flex-wrap gap-2">
                {usedWords.map((word, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {idx + 1}. {word}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={onCancel}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition"
            >
              게임 나가기
            </button>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-4xl font-bold text-gray-800 mb-4">⏹️ 게임 오버!</p>
            <p className="text-6xl font-bold text-blue-600 mb-2">{totalScore.toLocaleString()}</p>
            <p className="text-gray-600 mb-8">총 {wordCount}개 단어 성공!</p>
            <button
              onClick={handleGameOver}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition text-lg"
            >
              결과 확인하기 →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordChainGame;
