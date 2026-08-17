import './App.css';
import { useEffect } from 'react';
import { useCrosswordStore } from './store/crosswordStore';
import Home from './components/Home';
import CrosswordGrid from './components/CrosswordGrid';
import ResultScreen from './components/ResultScreen';

function App() {
  const gameStatus = useCrosswordStore((state) => state.gameStatus);
  const currentCrossword = useCrosswordStore((state) => state.currentCrossword);
  const setElapsedTime = useCrosswordStore((state) => state.setElapsedTime);
  const startTime = useCrosswordStore((state) => state.startTime);

  // 타이머: 게임 진행 중 시간 업데이트
  useEffect(() => {
    if (gameStatus !== 'playing' || !startTime) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStatus, startTime, setElapsedTime]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-2">
      {/* Mobile Frame */}
      <div className="w-full max-w-md bg-black rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-900 relative">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-8 bg-black rounded-b-3xl z-50"></div>
        
        {/* Screen */}
        <div className="relative bg-white min-h-screen">
          <div className="app">
            {gameStatus === 'idle' && <Home />}
            {gameStatus === 'playing' && currentCrossword && (
              <CrosswordGrid crossword={currentCrossword} />
            )}
            {gameStatus === 'completed' && <ResultScreen />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
