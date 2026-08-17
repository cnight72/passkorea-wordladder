import React from 'react';
import { useGameStore } from '../store/gameStore';

const GameStart: React.FC = () => {
  const startGame = useGameStore((state) => state.startGame);

  const difficulties = [
    {
      level: 'easy' as const,
      name: '초급',
      description: '쉬운 단어',
      points: '50점',
      color: 'bg-green-500',
    },
    {
      level: 'normal' as const,
      name: '중급',
      description: '일반 단어',
      points: '100점',
      color: 'bg-blue-500',
    },
    {
      level: 'hard' as const,
      name: '고급',
      description: '어려운 단어',
      points: '150점',
      color: 'bg-yellow-500',
    },
    {
      level: 'expert' as const,
      name: '전문가',
      description: '매우 어려운 단어',
      points: '200점',
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">
            Word Ladder
          </h1>
          <p className="text-xl text-gray-600">
            한국어 단어를 한 글자씩 바꾸며 배우세요!
          </p>
        </div>

        {/* Difficulty Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {difficulties.map((difficulty) => (
            <button
              key={difficulty.level}
              onClick={() => startGame(difficulty.level)}
              className={`${difficulty.color} hover:shadow-lg transform hover:scale-105 transition-all duration-200 p-6 rounded-lg text-white text-left`}
            >
              <div className="font-bold text-lg mb-1">{difficulty.name}</div>
              <div className="text-sm opacity-90 mb-3">{difficulty.description}</div>
              <div className="font-semibold text-lg">{difficulty.points}</div>
            </button>
          ))}
        </div>

        {/* Info Box */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="font-bold text-lg mb-3 text-gray-800">게임 규칙</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-500 font-bold mr-3">1.</span>
              <span>현재 단어에서 한 글자만 바꿔서 다음 단어를 만드세요</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-bold mr-3">2.</span>
              <span>정답을 맞춘 후 다음 단어로 넘어가세요</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-bold mr-3">3.</span>
              <span>3회 이상 틀리면 힌트를 사용하거나 정답을 봐야 합니다</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-bold mr-3">4.</span>
              <span>연속으로 맞출수록 점수가 2배, 3배가 됩니다!</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GameStart;
