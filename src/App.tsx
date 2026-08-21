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
import SharedQuestion from './components/SharedQuestion';
import type { DeepLink } from './lib/deeplink';
import { clearDeepLink, parseDeepLink } from './lib/deeplink';
import type { IndustryId } from './data/exams';
import type { Profile } from './lib/storage';
import { loadProfile, saveProfile } from './lib/storage';
import { reviewCount } from './lib/review';
import { submitScore } from './lib/leaderboard';

/** 'settings'는 예전 홈 화면. 이름·국가·주제를 바꿀 때만 들어간다. */
type GameScreen = 'settings' | 'game' | 'review' | 'result' | 'leaderboard' | 'about' | 'shared';

/** 쇼츠 링크로 들어왔는지 최초 1회만 판별한다 */
const initialLink: DeepLink | null = parseDeepLink(window.location.search);

/**
 * 단일 문항 링크는 그 문항부터, 그 외에는 곧바로 퀴즈로 보낸다.
 * 심심풀이로 들어온 사람에게 설정부터 요구하면 첫 문제를 보기 전에 나간다.
 */
const initialScreen: GameScreen =
  initialLink?.kind === 'vocabWord' || initialLink?.kind === 'examQuestion' ? 'shared' : 'game';

/**
 * 주제를 지정하지 않고 들어오면 기초 생활(1~10과)부터 낸다.
 * 'all'로 두면 2,101단어에서 고르게 뽑혀 첫 문제가 '법률 교육' 같은 것이 나온다.
 * 쇼츠·채널 링크로 오는 사람은 대부분 초급자다. 전체를 풀려면 홈에서 주제를 바꾸면 된다.
 */
const initialMode: GameMode =
  initialLink?.kind === 'vocabTheme'
    ? { kind: 'vocab', theme: initialLink.theme }
    : initialLink?.kind === 'examIndustry'
      ? { kind: 'exam', industry: initialLink.industry as IndustryId }
      : { kind: 'vocab', theme: 'basic' };

function App() {
  const [deepLink] = useState<DeepLink | null>(initialLink);
  const [currentScreen, setCurrentScreen] = useState<GameScreen>(initialScreen);
  const [gameResult, setGameResult] = useState<{ score: number; words: string[] } | null>(null);
  const [profile, setProfile] = useState<Profile>(() => loadProfile());
  const [isNewBest, setIsNewBest] = useState(false);
  const [mode, setMode] = useState<GameMode>(initialMode);
  // 설정 화면에 들어올 때마다 다시 세도록 화면 전환을 의존성으로 삼는다
  const pendingReviews = currentScreen === 'settings' ? reviewCount() : 0;

  const persist = (next: Profile) => {
    setProfile(next);
    saveProfile(next);
  };

  const handleStartGame = (name: string, country: string, selectedMode: GameMode) => {
    // 이름은 비워둘 수 있다. 리더보드에 올릴 때만 필요하다.
    persist({ ...profile, playerName: name.trim(), countryCode: country });
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

  /** 문제 화면으로 돌아간다. 이 앱의 기본 자리는 설정이 아니라 퀴즈다. */
  const handleHome = () => {
    setGameResult(null);
    setIsNewBest(false);
    // 새로고침했을 때 링크로 들어온 문항이 다시 뜨지 않도록 주소창을 정리한다
    clearDeepLink();
    setCurrentScreen('game');
  };

  const handleSettings = () => {
    setGameResult(null);
    setIsNewBest(false);
    clearDeepLink();
    setCurrentScreen('settings');
  };

  /** 쇼츠에서 본 문항을 푼 뒤 이어서 전체 퀴즈로 */
  const handleContinueFromShared = () => {
    clearDeepLink();
    if (deepLink?.kind === 'examQuestion') {
      const dash = deepLink.id.lastIndexOf('-');
      if (dash > 0) setMode({ kind: 'exam', industry: deepLink.id.slice(0, dash) as IndustryId });
    }
    setCurrentScreen('game');
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

          {currentScreen === 'settings' && (
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
              onCancel={handleSettings}
              onSettings={handleSettings}
            />
          )}

          {currentScreen === 'game' && mode.kind === 'exam' && (
            <ExamQuiz
              industry={mode.industry}
              onGameEnd={handleGameEnd}
              onCancel={handleSettings}
              onSettings={handleSettings}
            />
          )}

          {currentScreen === 'shared' && deepLink && (
            <SharedQuestion
              link={deepLink}
              onContinue={handleContinueFromShared}
              onHome={handleHome}
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
              onJoinLeaderboard={handleSettings}
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
