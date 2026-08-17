import React, { useState } from 'react';
import { useCrosswordStore } from '../store/crosswordStore';
import type { Crossword } from '../data/crosswordData';

interface CrosswordGridProps {
  crossword: Crossword;
}

const CrosswordGrid: React.FC<CrosswordGridProps> = ({ crossword }) => {
  const { userAnswers, setCellAnswer, useHint, completeGame } =
    useCrosswordStore();
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
    null
  );
  const [showHints, setShowHints] = useState(false);

  const handleCellClick = (row: number, col: number) => {
    const cell = crossword.grid[row][col];
    if (!cell.isBlank) {
      setSelectedCell([row, col]);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => {
    const char = e.key;

    if (/^[가-힣]$/.test(char)) {
      setCellAnswer(row, col, char);
      moveToNextCell(row, col);
    } else if (char === 'Backspace') {
      setCellAnswer(row, col, '');
      moveToPreviousCell(row, col);
    } else if (char === 'ArrowRight') {
      e.preventDefault();
      setSelectedCell([row, Math.min(col + 1, crossword.size - 1)]);
    } else if (char === 'ArrowLeft') {
      e.preventDefault();
      setSelectedCell([row, Math.max(col - 1, 0)]);
    } else if (char === 'ArrowDown') {
      e.preventDefault();
      setSelectedCell([Math.min(row + 1, crossword.size - 1), col]);
    } else if (char === 'ArrowUp') {
      e.preventDefault();
      setSelectedCell([Math.max(row - 1, 0), col]);
    }
  };

  const moveToNextCell = (row: number, col: number) => {
    let nextRow = row;
    let nextCol = col + 1;

    while (
      nextRow < crossword.size &&
      (crossword.grid[nextRow][nextCol]?.isBlank ||
        crossword.grid[nextRow][nextCol] === undefined)
    ) {
      nextCol++;
      if (nextCol >= crossword.size) {
        nextCol = 0;
        nextRow++;
      }
    }

    if (nextRow < crossword.size && nextCol < crossword.size) {
      setSelectedCell([nextRow, nextCol]);
    }
  };

  const moveToPreviousCell = (row: number, col: number) => {
    let prevRow = row;
    let prevCol = col - 1;

    while (
      prevRow >= 0 &&
      (crossword.grid[prevRow][prevCol]?.isBlank ||
        crossword.grid[prevRow][prevCol] === undefined)
    ) {
      prevCol--;
      if (prevCol < 0) {
        prevCol = crossword.size - 1;
        prevRow--;
      }
    }

    if (prevRow >= 0 && prevCol >= 0) {
      setSelectedCell([prevRow, prevCol]);
    }
  };

  const handleSubmit = () => {
    completeGame();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-white mb-2 drop-shadow-lg">
            {crossword.title}
          </h1>
          <p className="text-xl text-gray-300 font-semibold">{crossword.topic}</p>
          <div className="mt-4 flex justify-center gap-4">
            <div className="bg-slate-800/50 rounded-lg px-4 py-2 border border-slate-700">
              <p className="text-gray-400 text-sm">난이도</p>
              <p className="text-white font-bold">
                {crossword.difficulty === 'easy' ? '초급 (Easy)' : '중급 (Normal)'}
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-lg px-4 py-2 border border-slate-700">
              <p className="text-gray-400 text-sm">그리드 크기</p>
              <p className="text-white font-bold">{crossword.size}×{crossword.size}</p>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-4 rounded-xl shadow-2xl border border-slate-600">
            <div
              className="inline-grid gap-0 border-4 border-slate-900 bg-slate-950"
              style={{
                gridTemplateColumns: `repeat(${crossword.size}, 1fr)`,
                width: `min(100%, ${crossword.size * 50}px)`,
              }}
            >
              {crossword.grid.map((row, rowIdx) =>
                row.map((cell, colIdx) => {
                  const isSelected =
                    selectedCell?.[0] === rowIdx && selectedCell?.[1] === colIdx;
                  const answer = userAnswers[rowIdx]?.[colIdx] || '';

                  if (cell.isBlank) {
                    return (
                      <div
                        key={`${rowIdx}-${colIdx}`}
                        className="aspect-square bg-slate-900"
                      />
                    );
                  }

                  return (
                    <div
                      key={`${rowIdx}-${colIdx}`}
                      onClick={() => handleCellClick(rowIdx, colIdx)}
                      className={`aspect-square border-2 flex flex-col items-center justify-center cursor-pointer relative transition-all ${
                        isSelected
                          ? 'bg-yellow-400 border-yellow-500 shadow-lg shadow-yellow-400/50'
                          : 'bg-white border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {cell.number && (
                        <span className="absolute top-0.5 left-0.5 text-xs font-bold text-gray-700 leading-none">
                          {cell.number}
                        </span>
                      )}
                      <input
                        type="text"
                        value={answer}
                        onChange={(e) =>
                          setCellAnswer(rowIdx, colIdx, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(e, rowIdx, colIdx)}
                        onFocus={() => setSelectedCell([rowIdx, colIdx])}
                        maxLength={1}
                        className="w-full h-full text-center text-2xl font-bold border-none outline-none bg-transparent"
                        autoFocus={isSelected}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Clues */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Across Clues */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 shadow-xl border border-slate-600">
            <h3 className="text-xl font-bold mb-4 text-white flex items-center">
              <span className="text-2xl mr-2">→</span>가로 문제
            </h3>
            <div className="space-y-3">
              {crossword.clues.across.map((clue) => (
                <div key={clue.number} className="flex gap-3 text-gray-200">
                  <span className="font-bold text-blue-400 min-w-6">{clue.number}.</span>
                  <span>{clue.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Down Clues */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 shadow-xl border border-slate-600">
            <h3 className="text-xl font-bold mb-4 text-white flex items-center">
              <span className="text-2xl mr-2">↓</span>세로 문제
            </h3>
            <div className="space-y-3">
              {crossword.clues.down.map((clue) => (
                <div key={clue.number} className="flex gap-3 text-gray-200">
                  <span className="font-bold text-red-400 min-w-6">{clue.number}.</span>
                  <span>{clue.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-center mb-6">
          <button
            onClick={() => setShowHints(!showHints)}
            className="group relative px-8 py-3 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-yellow-300/30"
          >
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-yellow-200 to-yellow-300 opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative flex items-center">
              <span className="text-xl mr-2">💡</span>
              힌트
            </div>
          </button>

          <button
            onClick={handleSubmit}
            className="group relative px-8 py-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-green-400/30"
          >
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-green-300 to-emerald-400 opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative flex items-center">
              <span className="text-xl mr-2">✓</span>
              완료
            </div>
          </button>
        </div>

        {/* Hint Panel */}
        {showHints && (
          <div className="mt-4 p-6 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl border-2 border-yellow-400 shadow-lg">
            <p className="text-sm text-yellow-200 font-semibold mb-3">
              💡 힌트 사용 시 점수에서 <strong>-30점</strong>씩 감점됩니다.
            </p>
            <button
              onClick={() => {
                useHint();
                setShowHints(false);
              }}
              className="w-full px-6 py-3 bg-gradient-to-br from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              확인하고 힌트 사용하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrosswordGrid;
