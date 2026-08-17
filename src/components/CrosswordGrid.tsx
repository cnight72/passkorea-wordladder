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

    // 한글 입력
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

    // 다음 행으로 이동
    if (nextCol >= crossword.size) {
      nextCol = 0;
      nextRow += 1;
    }

    // 검은색 셀 건너뛰기
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

    // 이전 행으로 이동
    if (prevCol < 0) {
      prevCol = crossword.size - 1;
      prevRow -= 1;
    }

    // 검은색 셀 건너뛰기
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
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {crossword.title}
        </h1>
        <p className="text-gray-600">{crossword.topic}</p>
      </div>

      {/* Grid */}
      <div className="flex justify-center mb-6">
        <div
          className="inline-grid gap-0 border-4 border-gray-800 bg-white"
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
                    className="aspect-square bg-gray-800"
                  />
                );
              }

              return (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  onClick={() => handleCellClick(rowIdx, colIdx)}
                  className={`aspect-square border border-gray-400 flex flex-col items-center justify-center cursor-pointer relative transition-colors ${
                    isSelected ? 'bg-yellow-200' : 'bg-white'
                  }`}
                >
                  {cell.number && (
                    <span className="absolute top-0 left-0 text-xs font-bold p-1 text-gray-700">
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

      {/* Clues */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Across Clues */}
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h3 className="text-lg font-bold mb-3 text-gray-800">→ 가로</h3>
          <div className="space-y-2">
            {crossword.clues.across.map((clue) => (
              <div key={clue.number} className="text-sm">
                <span className="font-bold text-blue-600">{clue.number}.</span>{' '}
                {clue.text}
              </div>
            ))}
          </div>
        </div>

        {/* Down Clues */}
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h3 className="text-lg font-bold mb-3 text-gray-800">↓ 세로</h3>
          <div className="space-y-2">
            {crossword.clues.down.map((clue) => (
              <div key={clue.number} className="text-sm">
                <span className="font-bold text-red-600">{clue.number}.</span>{' '}
                {clue.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setShowHints(!showHints)}
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg"
        >
          💡 힌트
        </button>

        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg"
        >
          ✓ 완료
        </button>
      </div>

      {/* Hint Panel */}
      {showHints && (
        <div className="mt-4 p-4 bg-blue-100 rounded-lg border-2 border-blue-500">
          <p className="text-sm text-gray-700">
            💡 힌트 사용 시 점수에서 -30점씩 감점됩니다.
          </p>
          <button
            onClick={() => {
              useHint();
              setShowHints(false);
            }}
            className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded"
          >
            힌트 사용
          </button>
        </div>
      )}
    </div>
  );
};

export default CrosswordGrid;
