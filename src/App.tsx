import './App.css';
import { useGameStore } from './store/gameStore';
import GameStart from './components/GameStart';
import GamePlay from './components/GamePlay';

function App() {
  const gameStatus = useGameStore((state) => state.gameStatus);
  const resetGame = useGameStore((state) => state.resetGame);

  return (
    <div className="app">
      {gameStatus === 'idle' && <GameStart />}
      {gameStatus === 'playing' && <GamePlay />}
      {gameStatus === 'completed' && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              게임 완료! 🎉
            </h1>
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-blue-500 text-white rounded-lg font-bold text-lg hover:bg-blue-600"
            >
              다시 시작
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
