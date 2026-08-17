import React, { useState } from 'react';
import WordChainHome from './components/WordChainHome';
import WordChainGame from './components/WordChainGame';
import ResultScreen from './components/ResultScreen';
import Leaderboard from './components/Leaderboard';

type GameScreen = 'home' | 'game' | 'result' | 'leaderboard';

function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('home');
  const [gameResult, setGameResult] = useState<{ score: number; words: string[] } | null>(null);

  const handleStartGame = (difficulty: 'easy' | 'normal', country: string) => {
    setCurrentScreen('game');
  };

  const handleGameEnd = (score: number, words: string[]) => {
    setGameResult({ score, words });
    setCurrentScreen('result');
  };

  const handlePlayAgain = () => {
    setGameResult(null);
    setCurrentScreen('game');
  };

  const handleViewLeaderboard = () => {
    setCurrentScreen('leaderboard');
  };

  const handleHome = () => {
    setCurrentScreen('home');
    setGameResult(null);
  };

  return (
    <div className="bg-white">
      {currentScreen === 'home' && (
        <WordChainHome
          onStartGame={handleStartGame}
          onViewLeaderboard={handleViewLeaderboard}
        />
      )}

      {currentScreen === 'game' && (
        <WordChainGame
          onGameEnd={handleGameEnd}
          onCancel={handleHome}
        />
      )}

      {currentScreen === 'result' && gameResult && (
        <ResultScreen
          score={gameResult.score}
          words={gameResult.words}
          onPlayAgain={handlePlayAgain}
          onViewLeaderboard={handleViewLeaderboard}
          onHome={handleHome}
        />
      )}

      {currentScreen === 'leaderboard' && (
        <Leaderboard onBack={handleHome} />
      )}
    </div>
  );
}

export default App;
