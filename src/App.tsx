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
    <div className="app">
      {gameStatus === 'idle' && <Home />}
      {gameStatus === 'playing' && currentCrossword && (
        <CrosswordGrid crossword={currentCrossword} />
      )}
      {gameStatus === 'completed' && <ResultScreen />}
    </div>
  );
}

export default App;
