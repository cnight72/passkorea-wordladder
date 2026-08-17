import './App.css';
import { useState } from 'react';
import WordChainHome from './components/WordChainHome';
import type { GameMode } from './components/WordChainHome';
import VocabQuiz from './components/VocabQuiz';
import ExamQuiz from './components/ExamQuiz';
import ReviewQuiz from './components/ReviewQuiz';
import ResultScreen from './components/ResultScreen';
import Leaderboard from './components/Leaderboard';
import AboutScreen from './components/AboutScreen';
import type { Profile } from './lib/storage';
import { loadProfile, saveProfile } from './lib/storage';
import { reviewCount } from './lib/review';
import { submitScore } from './lib/leaderboard';

type GameScreen = 'home' | 'game' | 'review' | 'result' | 'leaderboard' | 'about';

function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('home');
  const [gameResult, setGameResult] = useState<{ score: number; words: string[] } | null>(null);
  const [profile, setProfile] = useState<Profile>(() => loadProfile());
  const [isNewBest, setIsNewBest] = useState(false);
  const [mode, setMode] = useState<GameMode>({ kind: 'vocab', theme: 'all' });
  // 홈으로 돌아올 때마다 다시 세도록 화면 전환을 의존성으로 삼는다
  const pendingReviews = currentScreen === 'home' ? reviewCount() : 0;

  const persist = (next: Profile) => {
    setProfile(next);
    saveProfile(next);
  };

  const handleStartGame = (name: string, country: string, selectedMode: GameMode) => {
    persist({ ...profile, playerName: name.trim() || 'Player', countryCode: country });
    setMode(selectedMode);
    setCurrentScreen('game');
  };

  const handleGameEnd = (score: number, words: string[]) => {
    const beatsBest = score > profile.bestScore;
    const next: Profile = {
      ...profile,
      bestScore: beatsBest ? score : profile.bestScore,
      gamesPlayed: profile.gamesPlayed + 1,
    };

    setGameResult({ score, words });
    setIsNewBest(beatsBest);
    persist(next);
    setCurrentScreen('result');

    // 리더보드 반영은 실패해도 게임 진행을 막지 않는다
    void submitScore(next);
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
    <div className="bg-white md:min-h-screen md:bg-black md:flex md:items-center md:justify-center md:p-2">
      {/* 폰 프레임은 데스크톱 장식이다. 실제 폰에서는 프레임 없이 전체 화면을 쓴다. */}
      <div className="relative w-full md:max-w-md md:bg-black md:rounded-3xl md:shadow-2xl md:overflow-hidden md:border-8 md:border-gray-900">
        {/* Screen */}
        <div className="relative bg-white h-dvh md:h-[calc(100dvh-2rem)] overflow-y-auto">
          {/* 가짜 상태바도 데스크톱에서만 (실제 폰에는 진짜 상태바가 있다) */}
          <div className="hidden md:flex sticky top-0 z-50 h-8 bg-black items-center justify-center">
            <div className="w-24 h-4 bg-gray-800 rounded-full"></div>
          </div>

          {currentScreen === 'home' && (
            <WordChainHome
              initialName={profile.playerName}
              initialCountry={profile.countryCode}
              bestScore={profile.bestScore}
              gamesPlayed={profile.gamesPlayed}
              reviewCount={pendingReviews}
              onStartGame={handleStartGame}
              onReview={() => setCurrentScreen('review')}
              onViewLeaderboard={handleViewLeaderboard}
              onAbout={() => setCurrentScreen('about')}
            />
          )}

          {currentScreen === 'game' && mode.kind === 'vocab' && (
            <VocabQuiz
              theme={mode.theme}
              onGameEnd={handleGameEnd}
              onCancel={handleHome}
            />
          )}

          {currentScreen === 'game' && mode.kind === 'exam' && (
            <ExamQuiz
              industry={mode.industry}
              onGameEnd={handleGameEnd}
              onCancel={handleHome}
            />
          )}

          {currentScreen === 'review' && <ReviewQuiz onDone={handleHome} />}

          {currentScreen === 'about' && <AboutScreen onBack={handleHome} />}

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
