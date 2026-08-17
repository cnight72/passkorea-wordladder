export interface Profile {
  playerName: string;
  countryCode: string;
  bestScore: number;
  gamesPlayed: number;
}

const STORAGE_KEY = 'passkorea.profile';

const DEFAULT_PROFILE: Profile = {
  playerName: '',
  countryCode: 'NP',
  bestScore: 0,
  gamesPlayed: 0,
};

export function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };

    const parsed = JSON.parse(raw) as Partial<Profile>;
    return {
      playerName:
        typeof parsed.playerName === 'string' ? parsed.playerName : DEFAULT_PROFILE.playerName,
      countryCode:
        typeof parsed.countryCode === 'string' ? parsed.countryCode : DEFAULT_PROFILE.countryCode,
      bestScore: typeof parsed.bestScore === 'number' ? parsed.bestScore : 0,
      gamesPlayed: typeof parsed.gamesPlayed === 'number' ? parsed.gamesPlayed : 0,
    };
  } catch {
    // 저장된 값이 깨졌거나 localStorage 접근이 막힌 경우 기본값 사용
    return { ...DEFAULT_PROFILE };
  }
}

export function saveProfile(profile: Profile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // 사파리 프라이빗 모드 등 저장이 불가능한 환경은 무시하고 진행
  }
}
