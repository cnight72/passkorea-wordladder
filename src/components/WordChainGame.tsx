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
  const [errorMessageKo, setErrorMessageKo] = useState('');
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

  const showError = (en: string, ko: string) => {
    setErrorMessage(en);
    setErrorMessageKo(ko);
  };

  const handleSubmitWord = () => {
    if (!nextWordInput.trim()) {
      showError('Please enter a word!', '단어를 입력하세요');
      return;
    }

    const input = nextWordInput.trim();
    const wordData = WORD_DATABASE.find(w => w.word === input);

    if (!wordData) {
      showError('Word not found in the dictionary.', '사전에 없는 단어입니다');
      return;
    }

    if (usedWords.includes(input)) {
      showError('This word was already used.', '이미 사용한 단어입니다');
      return;
    }

    if (currentWord && currentWord[currentWord.length - 1] !== input[0]) {
      const required = currentWord[currentWord.length - 1];
      showError(`The word must start with "${required}".`, `"${required}"로 시작하는 단어를 입력하세요`);
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
    showError('', '');
    setWordTime(0);
  };

  const handleGameOver = () => {
    onGameEnd(totalScore, usedWords);
  };

  if (!currentWord) {
    return (
      <div className="min-h-full flex items-center justify-center bg-blue-50">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-700">Preparing game...</p>
          <p className="text-sm text-gray-500">게임 준비 중</p>
        </div>
      </div>
    );
  }

  const currentWordData = WORD_DATABASE.find(w => w.word === currentWord);
  const requiredLetter = currentWord[currentWord.length - 1];

  return (
    <div className="min-h-full bg-gradient-to-b from-blue-100 to-white">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div>
            <p className="text-xs opacity-90">📊 Score</p>
            <p className="text-2xl font-bold">{totalScore.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs opacity-90">Words</p>
            <p className="text-2xl font-bold">{wordCount}</p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-90">⏱️ Time</p>
            <p className="text-2xl font-bold">{wordTime.toFixed(1)}s</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {gameStatus === 'playing' ? (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <p className="text-center text-sm text-gray-600">Current Word</p>
              <p className="text-center text-xs text-gray-400 mb-4">현재 단어</p>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 text-center mb-4">
                <p className="text-5xl font-bold text-blue-600 mb-2">{currentWord}</p>
                {currentWordData && (
                  <p className="text-gray-700 font-semibold mb-4">{currentWordData.english}</p>
                )}
                <p className="text-gray-700">
                  Next word must start with{' '}
                  <span className="text-2xl text-blue-600 font-bold">&quot;{requiredLetter}&quot;</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  &quot;{requiredLetter}&quot;로 시작하는 단어를 입력하세요
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <label className="block text-sm font-bold text-gray-800">
                📝 Next Word
              </label>
              <p className="text-xs text-gray-500 mb-3">다음 단어 입력</p>
              <div className="flex gap-2">
                <input
                  autoFocus
                  type="text"
                  value={nextWordInput}
                  onChange={(e) => {
                    setNextWordInput(e.target.value);
                    showError('', '');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmitWord()}
                  placeholder="Type a word..."
                  className="flex-1 min-w-0 px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600 text-lg"
                />
                <button
                  onClick={handleSubmitWord}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-5 rounded-lg transition shrink-0"
                >
                  ✓
                </button>
              </div>

              {errorMessage && (
                <div className="mt-3 bg-red-100 border-2 border-red-400 text-red-700 px-4 py-2 rounded-lg">
                  <p className="text-sm font-semibold">❌ {errorMessage}</p>
                  <p className="text-xs text-red-600">{errorMessageKo}</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <p className="text-sm font-bold text-gray-800">📚 Used Words ({usedWords.length})</p>
              <p className="text-xs text-gray-500 mb-3">사용한 단어</p>
              <div className="flex flex-wrap gap-2">
                {usedWords.map((word, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {idx + 1}. {word}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setGameStatus('gameOver')}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition"
            >
              END GAME
              <span className="block text-xs font-normal text-gray-200">게임 종료</span>
            </button>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-3xl font-bold text-gray-800 mb-1">⏹️ Game Over!</p>
            <p className="text-sm text-gray-500 mb-4">게임 종료</p>
            <p className="text-6xl font-bold text-blue-600 mb-2">{totalScore.toLocaleString()}</p>
            <p className="text-gray-600 mb-8">
              {wordCount} words completed
              <span className="block text-xs text-gray-400">총 {wordCount}개 단어 성공</span>
            </p>
            <button
              onClick={handleGameOver}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition text-lg"
            >
              SEE RESULTS →
              <span className="block text-xs font-normal text-blue-100">결과 확인하기</span>
            </button>
            <button
              onClick={onCancel}
              className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg transition"
            >
              HOME
              <span className="block text-xs font-normal text-gray-500">홈으로</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordChainGame;
