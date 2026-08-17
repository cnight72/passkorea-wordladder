import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';

const GamePlay: React.FC = () => {
  const {
    currentWordLadder,
    currentIndex,
    userGuess,
    attempts,
    credits,
    submitGuess,
    nextWord,
    useHint,
    isCorrect,
  } = useGameStore();

  const [showHintMenu, setShowHintMenu] = useState(false);
  const [selectedHint, setSelectedHint] = useState<'consonant' | 'vowel' | 'answer' | null>(null);

  if (!currentWordLadder) {
    return <div>Loading...</div>;
  }

  const currentWord = currentWordLadder.words[currentIndex];
  const targetWord = currentWordLadder.words[currentIndex + 1];
  const totalWords = currentWordLadder.words.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userGuess.trim()) return;

    submitGuess(userGuess);
  };

  const handleHintClick = (type: 'consonant' | 'vowel' | 'answer') => {
    const costs = { consonant: 5, vowel: 5, answer: 15 };
    if (credits >= costs[type]) {
      useHint(type);
      setSelectedHint(type);
      setShowHintMenu(false);
    }
  };

  const getHint = (type: 'consonant' | 'vowel' | 'answer'): string => {
    if (type === 'consonant') {
      return targetWord
        .split('')
        .map((char) => {
          const korean = /[ㄱ-ㅎ]/.test(char) ? char : '_';
          return korean;
        })
        .join('');
    }
    if (type === 'vowel') {
      return targetWord
        .split('')
        .map((char) => {
          const korean = /[ㅏ-ㅣ]/.test(char) ? char : '_';
          return korean;
        })
        .join('');
    }
    return targetWord;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Word Ladder</h1>
          <div className="text-right">
            <div className="text-sm text-gray-600">크레딧</div>
            <div className="text-2xl font-bold text-blue-600">{credits}</div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-600">진행률</span>
            <span className="text-sm text-gray-600">
              {currentIndex + 1} / {totalWords - 1}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / (totalWords - 1)) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Word Ladder Display */}
        <div className="bg-white rounded-lg p-8 shadow-md mb-6">
          <div className="text-center">
            {/* Word Chain */}
            <div className="mb-8">
              {currentWordLadder.words.map((word, idx) => (
                <div key={idx}>
                  <div
                    className={`text-2xl font-bold p-3 rounded-lg mb-2 ${
                      idx === currentIndex
                        ? 'bg-blue-500 text-white'
                        : idx < currentIndex
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {word}
                  </div>
                  {idx < currentWordLadder.words.length - 1 && (
                    <div className="text-2xl text-gray-400 mb-2">↓</div>
                  )}
                </div>
              ))}
            </div>

            {/* Challenge */}
            <div className="mb-6">
              <p className="text-gray-600 mb-2">
                "{currentWord}"에서 한 글자만 바꿔서 "{targetWord}"를
                만드세요!
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userGuess}
                  onChange={(e) => useGameStore.setState({ userGuess: e.target.value })}
                  placeholder="답을 입력하세요"
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  disabled={isCorrect}
                />
                <button
                  type="submit"
                  disabled={isCorrect || !userGuess.trim()}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-400"
                >
                  제출
                </button>
              </div>
            </form>

            {/* Feedback */}
            {attempts > 0 && (
              <div
                className={`p-4 rounded-lg mb-4 ${
                  isCorrect
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-red-100 text-red-700 border border-red-300'
                }`}
              >
                {isCorrect ? (
                  <div className="font-semibold">정답입니다! 🎉</div>
                ) : (
                  <div className="font-semibold">
                    틀렸습니다. ({attempts}/3) 다시 시도해보세요.
                  </div>
                )}
              </div>
            )}

            {/* Next Button */}
            {isCorrect && (
              <button
                onClick={() => nextWord()}
                className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
              >
                다음 단어 →
              </button>
            )}

            {/* Hint and Give Up */}
            {attempts >= 3 && !isCorrect && (
              <div className="space-y-3">
                <div className="relative">
                  <button
                    onClick={() => setShowHintMenu(!showHintMenu)}
                    className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-semibold"
                  >
                    💡 힌트 보기 / 정답 공개
                  </button>

                  {showHintMenu && (
                    <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                      <button
                        onClick={() => handleHintClick('consonant')}
                        disabled={credits < 5}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        자음 힌트 (5 크레딧) - {getHint('consonant')}
                      </button>
                      <button
                        onClick={() => handleHintClick('vowel')}
                        disabled={credits < 5}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        모음 힌트 (5 크레딧) - {getHint('vowel')}
                      </button>
                      <button
                        onClick={() => handleHintClick('answer')}
                        disabled={credits < 15}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                      >
                        정답 공개 (15 크레딧) - {targetWord}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="text-center text-sm text-gray-600">
          카테고리: {currentWordLadder.category} | 주제: {currentWordLadder.topic}
        </div>
      </div>
    </div>
  );
};

export default GamePlay;
