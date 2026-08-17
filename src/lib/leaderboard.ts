import { getFirebase } from './firebase';

/** 한 번에 읽어올 최대 플레이어 수. 이 규모를 넘으면 서버 집계로 바꿔야 한다. */
const MAX_PLAYERS = 1000;

const PLAYERS = 'players';

export interface CountryStanding {
  countryCode: string;
  /** 참여자 수 */
  players: number;
  /** 참여자들의 최고 점수 평균 */
  averageScore: number;
  /** 그 나라 최고 점수 */
  topScore: number;
}

export interface LeaderboardData {
  standings: CountryStanding[];
  totalPlayers: number;
}

/**
 * 게임 결과를 서버에 반영한다.
 * 플레이어당 문서 하나만 두고 최고 점수를 갱신하는 방식이라
 * 판수가 늘어도 문서가 불어나지 않는다.
 */
export async function submitScore(params: {
  playerName: string;
  countryCode: string;
  bestScore: number;
  gamesPlayed: number;
}): Promise<boolean> {
  const fb = await getFirebase();
  if (!fb) return false;

  const { doc, setDoc, serverTimestamp } = fb.firestore;

  try {
    await setDoc(
      doc(fb.db, PLAYERS, fb.uid),
      {
        name: params.playerName.slice(0, 20),
        country: params.countryCode,
        bestScore: params.bestScore,
        gamesPlayed: params.gamesPlayed,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return true;
  } catch {
    // 오프라인이거나 규칙에 막히면 조용히 넘어간다. 게임은 계속돼야 한다.
    return false;
  }
}

/**
 * 국가별 순위를 만든다.
 * 총점이 아니라 평균으로 세우는 이유: 총점은 사람이 많은 나라가 무조건 이기고,
 * 참여자가 적은 초기에는 대부분 0으로 보여 죽은 화면이 된다.
 */
export async function fetchLeaderboard(): Promise<LeaderboardData | null> {
  const fb = await getFirebase();
  if (!fb) return null;

  const { collection, getDocs, limit, query } = fb.firestore;

  try {
    const snapshot = await getDocs(query(collection(fb.db, PLAYERS), limit(MAX_PLAYERS)));

    const byCountry = new Map<string, number[]>();
    let totalPlayers = 0;

    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as { country?: unknown; bestScore?: unknown };
      const country = typeof data.country === 'string' ? data.country : null;
      const score = typeof data.bestScore === 'number' ? data.bestScore : null;
      if (!country || score === null) return;

      totalPlayers += 1;
      const scores = byCountry.get(country) ?? [];
      scores.push(score);
      byCountry.set(country, scores);
    });

    const standings: CountryStanding[] = [...byCountry.entries()]
      .map(([countryCode, scores]) => ({
        countryCode,
        players: scores.length,
        averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
        topScore: Math.max(...scores),
      }))
      .sort((a, b) => b.averageScore - a.averageScore || b.players - a.players);

    return { standings, totalPlayers };
  } catch {
    return null;
  }
}
