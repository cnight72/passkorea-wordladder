import './App.css';
import { useState } from 'react';
import WordChainHome from './components/WordChainHome';
import WordChainGame from './components/WordChainGame';
import ResultScreen from './components/ResultScreen';
import Leaderboard from './components/Leaderboard';
import type { Profile } from './lib/storage';
import { loadProfile, saveProfile } from './lib/storage';

type GameScreen = 'home' | 'game' | 'result' | 'leaderboard';

function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('home');
  const [gameResult, setGameResult] = useState<{ score: number; words: string[] } | null>(null);
  const [profile, setProfile] = useState<Profile>(() => loadProfile());
  const [isNewBest, setIsNewBest] = useState(false);

  const persist = (next: Profile) => {
    setProfile(next);
    saveProfile(next);
  };

  const handleStartGame = (name: string, country: string) => {
    persist({ ...profile, playerName: name.trim() || 'Player', countryCode: country });
    setCurrentScreen('game');
  };

  const handleGameEnd = (score: number, words: string[]) => {
    const beatsBest = score > profile.bestScore;

    setGameResult({ score, words });
    setIsNewBest(beatsBest);
    persist({
      ...profile,
      bestScore: beatsBest ? score : profile.bestScore,
      gamesPlayed: profile.gamesPlayed + 1,
    });
    setCurrentScreen('result');
  };

  const handlePlayAgain = () => {
    setGameResult(null);
    setIsNewBest(false);
    setCurrentScreen('game');
  };

  const handleViewLeaderboard = () => {
    setCurrentScreen('leaderboard');
  };

  const handleHome = () => {
    setGameResult(null);
    setIsNewBest(false);
    setCurrentScreen('home');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-2">
      {/* Mobile Frame */}
      <div className="w-full max-w-md bg-black rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-900 relative">
        {/* Screen */}
        <div className="relative bg-white h-[calc(100dvh-2rem)] overflow-y-auto">
          {/* Status bar with notch */}
          <div className="sticky top-0 z-50 h-8 bg-black flex items-center justify-center">
            <div className="w-24 h-4 bg-gray-800 rounded-full"></div>
          </div>

          {currentScreen === 'home' && (
            <WordChainHome
              initialName={profile.playerName}
              initialCountry={profile.countryCode}
              bestScore={profile.bestScore}
              gamesPlayed={profile.gamesPlayed}
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
              playerName={profile.playerName}
              countryCode={profile.countryCode}
              bestScore={profile.bestScore}
              isNewBest={isNewBest}
              onPlayAgain={handlePlayAgain}
              onViewLeaderboard={handleViewLeaderboard}
              onHome={handleHome}
            />
          )}

          {currentScreen === 'leaderboard' && (
            <Leaderboard
              myCountry={profile.countryCode}
              playerName={profile.playerName}
              bestScore={profile.bestScore}
              gamesPlayed={profile.gamesPlayed}
              onBack={handleHome}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
